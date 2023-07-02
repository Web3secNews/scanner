<script lang="ts" setup>
import { CheckIcon, ChevronDownIcon } from "@heroicons/vue/20/solid";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";

const route = useRoute();

const { data: chains, pending } = useFetch("/api/chains");

const chainId = "chain" in route.params ? route.params.chain : undefined;

const defaultChain = {
  id: 1,
  name: "ethereum",
};

const selectedChain = useState("selected-chain", () =>
  chains.value
    ? (chains.value as typeof defaultChain[])[chainId ? Number(chainId) - 1 : 0]
    : defaultChain
);

const walletAddress = useState("address", () =>
  "address" in route.params ? route.params.address : ""
);

</script>

<template>
  <section
    class="py-10 flex items-center flex-col bg-gray-800 border-b border-b-gray-700"
  >
    <div class="flex flex-col gap-2 items-center">
      <h1 class="text-4xl font-bold text-white">Scan Token</h1>
      <p class="text-gray-400 text-lg text-center">Fast token security detection scanner</p>
    </div>

    <form
      class="w-full flex flex-col items-center px-4 md:px-0"
      @submit.prevent="$router.push(`/s/${selectedChain.id}/${walletAddress}`)"
    >
      <div class="flex gap-2 mt-6 w-full max-w-xl">
        <Listbox v-model="selectedChain">
          <div class="relative">
            <ListboxButton
              class="relative w-full cursor-default bg-gray-700 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-green-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
            >
              <span class="block truncate">{{ selectedChain.name }}</span>
              <span
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
              >
                <ChevronDownIcon
                  class="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </ListboxButton>

            <transition>
              <ListboxOptions
                class="absolute mt-1 max-h-60 w-full overflow-auto bg-gray-700 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm no-scrollbar"
              >
                <ListboxOption
                  v-slot="{ active, selected }"
                  v-for="chain in chains"
                  :key="chain.name"
                  :value="chain"
                  as="template"
                >
                  <li
                    :class="[
                      active ? 'bg-gray-600 text-gray-100' : 'text-gray-400',
                      'relative cursor-default select-none py-2 px-4',
                    ]"
                  >
                    <span
                      :class="[
                        selected ? 'font-medium' : 'font-normal',
                        'block truncate',
                      ]"
                      >{{ chain.name }}
                    </span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>
        <input
          placeholder="Type Wallet Address..."
          class="bg-gray-700 w-full px-4"
          v-model="walletAddress"
        />
      </div>
      <button
        class="flex gap-2 mt-3 w-full max-w-xl bg-green-600 py-2 items-center justify-center cursor-default active:scale-[97%] transition-all duration-300 focus:ring-2 ring-green-500 mx-4 md:mx-0"
      >
        Scan
      </button>
    </form>
  </section>

  <slot />
</template>
