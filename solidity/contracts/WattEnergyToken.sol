// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WattEnergyToken is ERC20 {
    address public owner;
    address public burnControl;

    error Unauthorized();

    modifier onlyOwner() {
        _;
        if(msg.sender != owner) {
            revert Unauthorized();
        }
    }

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) {
        owner = msg.sender;
    }

    // Function to mint energy tokens
    function mint(address account, uint256 amount) external onlyOwner {
        _mint(account, amount);
    }

    function setBurnControl(address _burnControl) external onlyOwner {
        burnControl = _burnControl;
    }

    function burn(address account, uint256 amount) external {
        require(msg.sender == burnControl, "Only burn control can burn tokens");
        _burn(account, amount);
    }
}
