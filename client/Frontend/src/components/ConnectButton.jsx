import { useContext } from "react"
import { Web3Context } from "../context/Web3Context"

export default function ConnectButton() {
  const { isConnected, connectWallet, disconnectWallet, account } = useContext(Web3Context)

  const handleClick = () => {
    if (isConnected) {
      disconnectWallet()
    } else {
      connectWallet()
    }
  }

  return (
    <button
      onClick={handleClick}
      className="rounded-lg bg-[#2BD45E] px-6 py-3 text-lg font-semibold text-[#0C0C1D] transition-transform hover:scale-105"
    >
      {isConnected ? `Disconnect (${account.slice(0, 6)}...${account.slice(-4)})` : "Connect Wallet"}
    </button>
  )
}

