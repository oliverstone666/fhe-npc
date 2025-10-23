import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  coinbaseWallet,
  metaMaskWallet,
  rabbyWallet,
  walletConnectWallet,
  injectedWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { createConfig, createStorage, http, noopStorage } from 'wagmi';
import { sepolia } from 'wagmi/chains';

const walletConnectProjectId = 'a4b9080b1f69467cb2da35886bfa07aa';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet,
        rabbyWallet,
        coinbaseWallet,
        walletConnectWallet,
        injectedWallet,
      ],
    },
  ],
  {
    appName: 'Zama Encrypted Quest',
    projectId: walletConnectProjectId,
  },
);

export const config = createConfig({
  chains: [sepolia],
  connectors,
  storage: createStorage({ storage: noopStorage }),
  transports: {
    [sepolia.id]: http('https://rpc.sepolia.org'),
  },
  ssr: false,
});
