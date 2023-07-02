type ProjectMetadata = {
  categories: string[];
  id: number;
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  displayName: string;
  price: number;
  rank: number;
  icon: string;
  decimals: number;
  metadata: {
    coingeckoId: string;
    marketCapRank: number;
  };
};

export default defineEventHandler(async (event) => {
  const address = event.context.params?.address;
  const chainId = event.context.params?.chain;

  if (!address) {
    setResponseStatus(event, 400);
    return sendError(event, new Error("invalid request"));
  }

  type Project = {
    id: string;
    generalIssues: {
      scwId: string;
      scwTitle: string;
      scwDescription: string;
      issues:
        | {
            id: string;
            confidence: string;
            start: number;
            end: number;
            snippet: string;
            impact: string;
            description: string;
            severityChanges:
              | {
                  to: string;
                  from: string;
                  reason: string;
                }[]
              | undefined;
          }[]
        | undefined;
    }[];
  };

  const { data, errors } = await defi.query({
    scannerProject: [
      {
        where: {
          address: address,
          chainId: chainId ? +chainId : 3,
        },
      },
      {
        id: true,
        generalIssues: {
          scwId: true,
          scwTitle: true,
          scwDescription: true,
          issues: {
            id: true,
            confidence: true,
            start: true,
            end: true,
            snippet: true,
            impact: true,
            description: true,
            severityChanges: {
              to: true,
              from: true,
              reason: true,
            },
          },
        },
      },
    ],
  });

  if (errors) {
    console.error(errors);
    setResponseStatus(event, 500);
    return sendError(event, new Error("internal error", { cause: errors }));
  }

  let project = data?.scannerProject as Project | undefined;

  if (!project) {
    setResponseStatus(event, 404);
    return sendError(event, new Error("project not found"));
  }

  const highRisk = project.generalIssues.filter((issue) =>
    issue.issues?.some((issue) => issue.confidence.toLowerCase() === "high")
  );

  return {
    ...project,
    highRisk,
  };
});
