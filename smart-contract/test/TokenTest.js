const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe ("DAO",function(){

  let owner, proposer,voter1, voter2
  let DAOContract, ProposerContract, VoterContract 
  beforeEach(async function(){
    [owner, proposer, voter1, voter2] = await ethers.getSigners();
    
    const DAOContractFactory = await ethers.getContractFactory("DAO");
    DAOContract = await DAOContractFactory.deploy();
    await DAOContract.waitForDeployment();
    

    const ProposerFactory = await ethers.getContractFactory("Proposal");
    ProposerContract = await ProposerFactory.deploy(DAOContract.target);
    await ProposerContract.waitForDeployment();
    
    const VoterFactory = await ethers.getContractFactory("Voting");
    VoterContract = await VoterFactory.deploy(DAOContract.target);
    await VoterContract.waitForDeployment();

    await DAOContract.setVoterToken(VoterContract.target)
    await DAOContract.setProposerToken(ProposerContract.target)
  })
  it("Should create a proposal",async function (){
    await DAOContract.connect(proposer).getProposerRole({value:ethers.parseEther("1")});
    await DAOContract.connect(proposer).mintProposalToken();
    expect(await DAOContract.connect(proposer).createProposal("Tushar","This is a test",1000));
    const info = await DAOContract.proposal(1);
    console.log(info);
  })
  it("Should Allow to vote for the ones with voter mint",async function(){
    await DAOContract.connect(proposer).getProposerRole({value:ethers.parseEther("1")});
    await DAOContract.connect(proposer).mintProposalToken();
    await DAOContract.connect(proposer).createProposal("Tushar","This is a test",1000);
    await DAOContract.connect(voter1).getVoteRole({value:BigInt(100000000000000000)});
    await DAOContract.connect(voter1).mintVotingToken();
    expect (await DAOContract.connect(voter1).voteForProposal(1,0));
    console.log(await DAOContract.proposal(1));
  })
  it("Should Allow to vote for the ones with voter mint",async function(){
    await DAOContract.connect(proposer).getProposerRole({value:ethers.parseEther("1")});
    await DAOContract.connect(proposer).mintProposalToken();
    await DAOContract.connect(proposer).createProposal("Tushar","This is a test",1000);
    await DAOContract.connect(voter1).getVoteRole({value:BigInt(100000000000000000)});
    await DAOContract.connect(voter1).mintVotingToken();
    expect (await DAOContract.connect(voter1).voteForProposal(1,1));
    console.log(await DAOContract.proposal(1));
  })
  it("Should cancle the proposer and send the money back",async function(){
    await DAOContract.connect(proposer).getProposerRole({value:ethers.parseEther("1")});
    await DAOContract.connect(proposer).mintProposalToken();
    expect(await DAOContract.connect(proposer).cancelProposerRole());
  })
})