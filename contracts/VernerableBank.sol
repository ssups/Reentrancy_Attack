//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Arrays.sol";
import "@openzeppelin/contracts/utils/Address.sol";

// 1. import contract
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// 2. inherit from ReentrancyGuard
contract VernerableBank {
    using Address for address payable;

    mapping(address => uint256) public balanceOf;

    function deposit() external payable {
        balanceOf[msg.sender] += msg.value;
    }

    /* 3. attach nonReentrant to protect against reentracy */
    function withdraw() external {
        uint256 depositedAmount = balanceOf[msg.sender];
        // payable(msg.sender).sendValue(depositedAmount);
        (bool success, ) = msg.sender.call{value: depositedAmount}("");
        require(success);
        require(success, "withdraw failed");
        balanceOf[msg.sender] = 0;
    }
}
