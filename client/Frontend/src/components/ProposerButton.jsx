import { useContext, useState, useCallback, useEffect } from "react"
import { Web3Context } from "../context/Web3Context"
import { ethers } from "ethers"
import MintProposerToken from "./MintProposerToken"

export default function ProposerButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [proposer, setProposer] = useState(false)
  const [showMintToken, setShowMintToken] = useState(false)
  const { createContractSigner, contract, account } = useContext(Web3Context)

  const handleClick = async () => {
    try {
      console.log("clicked")
      setIsLoading(true)
      const contractSigner = await createContractSigner()
      if (!contractSigner) {
        console.error("Contract signer is not available")
        setIsLoading(false)
        return
      }
      const tx = await contractSigner.getProposerRole({
        value: ethers.parseEther("1"),
      })
      await tx.wait()
      console.log("Transaction successful:", tx)
      setShowMintToken(true) // Show mint token UI after successful transaction
    } catch (error) {
      console.error("Transaction failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const disableIfAlreadyProposer = useCallback(async () => {
    try {
      if (!contract) {
        console.error("Contract not available")
        return
      }
      const isProposer = await contract.hasRole(
        "0xb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1",
        account,
      )
      console.log(isProposer)
      setProposer(isProposer)
      return isProposer
    } catch (error) {
      console.log(error)
    }
  }, [contract, account])

  useEffect(() => {
    disableIfAlreadyProposer()
  }, [disableIfAlreadyProposer])

  return (
    <div className="flex flex-col gap-4">
      <button
        className={`w-full rounded-xl bg-white p-6 text-xl font-bold text-[#0C0C1D] shadow-[-9px_-9px_4px_0px_rgba(199,240,230,0.25)] transition-transform hover:scale-105 ${
          isLoading || proposer ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleClick}
        disabled={isLoading || proposer}
      >
        {isLoading ? "Processing..." : proposer ? "You are already a proposer" : "Click here to become a Proposer"}
      </button>

      {/* Only show MintProposerToken after successful transaction */}
      {showMintToken && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-[#0C0C1D] p-8 rounded-xl relative max-w-md w-full mx-4">
            <button
              onClick={() => setShowMintToken(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <MintProposerToken onClose={() => setShowMintToken(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

