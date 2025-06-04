// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

/// @notice 記錄邀請關係，鏈上可查。每個 inviterCode 對應一個 inviter 地址；invitee 保存其 inviterCode
contract InviterTracker is Initializable, OwnableUpgradeable {
    /// @notice 邀請碼 (bytes32) -> inviter 地址
    mapping(bytes32 => address) public inviter;
    /// @notice 被邀請人地址 -> inviterCode
    mapping(address => bytes32) public invitedBy;
    /// @notice inviter 地址 -> 邀請人數（有效邀請數）
    mapping(address => uint256) public inviteCount;

    event RegisterInviter(bytes32 indexed code, address indexed inviterAddr);
    event RecordInvitation(address indexed invitee, bytes32 indexed code);

    function initialize() public initializer {
        __Ownable_init();
    }

    /// @notice 合約 owner 註冊自己的邀請碼
    /// @param code       唯一位元串邀請碼
    /// @param inviterAddr 邀請人地址
    function registerInviter(bytes32 code, address inviterAddr) external onlyOwner {
        require(inviter[code] == address(0), "InviterTracker: Code exists");
        inviter[code] = inviterAddr;
        emit RegisterInviter(code, inviterAddr);
    }

    /// @notice 鑄造／分享驗證後呼叫，鏈上記錄邀請資訊
    /// @param invitee 被邀請人的錢包地址
    /// @param code    邀請碼
    function recordInvitation(address invitee, bytes32 code) external {
        require(inviter[code] != address(0), "InviterTracker: Invalid code");
        require(invitedBy[invitee] == bytes32(0), "InviterTracker: Already recorded");
        invitedBy[invitee] = code;
        inviteCount[inviter[code]] += 1;
        emit RecordInvitation(invitee, code);
    }

    /// @notice 查詢某個 invitee 的 inviter
    function getInviter(address invitee) external view returns (address) {
        return inviter[invitedBy[invitee]];
    }
}
