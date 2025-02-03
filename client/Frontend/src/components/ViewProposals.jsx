import { useState, useEffect, useContext } from "react"
import { X } from "lucide-react"
import { Web3Context } from "../context/Web3Context"

export default function ViewProposals() {
  const { contract, createContractSigner } = useContext(Web3Context);
  const [isListOpen, setIsListOpen] = useState(false)
  const [isVoteOpen, setIsVoteOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedProposal, setSelectedProposal] = useState(null)
  const [proposals, setProposals] = useState([])
  const [isVoting, setIsVoting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all proposals
  const fetchProposals = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching proposals...");
      
      // Get the proposal count first
      const count = await contract.ID();
      const proposalCount = Number(count);
      console.log("Total proposals:", proposalCount);

      let allProposals = [];
      
      // Iterate from 0 to count-1
      for(let i = 0; i < proposalCount; i++) {
        try {
          console.log("Fetching proposal:", i);
          const proposal = await contract.proposal(i);
          console.log("Raw proposal data:", proposal);
          
          // Convert BigInt values to numbers safely
          const forVotes = typeof proposal[2] === 'bigint' ? Number(proposal[2]) : 0;
          const againstVotes = typeof proposal[3] === 'bigint' ? Number(proposal[3]) : 0;
          const endTime = typeof proposal[4] === 'bigint' ? Number(proposal[4]) : 0;
          
          allProposals.push({
            id: i,
            name: proposal[0],
            description: proposal[1],
            forVotes,
            againstVotes,
            endTime,
            executed: proposal[5]
          });
        } catch (error) {
          console.error(`Error fetching proposal ${i}:`, error);
        }
      }
      
      console.log("Processed proposals:", allProposals);
      setProposals(allProposals);
    } catch (error) {
      console.error("Error fetching proposals:", error);
      setError("Failed to load proposals. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate time left for a proposal
  const calculateTimeLeft = (endTime) => {
    if (!endTime) return "Invalid time";
    
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = endTime - now;
    
    if (timeLeft <= 0) return "Ended";
    
    const days = Math.floor(timeLeft / (24 * 60 * 60));
    const hours = Math.floor((timeLeft % (24 * 60 * 60)) / (60 * 60));
    return `${days}d ${hours}h`;
  };

  // Vote for a proposal
  const vote = async (proposalId, isFor) => {
    if (!contract) {
      setError("Contract not initialized");
      return;
    }
    
    setIsVoting(true);
    try {
      const signer = await createContractSigner();
      //const contractWithSigner = signer.connect(signer);
      
      const tx = await signer.voteForProposal(
        proposalId,
        isFor ? 0 : 1 // 0 for FOR, 1 for AGAINST
      );
      
      await tx.wait();
      await fetchProposals();
      closeAllModals();
    } catch (error) {
      console.error("Error voting:", error);
      setError(error.message || "Error while voting. Please try again.");
    } finally {
      setIsVoting(false);
    }
  };

  useEffect(() => {
    if (isListOpen && contract) {
      fetchProposals();
    }
  }, [isListOpen, contract]);

  const closeAllModals = () => {
    setIsListOpen(false)
    setIsVoteOpen(false)
    setIsDetailsOpen(false)
    setSelectedProposal(null)
    setError(null)
  }

  const handleVoteClick = (proposal) => {
    setSelectedProposal(proposal)
    console.log(proposal);
    setIsVoteOpen(true)
    setIsListOpen(false)
  }

  const handleMoreClick = (proposal) => {
    setSelectedProposal(proposal)
    setIsDetailsOpen(true)
    setIsListOpen(false)
  }



  return (
    <>
      <button
        onClick={() => setIsListOpen(true)}
        className="w-full rounded-xl bg-white p-6 text-xl font-bold text-[#0C0C1D] shadow-[-9px_-9px_4px_0px_rgba(199,240,230,0.25)] transition-transform hover:scale-105"
      >
        View Proposals
      </button>

      {/* Proposals List Modal */}
      {isListOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-[90vw] max-w-5xl rounded-xl bg-[#0C0C1D] p-8">
            <button onClick={closeAllModals} className="absolute right-4 top-4 text-white hover:opacity-75">
              <X size={24} />
            </button>

            <h2 className="mb-8 text-center text-3xl font-bold text-white underline">Proposals List</h2>

            {isLoading ? (
              <div className="text-center text-white">Loading proposals...</div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : proposals.length === 0 ? (
              <div className="text-center text-white">No proposals found</div>
            ) : (
              <div className="flex gap-6 overflow-x-auto pb-4">
                {proposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    className="flex min-w-[300px] flex-col rounded-xl bg-[#2BD45E] p-6 shadow-[10px_11px_4px_2px_rgba(148,229,197,0.25)]"
                  >
                    <div className="mb-2 flex justify-between">
                      <h3 className="text-xl font-bold underline">Proposal {proposal.id + 1}</h3>
                      <button
                        onClick={() => handleVoteClick(proposal)}
                        className="rounded-lg bg-white px-4 py-1 text-sm font-bold"
                        disabled={calculateTimeLeft(proposal.endTime) === "Ended"}
                      >
                        Vote
                      </button>
                    </div>

                    <h4 className="mb-4 text-2xl font-bold">{proposal.name}</h4>

                    <div className="mb-2 flex justify-between">
                      <span className="font-semibold">For:</span>
                      <span>{proposal.forVotes}</span>
                    </div>

                    <div className="mb-4 flex justify-between">
                      <span className="font-semibold">Against:</span>
                      <span>{proposal.againstVotes}</span>
                    </div>

                    <div className="mt-auto flex justify-between">
                      <span className="text-sm">Time Left: {calculateTimeLeft(proposal.endTime)}</span>
                      <button onClick={() => handleMoreClick(proposal)} className="text-sm underline hover:opacity-75">
                        More...
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vote Modal */}
      {isVoteOpen && selectedProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-[500px] rounded-xl bg-[#0C0C1D] p-8">
            <button onClick={closeAllModals} className="absolute right-4 top-4 text-white hover:opacity-75">
              <X size={24} />
            </button>

            <h2 className="mb-12 text-center text-3xl font-bold text-white underline">Choose your Vote</h2>

            {error && (
              <div className="mb-4 text-center text-red-500">
                {error}
              </div>
            )}

            <div className="grid gap-4">
              <button 
                onClick={() => vote(selectedProposal.id, true)}
                disabled={isVoting || calculateTimeLeft(selectedProposal.endTime) === "Ended"}
                className="w-full rounded-lg bg-[#2BD45E] py-3 text-xl font-bold text-[#0C0C1D] transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                {isVoting ? "Voting..." : "For"}
              </button>
              <button 
                onClick={() => vote(selectedProposal.id, false)}
                disabled={isVoting || calculateTimeLeft(selectedProposal.endTime) === "Ended"}
                className="w-full rounded-lg bg-red-500 py-3 text-xl font-bold text-white transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                {isVoting ? "Voting..." : "Against"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {isDetailsOpen && selectedProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-[696px] rounded-xl bg-[#0C0C1D] p-12">
            <button onClick={closeAllModals} className="absolute right-4 top-4 text-white hover:opacity-75">
              <X size={24} />
            </button>

            <h2 className="mb-8 text-center text-3xl font-bold text-white underline">Proposal Details</h2>

            <div className="space-y-8">
              <div className="space-y-2">
                <label className="block text-xl font-semibold text-white">Name Of the Proposal</label>
                <div className="w-full rounded-xl border-3 border-[#F7FDFC] bg-[#1FAD6B] p-4 text-lg text-[#0C0C1D]">
                  {selectedProposal.name}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xl font-semibold text-white">Description</label>
                <div className="h-48 w-full rounded-xl border-3 border-[#F7FDFC] bg-[#1FAD6B] p-4 text-lg text-[#0C0C1D] overflow-y-auto">
                  {selectedProposal.description}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xl font-semibold text-white">Time Left</label>
                <div className="w-full rounded-xl border-3 border-[#F7FDFC] bg-[#1FAD6B] p-4 text-lg text-[#0C0C1D]">
                  {calculateTimeLeft(selectedProposal.endTime)}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xl font-semibold text-white">Current Votes</label>
                <div className="w-full rounded-xl border-3 border-[#F7FDFC] bg-[#1FAD6B] p-4 text-lg text-[#0C0C1D]">
                  For: {selectedProposal.forVotes} | Against: {selectedProposal.againstVotes}
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  onClick={() => {
                    setIsDetailsOpen(false)
                    setIsVoteOpen(true)
                  }}
                  disabled={calculateTimeLeft(selectedProposal.endTime) === "Ended"}
                  className="rounded-lg bg-[#1FAD6B] px-16 py-3 text-xl font-bold text-[#0C0C1D] transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                  Vote
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}