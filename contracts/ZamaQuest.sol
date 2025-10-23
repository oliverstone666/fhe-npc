// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.27;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

import {FHE, ebool, euint64, euint256, eaddress, externalEuint64} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import {SepoliaZamaOracleAddress} from "@zama-fhe/oracle-solidity/address/ZamaOracleAddress.sol";

import {ConfidentialGameCoin} from "./ConfidentialGameCoin.sol";

/// @title ZamaQuest
/// @notice Core quest contract coordinating encrypted NPC interactions and the final reward NFT.
contract ZamaQuest is ERC721, IERC721Receiver, Ownable, SepoliaConfig {
    enum RequestKind {
        None,
        NPC1Match
    }

    struct DecryptionRequest {
        address player;
        RequestKind kind;
    }

    struct PlayerProgress {
        euint64 npc1Requirement;
        bool npc1Assigned;
        bool npc1Unlocked;
        bool npc1Completed;
        bool npc2Unlocked;
        bool npc2Completed;
        bool rewardMinted;
        bool npc1HasPending;
        uint256 npc1PendingRequestId;
        uint256 npc2TokenId;
    }

    ConfidentialGameCoin public immutable coin;
    IERC721 public immutable questItem;
    address public immutable oracleAddress;
    bool public immutable enforceOracle;

    uint256 private _nextRewardId = 1;
    string private _baseRewardTokenURI;

    mapping(address => PlayerProgress) private _players;
    mapping(uint256 => DecryptionRequest) private _requests;

    eaddress private immutable _npc2ContractCipher;
    euint256 private immutable _npc2NameCipher;

    event NPC1RequirementGenerated(address indexed player, bytes32 handle);
    event NPC1RequirementUnlocked(address indexed player);
    event NPC1SubmissionPending(address indexed player, uint256 requestId);
    event NPC1Completed(address indexed player);
    event NPC2Unlocked(address indexed player);
    event NPC2Completed(address indexed player, uint256 tokenId);
    event RewardMinted(address indexed player, uint256 tokenId);

    error NPC1AlreadyAssigned();
    error NPC1NotAssigned();
    error NPC1AlreadyCompleted();
    error NPC1Incomplete();
    error NPC1Pending();
    error NPC1UnlockMissing();
    error InvalidOracle();
    error UnknownRequest();
    error MissingPendingRequest();
    error NPC2AlreadyCompleted();
    error NPC2NotUnlocked();
    error RewardAlreadyMinted();
    error RewardRequirementsUnmet();

    constructor(
        ConfidentialGameCoin coinAddress,
        IERC721 questItemAddress,
        string memory rewardBaseURI,
        string memory npc2ItemName,
        address trustedOracle,
        bool shouldEnforceOracle
    ) ERC721("Zama Quest Reward", "ZQR") Ownable(msg.sender) {
        coin = coinAddress;
        questItem = questItemAddress;
        _baseRewardTokenURI = rewardBaseURI;
        oracleAddress = trustedOracle;
        enforceOracle = shouldEnforceOracle;

        bytes32 nameBytes = _stringToBytes32(npc2ItemName);
        _npc2ContractCipher = FHE.asEaddress(address(questItemAddress));
        _npc2NameCipher = FHE.asEuint256(uint256(nameBytes));

        FHE.allowThis(_npc2ContractCipher);
        FHE.allowThis(_npc2NameCipher);
    }

    /// @notice Starts the NPC1 quest by generating an encrypted random requirement between 100 and 200 cGC.
    function beginNPC1Quest() external returns (euint64) {
        PlayerProgress storage player = _players[msg.sender];
        if (player.npc1Assigned) {
            revert NPC1AlreadyAssigned();
        }

        uint64 randomValue = _boundedRandomValue(msg.sender);
        euint64 encryptedRequirement = FHE.asEuint64(randomValue);

        player.npc1Requirement = encryptedRequirement;
        player.npc1Assigned = true;
        FHE.allowThis(encryptedRequirement);

        emit NPC1RequirementGenerated(msg.sender, FHE.toBytes32(encryptedRequirement));
        return encryptedRequirement;
    }

    /// @notice Allows the player to decrypt their NPC1 requirement after finishing the dialogue.
    function unlockNPC1Requirement() external {
        PlayerProgress storage player = _players[msg.sender];
        if (!player.npc1Assigned) {
            revert NPC1NotAssigned();
        }
        if (player.npc1Unlocked) {
            return;
        }

        FHE.allow(player.npc1Requirement, msg.sender);
        player.npc1Unlocked = true;

        emit NPC1RequirementUnlocked(msg.sender);
    }

    /// @notice Submit the encrypted cGC amount delivered to NPC1.
    function submitNPC1Payment(externalEuint64 encryptedAmount, bytes calldata inputProof) external {
        PlayerProgress storage player = _players[msg.sender];
        if (!player.npc1Assigned) {
            revert NPC1NotAssigned();
        }
        if (!player.npc1Unlocked) {
            revert NPC1UnlockMissing();
        }
        if (player.npc1Completed) {
            revert NPC1AlreadyCompleted();
        }
        if (player.npc1HasPending) {
            revert NPC1Pending();
        }

        euint64 provided = FHE.fromExternal(encryptedAmount, inputProof);
        ebool matches = FHE.eq(provided, player.npc1Requirement);

        bytes32[] memory handles = new bytes32[](1);
        handles[0] = FHE.toBytes32(matches);

        uint256 requestId = FHE.requestDecryption(handles, this.onNPC1Decryption.selector);
        player.npc1HasPending = true;
        player.npc1PendingRequestId = requestId;
        _requests[requestId] = DecryptionRequest({player: msg.sender, kind: RequestKind.NPC1Match});

        emit NPC1SubmissionPending(msg.sender, requestId);
    }

    /// @notice Unlocks the encrypted NFT information required by NPC2.
    function unlockNPC2Details() external {
        PlayerProgress storage player = _players[msg.sender];
        if (!player.npc1Completed) {
            revert NPC1Incomplete();
        }
        if (player.npc2Unlocked) {
            return;
        }

        FHE.allow(_npc2ContractCipher, msg.sender);
        FHE.allow(_npc2NameCipher, msg.sender);
        player.npc2Unlocked = true;

        emit NPC2Unlocked(msg.sender);
    }

    /// @notice Transfer the quest item NFT to the contract to complete NPC2 requirements.
    function submitNPC2Item(uint256 tokenId) external {
        PlayerProgress storage player = _players[msg.sender];
        if (!player.npc2Unlocked) {
            revert NPC2NotUnlocked();
        }
        if (player.npc2Completed) {
            revert NPC2AlreadyCompleted();
        }

        questItem.safeTransferFrom(msg.sender, address(this), tokenId);
        player.npc2Completed = true;
        player.npc2TokenId = tokenId;

        emit NPC2Completed(msg.sender, tokenId);
    }

    /// @notice Mint the final Zama NFT reward once both NPC quests are complete.
    function mintReward() external returns (uint256 tokenId) {
        PlayerProgress storage player = _players[msg.sender];
        if (player.rewardMinted) {
            revert RewardAlreadyMinted();
        }
        if (!player.npc1Completed || !player.npc2Completed) {
            revert RewardRequirementsUnmet();
        }

        tokenId = _nextRewardId;
        _nextRewardId += 1;
        player.rewardMinted = true;

        _safeMint(msg.sender, tokenId);

        emit RewardMinted(msg.sender, tokenId);
    }

    /// @notice Callback executed by the Zama Oracle once the NPC1 equality proof is decrypted.
    function onNPC1Decryption(uint256 requestId, bytes memory cleartexts, bytes memory decryptionProof) external returns (bool) {
        if (enforceOracle && msg.sender != oracleAddress) {
            revert InvalidOracle();
        }
        DecryptionRequest memory request = _requests[requestId];
        if (request.kind != RequestKind.NPC1Match) {
            revert UnknownRequest();
        }

        PlayerProgress storage player = _players[request.player];
        if (!player.npc1HasPending || player.npc1PendingRequestId != requestId) {
            revert MissingPendingRequest();
        }

        FHE.checkSignatures(requestId, cleartexts, decryptionProof);

        uint256 result = abi.decode(cleartexts, (uint256));
        bool success = result == 1;

        delete _requests[requestId];
        player.npc1HasPending = false;
        player.npc1PendingRequestId = 0;

        if (success) {
            player.npc1Completed = true;
            emit NPC1Completed(request.player);
        }

        return success;
    }

    /// @notice Retrieve a player's progress state.
    function getPlayerProgress(address player)
        external
        view
        returns (
            bool npc1Assigned,
            bool npc1Unlocked,
            bool npc1Completed,
            bool npc1HasPending,
            uint256 npc1PendingRequestId,
            bool npc2Unlocked,
            bool npc2Completed,
            uint256 npc2TokenId,
            bool rewardMinted
        )
    {
        PlayerProgress storage data = _players[player];
        return (
            data.npc1Assigned,
            data.npc1Unlocked,
            data.npc1Completed,
            data.npc1HasPending,
            data.npc1PendingRequestId,
            data.npc2Unlocked,
            data.npc2Completed,
            data.npc2TokenId,
            data.rewardMinted
        );
    }

    /// @notice Returns the encrypted NPC1 requirement handle for a player.
    function getNPC1Requirement(address player) external view returns (euint64) {
        return _players[player].npc1Requirement;
    }

    /// @notice Returns the encrypted NFT contract address required by NPC2.
    function getNPC2ContractCipher() external view returns (eaddress) {
        return _npc2ContractCipher;
    }

    /// @notice Returns the encrypted NFT name required by NPC2.
    function getNPC2NameCipher() external view returns (euint256) {
        return _npc2NameCipher;
    }

    /// @notice Update the base URI for reward metadata.
    function setRewardBaseURI(string calldata newBaseURI) external onlyOwner {
        _baseRewardTokenURI = newBaseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseRewardTokenURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        string memory base = _baseURI();
        if (bytes(base).length == 0) {
            return "";
        }
        return string.concat(base, Strings.toString(tokenId));
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721) returns (bool) {
        return super.supportsInterface(interfaceId) || interfaceId == type(IERC721Receiver).interfaceId;
    }

    function onERC721Received(address, address, uint256, bytes calldata) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    function _boundedRandomValue(address player) private view returns (uint64) {
        uint256 randomness = uint256(
            keccak256(abi.encodePacked(block.prevrandao, block.timestamp, block.number, player))
        );
        return uint64(100 + (randomness % 101));
    }

    function _stringToBytes32(string memory value) private pure returns (bytes32 result) {
        bytes memory raw = bytes(value);
        if (raw.length == 0) {
            return bytes32(0);
        }
        if (raw.length <= 32) {
            assembly {
                result := mload(add(raw, 32))
            }
        } else {
            bytes memory truncated = new bytes(32);
            for (uint256 i = 0; i < 32; i++) {
                truncated[i] = raw[i];
            }
            assembly {
                result := mload(add(truncated, 32))
            }
        }
    }
}
