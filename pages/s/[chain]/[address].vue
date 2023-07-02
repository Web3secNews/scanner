<script setup lang="ts">
import {
  ShieldCheckIcon,
  ShieldExclamationIcon,
} from "@heroicons/vue/24/outline";

const router = useRouter();
const route = useRoute();

const { data: chains } = useFetch("/api/chains");

const address = useState("address", () =>
  "address" in route.params ? route.params.address : ""
);

const chainId = "chain" in route.params ? route.params.chain : undefined;

const defaultChain = {
  id: 1,
  name: "ethereum",
};

const chain = useState("selected-chain", () =>
  chains.value
    ? (chains.value as typeof defaultChain[])[chainId ? Number(chainId) - 1 : 0]
    : defaultChain
);

const { error, data, pending, refresh } = useFetch(
  `/api/s/${chain.value.id}/${address.value}`,
  {
    watch: [address, chain],
  }
);

watch(route, () => {
  if ("address" in route.params) {
    address.value = route.params.address;
  }

  if ("chain" in route.params) {
    chain.value = chains.value
      ? (chains.value as typeof defaultChain[])[Number(route.params.chain) - 1]
      : defaultChain;
  }
})

</script>

<template>
  <main v-if="data?.generalIssues" class="bg-gray-800 border-gray-700 m-4">
    <div class="py-4 border-b border-gray-700 px-4">
      <h1 class="text-xl font-bold">Token Detectors</h1>
    </div>
    <div
      :class="[
        'flex gap-2 mx-4 py-4 border-b border-gray-700',
        pending ? 'animate-pulse' : '',
      ]"
      v-for="issue in data.generalIssues"
      :key="issue.scwId"
    >
      <div class="flex gap-2">
        <ShieldExclamationIcon
          class="shrink-0 w-7 h-7 text-red-400"
          v-if="
            data?.highRisk?.find(
              (highRiskIssue) => highRiskIssue.scwId === issue.scwId
            )
          "
        />
        <ShieldCheckIcon class="shrink-0 w-7 h-7 text-green-400" v-else />

        <div class="flex flex-col">
          <div class="text-lg font-bold text-gray-300">
            {{ issue.scwTitle }}
          </div>
          <div
            :class="
              issue.scwTitle
                ? 'text-base text-gray-400'
                : 'text-lg font-bold text-gray-300'
            "
          >
            {{ issue.scwDescription }}
          </div>
        </div>
      </div>
    </div>
  </main>

  <div v-else>
    <h1 class="text-xl font-bold m-2 md:m-6 text-center text-gray-400">Uh oh, seems like we couldn't find that address.</h1>
  </div>
</template>
