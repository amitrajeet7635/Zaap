// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract CircleWalletManager {
    address public owner;
    IERC20 public usdc;

    mapping(address => uint256) public childBalances;

    event Allocated(address indexed child, uint256 amount);
    event Withdrawn(address indexed child, uint256 amount);

    constructor(address _usdc) {
        owner = msg.sender;
        usdc = IERC20(_usdc);
    }

    function allocateToChild(address child, uint256 amount) external {
        require(msg.sender == owner, "Only owner can allocate");
        require(usdc.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        childBalances[child] += amount;
        emit Allocated(child, amount);
    }

    function withdrawForChild(uint256 amount) external {
        require(childBalances[msg.sender] >= amount, "Insufficient balance");
        childBalances[msg.sender] -= amount;
        require(usdc.transfer(msg.sender, amount), "USDC transfer failed");
        emit Withdrawn(msg.sender, amount);
    }

    function getChildBalance(address child) external view returns (uint256) {
        return childBalances[child];
    }
}
