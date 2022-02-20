<template>
  <div>
    <div
      class="pb-4"
      :class="{
        'text-primary-900 bg-secondary': !isDark,
        'text-secondary bg-primary-500': isDark,
      }"
    >
      <div class="flex items-center justify-end bg-primary-500 pt-4">
        <span
          :class="{ 'bg-primary-200': !isDark, 'bg-primary-600': isDark }"
          class="
            relative
            inline-block
            flex-no-shrink
            h-6
            w-11
            border-2 border-transparent
            rounded-full
            cursor-pointer
            transition-colors
            ease-in-out
            duration-200
            focus:outline-none focus:shadow-outline
          "
          role="checkbox"
          tabindex="0"
          @click="toggleDarkMode"
          @keydown.space.prevent="toggleDarkMode"
          :aria-checked="isDark"
        >
          <span
            aria-hidden="true"
            :class="{ 'translate-x-3': isDark, '-translate-x-3': !isDark }"
            class="
              relative
              inline-block
              h-5
              w-5
              rounded-full
              bg-white
              shadow
              transform
              transition
              ease-in-out
              duration-200
            "
          >
            <span
              :class="{
                'opacity-0 ease-out duration-100': isDark,
                'opacity-100 ease-in duration-200': !isDark,
              }"
              class="absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
            >
              <SunIcon class="h-3 w-3 text-yellow-500" />
            </span>
            <span
              :class="{
                'opacity-100 ease-in duration-200': isDark,
                'opacity-0 ease-out duration-100': !isDark,
              }"
              class="absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
            >
              <MoonIcon class="h-3 w-3 text-primary-600" />
            </span>
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { MoonIcon, SunIcon } from '@heroicons/vue/solid';
import useSettingsStore from 'src/store/settings';

export default defineComponent({
  name: 'LayoutFooter',
  components: { MoonIcon, SunIcon },
  setup() {
    const { isDark, toggleDarkMode } = useSettingsStore();
    return {
      isDark,
      toggleDarkMode,
    };
  },
});
</script>

<style></style>
