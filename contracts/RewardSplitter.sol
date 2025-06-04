// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

/// @notice 用於分發 KOL 分銷提成、團隊收益等，可一次性充值 ETH/代幣並按 shares 分成
contract RewardSplitter is PaymentSplitter, Ownable {
    /// @param payees   各接收者地址陣列
    /// @param shares_  各地址對應分成份額（陣列長度和 payees 一致）
    constructor(address[] memory payees, uint256[] memory shares_)
        PaymentSplitter(payees, shares_)
        payable
    {}

    /// @notice 允許合約 owner 批量釋放所有接收者的款項（ETH 或 ERC20）
    function releaseAll() external onlyOwner {
        for (uint256 i = 0; i < payees().length; i++) {
            address account = payees()[i];
            release(Payable(account));
        }
    }
}
