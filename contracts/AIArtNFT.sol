// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AIArtNFT is
    ERC721Upgradeable,
    ERC721EnumerableUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable,
    ERC2981
{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    /// @notice tokenId -> IPFS CID
    mapping(uint256 => string) public tokenCID;
    /// @notice tokenId -> 創作者地址，用於版稅分發
    mapping(uint256 => address) public creator;

    /// @notice 鑄造費用（單位：wei）
    uint256 public mintFee;
    /// @notice 版稅分配比例（基於 10000，為整數）
    uint96 public royaltyFraction;

    event Minted(address indexed minter, uint256 indexed tokenId, string cid);

    function initialize(string memory name_, string memory symbol_) public initializer {
        __ERC721_init(name_, symbol_);
        __ERC721Enumerable_init();
        __Ownable_init();
        __UUPSUpgradeable_init();

        // 初始參數
        mintFee = 0.01 ether;         // 可由 owner 調整
        royaltyFraction = 500;        // 表示 5% (10000 為基數)
        _setDefaultRoyalty(address(this), royaltyFraction);
    }

    /// @notice 普通系列鑄造（使用者付費）
    /// @param cid AI 引擎生成並上傳到 IPFS 的 CID
    function mintAIArt(string calldata cid) external payable returns (uint256) {
        require(msg.value >= mintFee, "AIArtNFT: Insufficient mint fee");
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);

        tokenCID[newTokenId] = cid;
        creator[newTokenId] = msg.sender;
        // 設置此 token 的版稅收益給創作者
        _setTokenRoyalty(newTokenId, msg.sender, royaltyFraction);

        emit Minted(msg.sender, newTokenId, cid);
        return newTokenId;
    }

    /// @notice 稀有系列鑄造，僅限合約 owner 呼叫
    /// @param to 接收者地址
    /// @param cid IPFS CID
    function mintRareAIArt(address to, string calldata cid) external onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(to, newTokenId);

        tokenCID[newTokenId] = cid;
        creator[newTokenId] = to;
        // 稀有版版稅比例雙倍（10%）
        _setTokenRoyalty(newTokenId, to, royaltyFraction * 2);

        emit Minted(to, newTokenId, cid);
        return newTokenId;
    }

    /// @notice 更改鑄造費用，僅限合約 owner
    function setMintFee(uint256 _fee) external onlyOwner {
        mintFee = _fee;
    }

    /// @notice 提款，合約 owner 可提取合約餘額
    function withdraw(address payable to) external onlyOwner {
        require(to != address(0), "AIArtNFT: Invalid address");
        to.transfer(address(this).balance);
    }

    /// @notice 覆蓋 ERC721Enumerable 的 hook
    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    /// @notice 使合約可升級，僅合約 owner 可執行
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    /// @notice 支援 ERC2981 + ERC721Enumerable 接口
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /// @notice 返回 tokenURI，即 IPFS CID
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "AIArtNFT: URI query for nonexistent token");
        return tokenCID[tokenId];
    }
}
