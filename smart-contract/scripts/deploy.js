async function main() {
    console.log("Hello")
    const [deployer] = await ethers.getSigners();
    const DAOFactory = await ethers.getContractFactory("DAO",deployer);
    const DAOContract = await DAOFactory.deploy();
    await DAOContract.waitForDeployment();
    console.log(`DAO Contract address: ${DAOContract.target}`);

    const VoterFactory = await ethers.getContractFactory("Voting");
    const VoterContract = await VoterFactory.deploy(DAOContract.target);  
    await VoterContract.waitForDeployment();
    console.log(`Voter Contract address: ${VoterContract.target}`);  

    const ProposalContractFactory = await ethers.getContractFactory("Voting");
    const ProposalContract = await ProposalContractFactory.deploy(DAOContract.target);  
    await ProposalContract.waitForDeployment();
    console.log(`Proposal Contract address: ${ProposalContract.target}`);  

    console.log("Setting the Token Accounts");

    await DAOContract.setVoterToken(VoterContract.target);
    await DAOContract.setProposerToken(ProposalContract.target);

    console.log("Setting successfull 😊😊😊")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
