<template>
  <!-- Header -->
  <header id="header" class="w-full px-4 bg-primary-500">
    <div class="flex justify-between p-4 px-3">
      <nav class="w-full">
        <div class="flex items-center justify-between">
          <!-- App Name -->
          <router-link
            :to="{ name: 'home' }"
            class="text-white hover:text-green-100 font-bold uppercase text-2xl mr-4"
            exact-active-class="no-active"
          >
            <div class="flex space-x-4 items-center">
              <!-- logo -->
              <img class="h-10 min-w-10" src="../assets/logo.png" alt="logo" />
              <p>Vue 3 Dapp</p>
            </div>
          </router-link>
          <div class="flex items-center space-x-10">
            <theme-switcher></theme-switcher>

            <!-- Primary Navigation -->
            <router-link
              v-for="link in navigation"
              :key="link.name"
              :to="link.href"
              exact
              class="text-white hover:text-green-100"
            >
              {{ link.name }}
            </router-link>

            <div v-if="isActivated" class="flex items-center">
              <!-- Account -->
              <div class="sm:hidden py-2 px-3 rounded-2xl inline-block bg-gray-100">
                {{ userDisplayName }}
              </div>

              <div class="hidden sm:flex py-1 px-2 flex items-center rounded-3xl border border-solid">
                <div class="px-1 mr-1 text-blue-100">{{ displayEther(balance) }} ETH</div>
                <div class="py-2 px-3 rounded-2xl inline-block bg-yellow-100">
                  {{ userDisplayName }}
                </div>
              </div>

              <avatar-dropdown></avatar-dropdown>
            </div>
            <div v-else-if="!isSupportedNetwork" class="flex items-center">
              <ExclamationIcon class="h-5 w-5 text-yellow-500 mr-2" />
              <div class="text-secondary-500">Unsupported network</div>
            </div>

            <button v-else @click="connectWallet" class="btn btn-secondary">Connect Wallet</button>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useWalletStore from 'src/store/wallet';
import { ExclamationIcon } from '@heroicons/vue/solid';
import { useEthers, displayEther } from 'vue-dapp';
import AvatarDropdown from './navigation/AvatarDropdown.vue';
import ThemeSwitcher from './ThemeSwitcher.vue';

// Header menu bar items
const navigation: { name: string; href: string }[] = [
  {
    name: 'About',
    href: '/about',
  },
];

export default defineComponent({
  name: 'LayoutHeader',
  components: { ExclamationIcon, AvatarDropdown, ThemeSwitcher },
  setup() {
    const { balance } = useEthers();
    const { connectWallet, isSupportedNetwork, userDisplayName, userShortAddress, isActivated } = useWalletStore();
    return {
      connectWallet,
      isSupportedNetwork,
      navigation,
      userDisplayName,
      userShortAddress,
      open,
      isActivated,
      balance,
      displayEther,
    };
  },
});
</script>
