import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? '';

export const config = getDefaultConfig({
  appName: 'Zama Encrypted Quest',
  projectId,
  chains: [sepolia],
  ssr: false,
});
