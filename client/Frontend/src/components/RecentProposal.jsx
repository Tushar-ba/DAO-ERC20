export default function RecentProposal() {
    return (
      <div className="flex h-full flex-col rounded-xl bg-[#2BD45E] p-6 shadow-[10px_11px_4px_2px_rgba(148,229,197,0.25)] transition-transform hover:scale-105">
        <h2 className="mb-4 text-xl font-bold text-white">Recent Proposal</h2>
        <h3 className="mb-6 text-3xl font-bold text-[#0C0C1D]">Ban TikTok</h3>
  
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-lg font-semibold text-[#0C0C1D]">For:</span>
            <span className="text-lg font-bold text-[#0C0C1D]">0</span>
          </div>
  
          <div className="flex justify-between">
            <span className="text-lg font-semibold text-[#0C0C1D]">Against:</span>
            <span className="text-lg font-bold text-[#0C0C1D]">0</span>
          </div>
  
          <div className="flex justify-between">
            <span className="text-lg font-semibold text-[#0C0C1D]">Time Left:</span>
            <span className="text-lg font-bold text-[#0C0C1D]">00:00:00</span>
          </div>
        </div>
      </div>
    )
  }
  
  