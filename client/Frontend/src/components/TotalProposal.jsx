import { useContext, useState, useEffect } from "react";
import { Web3Context } from "../context/Web3Context";

export default function TotalProposal() {
    const [proposals, setProposals] = useState(null);
    const { CONTRACT_ABI, CONTRACT_ADDRESS,signer } = useContext(Web3Context);

    const getProposals = async () => {
        try {
            if (!contract) return; // Prevent execution if contract is null
            const contract = new ethers.Contract(CONTRACT_ABI,CONTRACT_ADDRESS,signer);
            const tx = await contract.ID();  // Ensure correct access
            setProposals(tx.toString()); // Convert BigNumber to string
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
          {proposals === null ? ( 
            <p className="text-xl text-[#0C0C1D]">Loading...</p>
          ) : (
            <p className="text-6xl font-bold text-[#0C0C1D]">{proposals}</p>
          )}
        </div>
      </div>
    );
}
