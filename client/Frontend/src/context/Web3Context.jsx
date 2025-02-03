import { createContext, useState, useEffect, useCallback } from "react"
import { ethers } from "ethers"
import { ABI } from "./ABI.js"

const CONTRACT_ABI = ABI
const CONTRACT_ADDRESS = "0x2bf1645B5d681BFcCf3A43577264858Ed4394Fdd"

export const Web3Context = createContext()

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [contract, setContract] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isContractSigner, setIsContractSigner] = useState(false);

  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const address = await signer.getAddress()
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)

        setAccount(address)
        setProvider(provider)
        setSigner(signer)
        setContract(contract)
        setIsConnected(true)
        console.log("Contract ABI:", CONTRACT_ABI);
        console.log("Contract instance:", contract);
      } catch (error) {
        console.error("Failed to connect wallet:", error)
      }
    } else {
      console.log("Please install MetaMask!")
    }
  }, [])

  const createContractSigner = useCallback( async () =>{
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" })
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contractSigner = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
        setProvider(provider);
        setSigner(signer);
        setIsContractSigner(contractSigner);
        return contractSigner;
    } catch (error) {
      console.log(error);
    }
  }, [])

  const disconnectWallet = useCallback(() => {
    setAccount(null)
    setProvider(null)
    setSigner(null)
    setContract(null)
    setIsConnected(false)
  }, [])

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          connectWallet()
        } else {
          disconnectWallet()
        }
      })

      window.ethereum.on("chainChanged", () => {
        window.location.reload()
      })
    }

    return () => {
      if (typeof window.ethereum !== "undefined") {
        window.ethereum.removeAllListeners("accountsChanged")
        window.ethereum.removeAllListeners("chainChanged")
      }
    }
  }, [connectWallet, disconnectWallet])

  return (
    <Web3Context.Provider
      value={{
        account,
        provider,
        signer,
        contract,
        isConnected,
        connectWallet,
        disconnectWallet,
        CONTRACT_ABI,
        CONTRACT_ADDRESS,
        createContractSigner
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

