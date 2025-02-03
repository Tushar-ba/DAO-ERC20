//SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./DAO.sol";
import {IProposalToken} from "./Interface/IProposal.sol";
import {IVotingToken} from "./Interface/IVoting.sol";

contract DAO is Ownable,AccessControl,ReentrancyGuard{
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant PROPOSER_ROLE = keccak256("PROPOSER_ROLE");
    bytes32 public constant VOTER_ROLE = keccak256("VOTER_ROLE");
    uint256 public ID;
    uint256 public STAKE_AMOUNT = 1000000000000000000;
    uint256 public VOTE_AMOUNT = 100000000000000000;
    address public PROPOSER_TOKEN_ADDRESS;
    address public VOTER_TOKEN_ADDRESS;

    struct Proposal{
        string name;
        string description;
        uint256 noOfVotesFor;
        uint256 noOfVotesAgainst;
        uint256 duration;
        bool isActive;
    }

    struct Voter{
        uint256 proposalId;
        bool hasVoted; 
    }

    enum whichSide {
        For,
        Against
    }

    mapping(uint256 => Proposal ) public proposal;
    mapping(address => Voter) public voter;

    error noRole(address _role);
    error insufficientStake(uint256 _amount);
    error durationCannotBeEmpty();
    error fieldEmpty();
    
    constructor() Ownable(msg.sender){
        _grantRole(ADMIN_ROLE,msg.sender);
    }

    function setVoterToken(address _tokenAddress) external onlyOwner{
        require(_tokenAddress != address(0));
        VOTER_TOKEN_ADDRESS = _tokenAddress;
    }

    function setProposerToken(address _tokenAddress) external onlyOwner{
        require(_tokenAddress != address(0));
        PROPOSER_TOKEN_ADDRESS = _tokenAddress;
    }
    function getProposerRole() external payable {
        require(!hasRole(PROPOSER_ROLE, msg.sender), "You already have the role");
        require(msg.value == STAKE_AMOUNT, "Incorrect stake amount");
        _grantRole(PROPOSER_ROLE, msg.sender);
    }


      function getVoteRole() external payable {
        require(!hasRole(VOTER_ROLE, msg.sender), "You already have the role");
        require(msg.value == VOTE_AMOUNT, "Incorrect stake amount");
        _grantRole(VOTER_ROLE, msg.sender);
    }

    function mintProposalToken() external{
        require(PROPOSER_TOKEN_ADDRESS != address(0),"Proposal Token address not set");
        if(hasRole(PROPOSER_ROLE,msg.sender)){
            IProposalToken(PROPOSER_TOKEN_ADDRESS).mint(msg.sender,10);
        }
    }

     function mintVotingToken() external{
        require(VOTER_TOKEN_ADDRESS != address(0),"Voter Token address not set");
        if(hasRole(VOTER_ROLE,msg.sender)){
            IVotingToken(VOTER_TOKEN_ADDRESS).mint(msg.sender,10);
        }
    }

    function createProposal(string calldata _name, string calldata _description, uint256 _duration) external {
        require(IProposalToken(PROPOSER_TOKEN_ADDRESS).balanceOf(msg.sender) == 10,"You do not have the proposal Role");
        if( bytes(_name).length == 0 || bytes(_name).length == 0){
            revert fieldEmpty();
        }
        if(_duration == 0){
            revert durationCannotBeEmpty();
        }
        if(!hasRole(PROPOSER_ROLE, msg.sender)) { 
            revert noRole(msg.sender);
        }
            uint256 _id = ++ID;
            Proposal storage newProposal = proposal[_id];
            newProposal.name = _name;
            newProposal.description = _description;
            newProposal.noOfVotesFor = 0;
            newProposal.noOfVotesAgainst = 0;
            newProposal.isActive = true;
            newProposal.duration = block.timestamp + _duration;
    }

    function voteForProposal(uint256 _proposalId,whichSide _whichSide)external {
        require(IVotingToken(VOTER_TOKEN_ADDRESS).balanceOf(msg.sender)==10,"You do not have the voting authority");
        require(hasRole(VOTER_ROLE, msg.sender),"You do not have the role");
        Proposal storage newProposal = proposal[_proposalId];
        if( block.timestamp >= newProposal.duration){
            newProposal.isActive = false;
        }
        Voter storage newVote = voter[msg.sender];
        require(!newVote.hasVoted,"Cannot vote again");
        require(bytes(newProposal.name).length != 0,"Proposal Does not exist");
        require(newProposal.isActive,"Proposal Expired");
        if(_whichSide == whichSide.For){
            newProposal.noOfVotesFor++;
        }else{
            newProposal.noOfVotesAgainst++;
        }
        newVote.proposalId = _proposalId;
        newVote.hasVoted = true;
    }


    function cancelProposerRole() external payable{
        if(!hasRole(PROPOSER_ROLE,msg.sender)){
            revert noRole(msg.sender);
        }
        (bool success,) = msg.sender.call{value:STAKE_AMOUNT}("");
        _revokeRole(PROPOSER_ROLE,msg.sender);
        require(success,"Transaction failed");
    }
}