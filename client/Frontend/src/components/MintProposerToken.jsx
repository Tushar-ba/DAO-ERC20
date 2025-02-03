import { useState, useContext } from "react"
import { Web3Context } from "../context/Web3Context"

const MintProposerToken = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { createContractSigner } = useContext(Web3Context)

  const mintToken = async () => {
    setIsLoading(true)
    if (!createContractSigner) {
      console.error("Cannot fetch Contract Signer")
      setIsLoading(false)
      return
    }
    try {
      const contractToSign = await createContractSigner()
      const tx = await contractToSign.mintProposalToken()
      await tx.wait()
      setIsLoading(false)
      onClose() // Close the modal after successful minting
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-6 text-white">Mint Proposer Token</h2>
      <button
        onClick={mintToken}
        className={`w-full rounded-xl bg-white p-6 text-xl font-bold text-[#0C0C1D] shadow-[-9px_-9px_4px_0px_rgba(199,240,230,0.25)] transition-transform hover:scale-105 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Minting in progress..." : "Mint Token"}
      </button>
    </div>
  )
}

export default MintProposerToken

