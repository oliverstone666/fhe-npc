import { CONFIDENTIAL_GAME_COIN_ABI } from './abi/confidentialGameCoin';
import { GAME_ITEM_NFT_ABI } from './abi/gameItemNft';
import { ZAMA_QUEST_ABI } from './abi/zamaQuest';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

function resolveAddress(envKey: string): `0x${string}` {
  const value = import.meta.env[envKey as keyof ImportMetaEnv];
  if (typeof value === 'string' && value.startsWith('0x') && value.length === 42) {
    return value as `0x${string}`;
  }
  return ZERO_ADDRESS as `0x${string}`;
}

export const ZAMA_QUEST_ADDRESS = resolveAddress('VITE_ZAMA_QUEST_ADDRESS');
export const GAME_ITEM_NFT_ADDRESS = resolveAddress('VITE_GAME_ITEM_NFT_ADDRESS');
export const CONFIDENTIAL_GAME_COIN_ADDRESS = resolveAddress('VITE_CONFIDENTIAL_GAME_COIN_ADDRESS');

export const ZAMA_QUEST_CONTRACT = {
  address: ZAMA_QUEST_ADDRESS,
  abi: ZAMA_QUEST_ABI,
} as const;

export const GAME_ITEM_NFT_CONTRACT = {
  address: GAME_ITEM_NFT_ADDRESS,
  abi: GAME_ITEM_NFT_ABI,
} as const;

export const CONFIDENTIAL_GAME_COIN_CONTRACT = {
  address: CONFIDENTIAL_GAME_COIN_ADDRESS,
  abi: CONFIDENTIAL_GAME_COIN_ABI,
} as const;
