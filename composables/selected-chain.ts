const defaultChain = {
  id: 1,
  name: "ethereum",
};

export const useSelectedChain = () =>
  useState("selected-chain", () => {
    const route = useRoute();
    const chains = useFetch("/api/chains");
    const chainId = route.query.chain;

    if (chainId) {
      return { id: +chainId, name: chains.data.value?.find((c) => c.id === +chainId)?.name };
    }

    return defaultChain;
  });
