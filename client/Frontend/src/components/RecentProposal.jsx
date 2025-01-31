import { useContext, useState, useEffect } from "react";
import { Web3Context } from "../context/Web3Context";

export default function RecentProposal() {
  const [latestProposal, setLatestProposal] = useState(null);
  const { contract } = useContext(Web3Context);

  useEffect(() => {
    const fetchLatestProposal = async () => {
      try {
        const total = await contract.ID();
        if (Number(total) > 0) {
          const proposal = await contract.proposal(Number(total));
          setLatestProposal({
            name: proposal[0],
            description: proposal[1],
            forVotes: Number(proposal[2]),
            againstVotes: Number(proposal[3]),
            deadline: Number(proposal[4]),
            active: proposal[5]
          });
        }
      } catch (error) {
        console.error("Error fetching latest proposal:", error);
      }
    };

    if (contract) {
      fetchLatestProposal();
    }
  }, [contract]);

  const getTimeLeft = (deadline) => {
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = deadline - now;
    if (timeLeft <= 0) return "00:00:00";
    
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex h-full flex-col rounded-xl bg-[#2BD45E] p-6 shadow-[10px_11px_4px_2px_rgba(148,229,197,0.25)] transition-transform hover:scale-105">
      <h2 className="mb-4 text-xl font-bold text-white">Recent Proposal</h2>
      <h3 className="mb-6 text-3xl font-bold text-[#0C0C1D]">
        {latestProposal?.name || "No proposals yet"}
      </h3>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-lg font-semibold text-[#0C0C1D]">For:</span>
          <span className="text-lg font-bold text-[#0C0C1D]">{latestProposal?.forVotes || 0}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-lg font-semibold text-[#0C0C1D]">Against:</span>
          <span className="text-lg font-bold text-[#0C0C1D]">{latestProposal?.againstVotes || 0}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-lg font-semibold text-[#0C0C1D]">Time Left:</span>
          <span className="text-lg font-bold text-[#0C0C1D]">
            {latestProposal ? getTimeLeft(latestProposal.deadline) : "00:00:00"}
          </span>
        </div>
      </div>
    </div>
  );
}