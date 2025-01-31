//SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

interface IVotingToken {
function mint(address _to, uint256 _supply) external;
function balanceOf(address _of) external view returns(uint256);
}