/**
 * @dev Information about the user's wallet, network, etc. are stored and managed here
 *
 * @dev State is handled in reusable components, where each component is its own self-contained file consisting of
 * one function defined used the composition API. Since we want the wallet state to be shared between all instances
 * when this file is imported, we defined state outside of the function definition.
 *
 * @dev When assigning ethers objects as refs, we must wrap the object in `markRaw` for assignment. This is not required
 * with Vue 2's reactivity system based on Object.defineProperty, but is required for Vue 3's reactivity system based
 * on ES6 proxies. The Vue 3 reactivity system does not work well with non-configurable, non-writable properties on
 * objects, and many ethers classes, such as providers and networks, use non-configurable or non-writable properties.
 * Therefore we wrap the object in `markRaw` to prevent it from being converted to a Proxy. If you do not do this,
 * you'll see errors like this when using ethers objects as refs:
 *     Uncaught (in promise) TypeError: 'get' on proxy: property '_network' is a read-only and non-configurable data
 *     property on the proxy target but the proxy did not return its actual value (expected '#<Object>' but got
 *     '[object Object]')
 * Read more here:
 *     - https://stackoverflow.com/questions/65693108/threejs-component-working-in-vuejs-2-but-not-3
 *     - https://github.com/vuejs/vue-next/issues/3024
 *     - https://v3.vuejs.org/api/basic-reactivity.html#markraw
 */

import { computed, ref, markRaw, watch } from 'vue';
import useDataStore from 'src/store/data';
import useSettingsStore from 'src/store/settings';
import { JsonRpcProvider, JsonRpcSigner, Network, Web3Provider } from 'src/utils/ethers';
import { formatAddress } from 'src/utils/formatters';

import { useBoard, useEthers, useEthersHooks, useWallet, WalletName, shortenAddress } from 'vue-dapp';

import { RPC_URL } from 'src/utils/constants';

const { startPolling } = useDataStore();
const { setLastWallet, clearLastWallet } = useSettingsStore();
const defaultProvider = new JsonRpcProvider(RPC_URL);

const { open } = useBoard();
const { isActivated } = useEthers();
const { connect, error } = useWallet();

// State variables
let useDapInitialized = false;
const supportedChainIds = [1, 4, 1337, 137]; // chain IDs supported by this app
const rawProvider = ref<any>(); // raw provider from the user's wallet, e.g. EIP-1193 provider
const provider = ref<Web3Provider | JsonRpcProvider>(defaultProvider); // ethers provider
const signer = ref<JsonRpcSigner>(); // ethers signer
const userAddress = ref<string>(); // user's wallet address
const userEns = ref<string>(); // user's ENS name
const network = ref<Network>(); // connected network, derived from provider

// Reset state when, e.g.user switches wallets. Provider/signer are automatically updated by ethers so are not cleared
function resetState() {
  userAddress.value = undefined;
  network.value = undefined;
}

// Settings
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const infuraApiKey = import.meta.env.VITE_INFURA_API_KEY;

export default function useWalletStore() {
  // ------------------------------------------------ Wallet Connection ------------------------------------------------
  /**
   * @notice Initialize the useDapp module
   */
  function initializeUseDapp() {
    if (!useDapInitialized) {
      const { onActivated, onDeactivated, onChanged } = useEthersHooks();
      const { onDisconnect, error } = useWallet();

      // watch(status, async (val, oldVal) => {
      //   console.log('status: ', val, oldVal);
      // });
      onDisconnect(() => {
        clearLastWallet();
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      watch(error, async (val, oldVal) => {
        //console.log('error: ', val);
        clearLastWallet();
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onActivated(({ provider, address }) => {
        setProvider(provider);
        const { url } = provider.connection;
        if (url) {
          setLastWallet(url);
          configureProvider();
        }
      });

      onDeactivated(() => {
        //console.log('deactivated');
        clearLastWallet();
      });

      onChanged((data) => {
        //console.log('onChanged');
        const { provider } = data;
        setProvider(provider);
        configureProvider();
      });

      useDapInitialized = true;
    }
  }

  /**
   * @notice Prompt user to connect wallet, or attempt to connect to wallet specified by `name`
   * @param name Wallet name to connect, or undefined to prompt user to select a wallet
   */
  async function disconnectWallet() {
    // If not connected
    if (!userAddress.value) return;
    const { disconnect } = useWallet();
    await disconnect();
  }
  /**
   * @notice Prompt user to connect wallet, or attempt to connect to wallet specified by `name`
   * @param name Wallet name to connect, or undefined to prompt user to select a wallet
   */
  async function connectWallet(name: string | undefined | MouseEvent = undefined) {
    // If user already connected wallet, return
    if (userAddress.value) return;

    // If input type is MouseEvent, this method was ran from clicking a DOM element, so set name to undefined
    if (name && typeof name !== 'string' && 'pageX' in name) name = undefined;

    initializeUseDapp();
    if (name) {
      await connect(name as WalletName);
    } else {
      // Otherwise, prompt them for connection / wallet change
      open();
    }
  }

  // ----------------------------------------------------- Actions -----------------------------------------------------

  // When user connects their wallet, we call this method to update the provider
  function setProvider(p: any) {
    rawProvider.value = p;
  }

  // Any actions or data to fetch dependent on user's wallet are done here
  async function configureProvider() {
    // Set network/wallet properties
    if (!rawProvider.value) return;
    const _provider = rawProvider.value; //new Web3Provider(rawProvider.value);
    const _signer = _provider.getSigner();

    // Get user and network information
    const [_userAddress, _network] = await Promise.all([
      _signer.getAddress(), // get user's address
      _provider.getNetwork(), // get information on the connected network
    ]);

    console.log(_userAddress, _network);
    // If nothing has changed, no need to continue configuring
    if (_userAddress === userAddress.value && _network.chainId === network.value?.chainId) return;

    // Clear state
    resetState();

    // Exit if not a valid network
    const chainId = _provider.network.chainId; // must be done after the .getNetwork() call

    if (!supportedChainIds.includes(chainId)) {
      network.value = markRaw(_network); // save network for checking if this is a supported network
      return;
    }

    // Get ENS name
    let _userEns;
    try {
      _userEns = await _provider.lookupAddress(_userAddress);
    } catch {
      /*  Left Blank   */
    }

    // Now we save the user's info to the store. We don't do this earlier because the UI is reactive based on these
    // parameters, and we want to ensure this method completed successfully before updating the UI
    provider.value = markRaw(_provider);
    signer.value = _signer;
    userAddress.value = _userAddress;
    userEns.value = _userEns;
    network.value = markRaw(_network);

    // Start polling for data
    startPolling();
  }

  // ---------------------------------------------------- Exports ----------------------------------------------------
  // Define parts of the store to expose. Only expose computed properties or methods to avoid direct mutation of state
  return {
    // Methods
    configureProvider,
    connectWallet,
    disconnectWallet,
    setProvider,
    // Properties
    isSupportedNetwork: computed(() => (network.value ? supportedChainIds.includes(network.value.chainId) : true)), // assume valid if we have no network information
    network: computed(() => network.value),
    provider: computed(() => provider.value),
    signer: computed(() => signer.value),
    userAddress: computed(() => userAddress.value),
    userShortAddress: computed(() => (userAddress?.value ? shortenAddress(userAddress.value) : null)),
    userDisplayName: computed(() => userEns.value || formatAddress(userAddress.value || '')),
    isActivated: computed(
      () =>
        isActivated.value && !error.value && (network.value ? supportedChainIds.includes(network.value.chainId) : true)
    ),
    isError: computed(() => error.value),
    error: computed(() => error.value),
  };
}
