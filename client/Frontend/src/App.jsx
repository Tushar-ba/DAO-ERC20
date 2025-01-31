import { Web3Provider } from "./context/Web3Context"
import ConnectButton from "./components/ConnectButton"
import ProposerButton from "./components/ProposerButton"
import VoterButton from "./components/VoterButton"
import TotalProposers from "./components/TotalProposers"
import TotalProposal from "./components/TotalProposal"
import RecentProposal from "./components/RecentProposal"

export default function App() {
  return (
    <Web3Provider>
      <div className="min-h-screen bg-[#0C0C1D] p-6">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-16 flex items-center justify-between">
            <h1 className="text-5xl font-bold text-white">DAO</h1>
            <ConnectButton />
          </div>

          {/* Stats Grid */}
          <div className="mb-16 grid gap-8 md:grid-cols-3">
            <div className="min-h-[200px]">
              <TotalProposal />
            </div>
            <div className="min-h-[200px]">
              <RecentProposal />
            </div>
            <div className="min-h-[200px]">
              <TotalProposers />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid gap-8 md:grid-cols-2">
            <ProposerButton />
            <VoterButton />
          </div>
        </div>
      </div>
    </Web3Provider>
  )
}

