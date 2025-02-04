import { useContext, useState, useEffect } from "react";
import { Web3Context } from "../context/Web3Context";
import { ethers } from "ethers";
import BeatLoader from "react-spinners/BeatLoader";

export default function TotalProposal() {
    const [proposals1, setProposals1] = useState(null);
    // const [contract , setContract] = useState()
    const { contract} = useContext(Web3Context);

    const getProposals = async () => {
        try {

            if (!contract) return; 
            const tx = await contract.ID();  
            console.log(tx.toString());
            setProposals1(tx.toString()); // Convert BigNumber to string
        } catch (error) {
            console.error("Error fetching proposals:", error);
        }
    };

    useEffect(() => {
        if (contract) getProposals();  // Fetch when contract is available
    }, [contract]);

    return (
      <div className="flex h-full flex-col rounded-xl bg-[#2BD45E] p-6 shadow-[10px_11px_4px_2px_rgba(148,229,197,0.25)] transition-transform hover:scale-105">
        
        <h2 className="mb-2 text-xl font-bold text-white">Total Proposals</h2>
        <div className="flex flex-1 items-center justify-center">
          {proposals1 === null ? ( 
            <p className="text-xl text-[#0C0C1D]"><BeatLoader
            color="hsla(185, 0%, 0%, 1)"
            cssOverride={{}}
            loading
            margin={2}
            size={15}
            speedMultiplier={1}
          /></p>
          ) : (
            <p className="text-6xl font-bold text-[#0C0C1D]">{proposals1}</p>
          )}
        </div>
      </div>
    );
}
