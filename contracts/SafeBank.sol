//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Arrays.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "hardhat/console.sol";

// 1. import contract
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// 2. inherit from ReentrancyGuard
contract SafeBank {
    // using Address for address payable;

    mapping(address => uint256) public balanceOf;

    function deposit() external payable {
        balanceOf[msg.sender] += msg.value;
    }

    function withdraw() external {
        // Checks-Effects-Interactions 패턴
        console.log("balance of %s : %s ", msg.sender, balanceOf[msg.sender]);
        require(balanceOf[msg.sender] > 0, "not enough balance to withdraw"); // check
        balanceOf[msg.sender] = 0; // effects to the state variables
        (bool success, ) = msg.sender.call{value: balanceOf[msg.sender]}("");
        require(success, "withdraw failed");
    }
}
