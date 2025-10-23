import { useCallback, useEffect, useMemo, useState } from 'react';
import { BrowserProvider, Contract, TransactionReceipt, TransactionResponse } from 'ethers';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { initSDK, createInstance, SepoliaConfig, type FhevmInstance } from '@zama-fhe/relayer-sdk/bundle';

import {
  CONFIDENTIAL_GAME_COIN_CONTRACT,
  GAME_ITEM_NFT_CONTRACT,
  ZAMA_QUEST_CONTRACT,
  GAME_ITEM_NFT_ADDRESS,
} from '../config/contracts';

type PlayerProgress = {
  npc1Assigned: boolean;
  npc1Unlocked: boolean;
  npc1Completed: boolean;
  npc1HasPending: boolean;
  npc1PendingRequestId: bigint;
  npc2Unlocked: boolean;
  npc2Completed: boolean;
  npc2TokenId: bigint;
  rewardMinted: boolean;
};

type UiNotice = {
  kind: 'info' | 'error' | null;
  message: string;
};

const ZERO_HANDLE = '0x0000000000000000000000000000000000000000000000000000000000000000';

export function QuestApp() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [fheReady, setFheReady] = useState(false);
  const [fheInstance, setFheInstance] = useState<FhevmInstance | null>(null);
  const [publicKey, setPublicKey] = useState<string>('');
  const [privateKey, setPrivateKey] = useState<string>('');
  const [status, setStatus] = useState<PlayerProgress | null>(null);
  const [npc1Amount, setNpc1Amount] = useState<bigint | null>(null);
  const [mintedItemId, setMintedItemId] = useState<bigint | null>(null);
  const [notice, setNotice] = useState<UiNotice>({ kind: null, message: '' });
  const [isBusy, setIsBusy] = useState(false);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const questConfigured = useMemo(() => ZAMA_QUEST_CONTRACT.address !== ('0x0000000000000000000000000000000000000000' as `0x${string}`), []);

  useEffect(() => {
    if (!questConfigured) {
      setNotice({ kind: 'error', message: 'Contract addresses missing. Update the environment variables.' });
    }
  }, [questConfigured]);

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      if (typeof window === 'undefined' || fheReady) {
        return;
      }

      try {
        await initSDK();
        const injected = (window as Window & { ethereum?: unknown }).ethereum;
        const instance = await createInstance({ ...SepoliaConfig, network: (injected ?? undefined) as any });
        if (cancelled) return;
        const keypair = instance.generateKeypair();
        setFheInstance(instance);
        setPublicKey(keypair.publicKey);
        setPrivateKey(keypair.privateKey);
        setFheReady(true);
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setNotice({ kind: 'error', message: 'Failed to initialise FHE SDK. Please refresh the page.' });
        }
      }
    };

    void init();
    return () => {
      cancelled = true;
    };
  }, [fheReady]);

  useEffect(() => {
    if (!isConnected || !address || !publicClient || !questConfigured) {
      setStatus(null);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const result = await publicClient.readContract({
          address: ZAMA_QUEST_CONTRACT.address,
          abi: ZAMA_QUEST_CONTRACT.abi,
          functionName: 'getPlayerProgress',
          args: [address as `0x${string}`],
        });

        if (!cancelled) {
          const progress: PlayerProgress = {
            npc1Assigned: result[0],
            npc1Unlocked: result[1],
            npc1Completed: result[2],
            npc1HasPending: result[3],
            npc1PendingRequestId: result[4],
            npc2Unlocked: result[5],
            npc2Completed: result[6],
            npc2TokenId: result[7],
            rewardMinted: result[8],
          };
          setStatus(progress);
          if (progress.npc2TokenId > 0n) {
            setMintedItemId(progress.npc2TokenId);
          }
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setNotice({ kind: 'error', message: 'Unable to fetch quest status. Check your network connection.' });
        }
      }
    };

    void load();

    const interval = window.setInterval(load, 12000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [address, isConnected, publicClient, questConfigured, refreshIndex]);

  const refreshStatus = useCallback(() => {
    setRefreshIndex((value: number) => value + 1);
  }, []);

  const getSigner = useCallback(async () => {
    if (typeof window === 'undefined') {
      throw new Error('Wallet not detected. Connect a wallet to continue.');
    }
    const rawProvider = (window as Window & { ethereum?: unknown }).ethereum;
    if (!rawProvider) {
      throw new Error('Wallet not detected. Connect a wallet to continue.');
    }
    const provider = new BrowserProvider(rawProvider as any);
    return provider.getSigner();
  }, []);

  const withTransaction = useCallback(
    async (
      label: string,
      action: () => Promise<TransactionResponse>,
      onReceipt?: (receipt: TransactionReceipt, response: TransactionResponse) => void | Promise<void>,
    ) => {
      setIsBusy(true);
      setNotice({ kind: 'info', message: `${label} pending...` });
      try {
        const response = await action();
        const receipt = await response.wait();
        if (receipt?.status !== 1) {
          throw new Error('Transaction reverted');
        }
        if (onReceipt) {
          await onReceipt(receipt, response);
        }
        setNotice({ kind: 'info', message: `${label} confirmed.` });
        refreshStatus();
      } catch (error) {
        console.error(error);
        setNotice({ kind: 'error', message: error instanceof Error ? error.message : 'Transaction failed.' });
      } finally {
        setIsBusy(false);
      }
    },
    [refreshStatus],
  );

  const ensurePrerequisites = useCallback(() => {
    if (!isConnected || !address) {
      throw new Error('Connect your wallet to interact with the quest.');
    }
    if (!walletClient) {
      throw new Error('Wallet client not ready. Try reconnecting your wallet.');
    }
    if (!fheInstance) {
      throw new Error('FHE client not initialised yet. Please wait.');
    }
  }, [isConnected, address, walletClient, fheInstance]);

  const guard = useCallback(() => {
    try {
      ensurePrerequisites();
      return true;
    } catch (error) {
      console.error(error);
      setNotice({ kind: 'error', message: error instanceof Error ? error.message : 'Wallet not ready.' });
      return false;
    }
  }, [ensurePrerequisites]);

  const handleBeginNpc1 = useCallback(async () => {
    if (!guard()) return;
    await withTransaction('Opening encrypted treasury', async () => {
      const signer = await getSigner();
      const quest = new Contract(ZAMA_QUEST_CONTRACT.address, ZAMA_QUEST_CONTRACT.abi, signer);
      return quest.beginNPC1Quest();
    });
  }, [guard, getSigner, withTransaction]);

  const handleUnlockNpc1 = useCallback(async () => {
    if (!guard()) return;
    await withTransaction('Authorising decryption', async () => {
      const signer = await getSigner();
      const quest = new Contract(ZAMA_QUEST_CONTRACT.address, ZAMA_QUEST_CONTRACT.abi, signer);
      return quest.unlockNPC1Requirement();
    });
  }, [guard, getSigner, withTransaction]);

  const handleDecryptNpc1 = useCallback(async () => {
    if (!guard()) return;
    if (!address || !publicClient || !walletClient || !fheInstance) {
      return;
    }
    setIsBusy(true);
    setNotice({ kind: 'info', message: 'Requesting secure decryption...' });
    try {
      const requirementHandle = await publicClient.readContract({
        address: ZAMA_QUEST_CONTRACT.address,
        abi: ZAMA_QUEST_CONTRACT.abi,
        functionName: 'getNPC1Requirement',
        args: [address as `0x${string}`],
      });

      if (requirementHandle === ZERO_HANDLE) {
        throw new Error('Requirement not available yet. Start the conversation first.');
      }

      const contractAddresses: string[] = [ZAMA_QUEST_CONTRACT.address];
      const startTimestamp = Math.floor(Date.now() / 1000).toString();
      const durationDays = '7';
      const eip712 = fheInstance.createEIP712(publicKey, contractAddresses, startTimestamp, durationDays);
      const typedDomain = {
        ...eip712.domain,
        verifyingContract: eip712.domain.verifyingContract as `0x${string}`,
      };
      const signature = await walletClient.signTypedData({
        account: address as `0x${string}`,
        domain: typedDomain,
        message: eip712.message,
        primaryType: 'UserDecryptRequestVerification',
        types: { UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification },
      });

      const handles = [
        {
          handle: requirementHandle,
          contractAddress: ZAMA_QUEST_CONTRACT.address,
        },
      ];

      const result = await fheInstance.userDecrypt(
        handles,
        privateKey,
        publicKey,
        signature.replace('0x', ''),
        contractAddresses,
        address as `0x${string}`,
        startTimestamp,
        durationDays,
      );

      const decrypted = result[requirementHandle];
      if (decrypted === undefined) {
        throw new Error('Decryption failed. Please try again.');
      }
      const parsed = typeof decrypted === 'bigint' ? decrypted : BigInt(decrypted as unknown as string);
      setNpc1Amount(parsed);
      setNotice({ kind: 'info', message: `NPC Grimald whispers: "Bring me ${parsed} cGC."` });
    } catch (error) {
      console.error(error);
      setNotice({ kind: 'error', message: error instanceof Error ? error.message : 'Unable to decrypt requirement.' });
    } finally {
      setIsBusy(false);
    }
  }, [guard, address, publicClient, walletClient, fheInstance, privateKey, publicKey]);

  const handleMintCoins = useCallback(async () => {
    if (!guard()) return;
    if (!address) return;
    const amount = npc1Amount ?? 150n;
    await withTransaction('Minting confidential coins', async () => {
      const signer = await getSigner();
      const coin = new Contract(CONFIDENTIAL_GAME_COIN_CONTRACT.address, CONFIDENTIAL_GAME_COIN_CONTRACT.abi, signer);
      return coin.mint(address, amount);
    });
  }, [guard, address, npc1Amount, getSigner, withTransaction]);

  const handleSubmitNpc1 = useCallback(async () => {
    if (!guard()) return;
    if (!address || !fheInstance || npc1Amount === null) {
      return;
    }

    await withTransaction('Delivering encrypted tribute', async () => {
      const signer = await getSigner();
      const quest = new Contract(ZAMA_QUEST_CONTRACT.address, ZAMA_QUEST_CONTRACT.abi, signer);

      const encrypted = await fheInstance
        .createEncryptedInput(ZAMA_QUEST_CONTRACT.address, address)
        .add64(npc1Amount)
        .encrypt();

      return quest.submitNPC1Payment(encrypted.handles[0], encrypted.inputProof);
    });
  }, [guard, address, fheInstance, npc1Amount, getSigner, withTransaction]);

  const handleUnlockNpc2 = useCallback(async () => {
    if (!guard()) return;
    await withTransaction('Consulting the encrypted forge', async () => {
      const signer = await getSigner();
      const quest = new Contract(ZAMA_QUEST_CONTRACT.address, ZAMA_QUEST_CONTRACT.abi, signer);
      return quest.unlockNPC2Details();
    });
  }, [guard, getSigner, withTransaction]);

  const handleMintItem = useCallback(async () => {
    if (!guard()) return;
    const signer = await getSigner();
    const item = new Contract(GAME_ITEM_NFT_CONTRACT.address, GAME_ITEM_NFT_CONTRACT.abi, signer);
    await withTransaction(
      'Forging the encrypted relic',
      () => item.mintItem(),
      (receipt: TransactionReceipt) => {
        if (!receipt.logs) return;
        for (const log of receipt.logs) {
          if (log.address.toLowerCase() === GAME_ITEM_NFT_ADDRESS.toLowerCase()) {
            try {
              const parsed = item.interface.parseLog(log);
              const tokenValue = parsed?.args?.tokenId as bigint | undefined;
              if (typeof tokenValue === 'bigint') {
                setMintedItemId(tokenValue);
                break;
              }
            } catch (error) {
              console.error('Failed to parse mint event', error);
            }
          }
        }
      },
    );
  }, [guard, getSigner, withTransaction]);

  const handleSubmitNpc2 = useCallback(async () => {
    if (!guard()) return;
    if (mintedItemId === null) {
      throw new Error('Mint the required relic before gifting it.');
    }
    const signer = await getSigner();
    const item = new Contract(GAME_ITEM_NFT_CONTRACT.address, GAME_ITEM_NFT_CONTRACT.abi, signer);
    const quest = new Contract(ZAMA_QUEST_CONTRACT.address, ZAMA_QUEST_CONTRACT.abi, signer);

    await withTransaction('Authorising relic transfer', () => item.approve(ZAMA_QUEST_CONTRACT.address, mintedItemId));
    await withTransaction('Gifting the encrypted relic', () => quest.submitNPC2Item(mintedItemId));
  }, [guard, mintedItemId, getSigner, withTransaction]);

  const handleMintReward = useCallback(async () => {
    if (!guard()) return;
    await withTransaction('Minting the Zama reward', async () => {
      const signer = await getSigner();
      const quest = new Contract(ZAMA_QUEST_CONTRACT.address, ZAMA_QUEST_CONTRACT.abi, signer);
      return quest.mintReward();
    });
  }, [guard, getSigner, withTransaction]);

  return (
    <div className="quest-container">
      <header className="quest-header">
        <h1>Zama Encrypted Quest</h1>
        <p>Complete the encrypted errands from three mysterious NPCs to claim your Zama NFT.</p>
      </header>

      {notice.kind && <div className={`quest-notice ${notice.kind}`}>{notice.message}</div>}

      {!isConnected && <div className="quest-card">Connect your wallet to begin.</div>}

      {isConnected && (
        <div className="npc-grid">
          <section className="quest-card">
            <h2>NPC 1 · Grimald the Hoarder</h2>
            <p>
              "My treasury is veiled in homomorphic mist. Earn my trust, decrypt the tribute I require, and prove
              you wield confidential coins like a true cipher runner."
            </p>
            <div className="quest-actions">
              <button disabled={isBusy} onClick={() => void handleBeginNpc1()}>
                Start Encrypted Dialogue
              </button>
              <button disabled={isBusy || !(status?.npc1Assigned)} onClick={() => void handleUnlockNpc1()}>
                Unlock Requirement
              </button>
              <button disabled={isBusy || !(status?.npc1Unlocked)} onClick={() => void handleDecryptNpc1()}>
                Decrypt Tribute Amount
              </button>
              <button disabled={isBusy || npc1Amount === null} onClick={() => void handleMintCoins()}>
                Mint cGC ({npc1Amount ?? '???'})
              </button>
              <button disabled={isBusy || npc1Amount === null} onClick={() => void handleSubmitNpc1()}>
                Deliver Encrypted cGC
              </button>
            </div>
            <QuestStatusList
              entries={[
                { label: 'Quest started', value: status?.npc1Assigned },
                { label: 'Requirement unlocked', value: status?.npc1Unlocked },
                { label: 'Amount decrypted', value: npc1Amount !== null },
                { label: 'Delivery pending', value: status?.npc1HasPending },
                { label: 'Tribute fulfilled', value: status?.npc1Completed },
              ]}
            />
          </section>

          <section className="quest-card">
            <h2>NPC 2 · Selene the Archivist</h2>
            <p>
              "Within runic contracts I hide the forge&apos;s location and relic&apos;s name. Only those who satisfied
              Grimald may decrypt my whispers and craft the Cipher Blade."
            </p>
            <div className="quest-actions">
              <button disabled={isBusy || !(status?.npc1Completed)} onClick={() => void handleUnlockNpc2()}>
                Unlock Selene&apos;s Secrets
              </button>
              <button disabled={isBusy || !(status?.npc2Unlocked)} onClick={() => void handleMintItem()}>
                Forge the Relic NFT
              </button>
              <button disabled={isBusy || !(mintedItemId && status?.npc2Unlocked)} onClick={() => void handleSubmitNpc2()}>
                Gift the Relic
              </button>
            </div>
            <QuestStatusList
              entries={[
                { label: 'Forge revealed', value: status?.npc2Unlocked },
                { label: 'Relic crafted', value: mintedItemId !== null },
                { label: 'Relic delivered', value: status?.npc2Completed },
              ]}
            />
            {mintedItemId !== null && <p className="quest-detail">Minted Token ID: {mintedItemId.toString()}</p>}
          </section>

          <section className="quest-card">
            <h2>NPC 3 · Zama the Cipher Oracle</h2>
            <p>
              "A hero who masters coin and relic may claim the Zama NFT. Step forward once the prior vows are
              complete."
            </p>
            <div className="quest-actions">
              <button
                disabled={isBusy || !(status?.npc1Completed && status?.npc2Completed) || status?.rewardMinted}
                onClick={() => void handleMintReward()}
              >
                Mint Zama Reward
              </button>
              <button disabled={isBusy} onClick={() => refreshStatus()}>
                Refresh Progress
              </button>
            </div>
            <QuestStatusList
              entries={[
                { label: 'Tribute accepted', value: status?.npc1Completed },
                { label: 'Relic bestowed', value: status?.npc2Completed },
                { label: 'Reward minted', value: status?.rewardMinted },
              ]}
            />
          </section>
        </div>
      )}
    </div>
  );
}

type QuestStatusListProps = {
  entries: { label: string; value: boolean | undefined | null }[];
};

function QuestStatusList({ entries }: QuestStatusListProps) {
  return (
    <ul className="quest-status">
      {entries.map((entry) => (
        <li key={entry.label} className={entry.value ? 'done' : 'pending'}>
          <span className="marker" aria-hidden>
            {entry.value ? '✓' : '•'}
          </span>
          {entry.label}
        </li>
      ))}
    </ul>
  );
}
