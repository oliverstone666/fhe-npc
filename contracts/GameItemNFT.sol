// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

/// @title GameItemNFT
/// @notice Simple ERC721 collection used as the quest item required by NPC2.
contract GameItemNFT is ERC721, Ownable {
    using Strings for uint256;

    uint256 private _nextTokenId = 1;
    string private _baseTokenURI;

    constructor(string memory initialBaseURI) ERC721("Encrypted Relic", "ERELIC") Ownable(msg.sender) {
        _baseTokenURI = initialBaseURI;
    }

    /// @notice Mint a new quest item NFT to the caller.
    function mintItem() external returns (uint256 tokenId) {
        tokenId = _nextTokenId;
        _nextTokenId += 1;

        _safeMint(msg.sender, tokenId);
    }

    /// @notice Update the base token URI.
    function setBaseTokenURI(string calldata newBaseTokenURI) external onlyOwner {
        _baseTokenURI = newBaseTokenURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        string memory base = _baseURI();
        if (bytes(base).length == 0) {
            return "";
        }
        return string.concat(base, tokenId.toString());
    }
}
