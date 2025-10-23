/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ZAMA_QUEST_ADDRESS?: string;
  readonly VITE_GAME_ITEM_NFT_ADDRESS?: string;
  readonly VITE_CONFIDENTIAL_GAME_COIN_ADDRESS?: string;
  readonly VITE_WALLETCONNECT_PROJECT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  ethereum?: unknown;
}

declare module '*.css';
declare module '@rainbow-me/rainbowkit/styles.css';
