# Decentralized App Template

Ethereum frontend app template with the following features:

- [Vue 3](https://v3.vuejs.org/) as the foundation
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Nightwind](https://github.com/jjranalli/nightwind) for easy dark mode support
- [Ethers](https://docs.ethers.io/v5/single-page/) for interacting with Ethereum
- [Vite](https://vitejs.dev/) for 10x-100x faster builds
- [vue-dapp](https://github.com/chnejohnson/vue-dapp) for the wallet connect

## Setup

```sh
# Install packages
yarn install

# Run in development mode
yarn dev

# Compiles and minifies for production
yarn build

# Format files
yarn prettier

# Run linter
yarn lint

### Run your unit tests and end-to-end tests (not yet setup)
yarn test:unit
yarn test:e2e
```

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

## Notes / Customization

Notes on customizing this app:

- Primary and secondary theme colors are defined in `tailwind.config.js`. Other colors are inlined as classes, e.g. `text-gray-400`.
- Dark mode is handled with [Nightwind](https://github.com/jjranalli/nightwind), which is a Tailwind CSS plugin that generates a dark theme by automatically inverting color classes. The resulting dark mode will not look as a good as a fully customized/hand-crafted dark mode, but this is much less work to implement, and Nightwind does offer some control over the output
- Vite does not use `process.env.MY_VARIABLE` for environment variables, but instead uses `import.meta.env.VITE_MY_VARIABLE`. Values in `.env` that are prefixed with `VITE_` are automatically included. Update the type definitions in `src/shims.d.ts` for any new environment variables
- The Vue router is configured to use `history` mode and assumes the app is hosted at the domain root. Both of these defaults can be changed in `src/router/index.ts`
- Vue Dapp [vue-dapp](https://github.com/chnejohnson/vue-dapp) is used for connecting wallets.
- The store modules live in `src/store`, and there are three setup by default
  - `wallet.ts` manages the user's wallet connection
  - `data.ts` atomically polls for data each block using `Multicall2`
  - `settings.ts` saves and manages user settings such as dark mode and wallet selection


## Inspiration

- [vue3-dapp-starter](https://github.com/chnejohnson/vue3-dapp-starter)
- [vue-tailwind-ethereum-template](https://github.com/ScopeLift/vue-tailwind-ethereum-template)