//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Arrays.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "hardhat/console.sol";

contract VernerableBank {
    using Address for address payable;

    mapping(address => uint256) public balanceOf;

    function deposit() external payable {
        balanceOf[msg.sender] += msg.value;
    }

    function withdraw() external {
        console.log("entered");
        uint256 depositedAmount = balanceOf[msg.sender];
        (bool success, ) = msg.sender.call{value: depositedAmount}("");
        require(success, "withdraw failed");
        balanceOf[msg.sender] = 0;
    }
}
