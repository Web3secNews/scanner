export const useWalletAddress = () => useState("address", () => {
  const route = useRoute();
  return "address" in route.params ? route.params.address as string : "";
});
