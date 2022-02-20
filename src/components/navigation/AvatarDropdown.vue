<!-- eslint-disable max-len -->
// https://www.youtube.com/watch?v=SGVSvi1OxE8&list=RDCMUCtb40EQj2inp8zuaQlLx3iQ&index=2
<template>
  <div class="relative">
    <a
      href="#"
      class="flex items-center group ml-5"
      v-click-away="hideDropdown"
      @click.prevent="toggleDropdown"
      @keydown.space.exact.prevent="toggleDropdown"
      @keydown.esc.exact="hideDropdown"
      @keydown.shift.tab="hideDropdown"
      @keydown.up.exact.prevent="startArrowKeys"
      @keydown.down.exact.prevent="startArrowKeys"
    >
      <!-- Code block starts -->
      <div
        class="
          w-12
          h-12
          mb-4
          lg:mb-0
          bg-cover
          rounded-full
          mr-2
          relative
          flex
          justify-center
          items-center
          bg-gray-100
          group-hover:bg-gray-200
          dark:bg-gray-800
          shadow-md
        "
      >
        <!-- Show green dot -->
        <!-- <div
          class="
            h-2
            w-2
            bg-green-400
            rounded-full
            absolute
            right-0
            top-0
            mt-2
            border border-white
            group-hover:bg-green-600
          "
        ></div> -->
        <div v-html="jidenticon"></div>
      </div>
      <svg
        v-show="avatar_menu_show"
        id="upIcon1"
        xmlns="http://www.w3.org/2000/svg"
        class="icon icon-tabler icon-tabler-chevron-up"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="white"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <polyline points="6 15 12 9 18 15"></polyline>
      </svg>
      <svg
        v-show="!avatar_menu_show"
        id="downIcon1"
        xmlns="http://www.w3.org/2000/svg"
        class="icon icon-tabler icon-tabler-chevron-down"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="white"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </a>

    <transition name="dropdown-fade">
      <div v-show="avatar_menu_show">
        <!-- Drowpdown menu options  -->
        <ul
          ref="dropdown"
          class="
            absolute
            normal-case
            font-normal
            xs:left-0
            lg:right-0
            bg-white
            shadow
            overflow-hidden
            rounded
            w-48
            border
            mt-2
            py-1
            lg:z-20
          "
        >
          <li>
            <a
              href="./settings"
              ref="settings"
              class="flex items-center px-3 py-3 hover:bg-gray-200"
              @keydown.up.exact.prevent=""
              @keydown.tab.exact="focusNext(false)"
              @keydown.down.exact.prevent="focusNext(true)"
              @keydown.esc.exact="hideDropdown"
              @keydown.shift.tab="hideDropdown"
            >
              <svg
                fill="currentColor"
                class="text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path
                  class="heroicon-ui"
                  d="M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm9 11a1 1 0 0 1-2 0v-2a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v2a1 1 0 0 1-2 0v-2a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v2z"
                ></path>
              </svg>
              <span class="text-gray-600 ml-2">Settings</span>
            </a>
          </li>
          <!-- Separator !!! -->
          <hr class="h-0 my-2 border border-solid border-t-0 border-gray-700 opacity-25" />
          <li class="divide-y" @click.prevent="disconnect">
            <a
              href=""
              class="flex items-center px-3 py-3 hover:bg-gray-200 divide-y-5"
              @keydown.shift.tab="focusPrevious(false)"
              @keydown.up.exact.prevent="focusPrevious(true)"
              @keydown.down.exact.prevent=""
              @keydown.tab.exact="hideDropdown"
              @keydown.esc.exact="hideDropdown"
            >
              <svg
                fill="currentColor"
                class="text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
                ></path>
              </svg>
              <span class="text-gray-600 ml-2">Disconnect</span>
            </a>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import useWalletStore from 'src/store/wallet';
import { toSvg } from 'jdenticon';
const { userAddress } = useWalletStore();

const router = useRouter();
const dropdown: any = ref(null);
const avatar_menu_show = ref<boolean>(false);
let focusedIndex = 0;

const jidenticon = computed(() => toSvg(userAddress, 50));

const disconnect = async () => {
  const { disconnectWallet } = useWalletStore();
  await disconnectWallet();
  router.push({ name: 'home' });
};

const toggleDropdown = () => {
  avatar_menu_show.value = !avatar_menu_show.value;
};

const hideDropdown = () => {
  avatar_menu_show.value = false;
  focusedIndex = 0;
};

const startArrowKeys = () => {
  try {
    if (avatar_menu_show.value && dropdown?.value) {
      dropdown.value.children[0].children[0].focus();
      focusedIndex = 0;
    }
  } catch {
    /* left blank */
  }
};
const focusPrevious = (isArrowKey: boolean) => {
  focusedIndex -= 1;
  if (isArrowKey) {
    focusItem();
  }
};
const focusNext = (isArrowKey: boolean) => {
  focusedIndex += 1;
  if (isArrowKey) {
    focusItem();
  }
};

const focusItem = () => {
  try {
    if (dropdown.value.children[focusedIndex]?.children[0]) {
      dropdown.value.children[focusedIndex].children[0].focus();
    } else {
      dropdown.value.children[focusedIndex].focus();
    }
  } catch {
    /* left blank */
  }
};
</script>

<style scoped>
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.5s ease-in-out;
}
.dropdown-fade-enter,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
