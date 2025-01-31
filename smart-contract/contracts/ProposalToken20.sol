// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Proposal is ERC20 {

    address public DAO_ADDRESS;
    
    constructor(address _daoAddress) ERC20("ProposalToken", "PT"){
        DAO_ADDRESS = _daoAddress;
    }

    error CannotDelegateToMint(address _delegatee);

    function mint(address _to, uint256 _supply) external {
        if (msg.sender != DAO_ADDRESS) {  
            revert CannotDelegateToMint(msg.sender);
        }  
        _mint(_to, _supply);
    }

    function _update(address from, address to, uint256 value) internal override(ERC20) {
        super._update(from, to, value);
    }
}
