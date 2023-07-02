export default defineEventHandler(async (event) => {
  const { data, errors } = await defi.query({
    chains: {
      id: true,
      name: true,
    }
  });

  if (errors) {
    console.log(errors);
    setResponseStatus(event, 500);
    return sendError(event, new Error("internal error", { cause: errors }));
  }
  
  return data?.chains!;
});

