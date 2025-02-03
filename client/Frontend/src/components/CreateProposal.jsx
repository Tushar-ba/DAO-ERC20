import { useContext, useState } from "react"
import { Web3Context } from "../context/Web3Context"

export default function CreateProposal() {
  const { createContractSigner } = useContext(Web3Context);
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [seconds, setSeconds] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const submitForm = async(e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    
    try {
      const durationInSeconds = parseInt(seconds, 10);
      if (isNaN(durationInSeconds) || durationInSeconds <= 0) {
        throw new Error("Please enter a valid duration in seconds");
      }

      const signer = await createContractSigner();
      
      const tx = await signer.createProposal(
        name,
        description,
        durationInSeconds
      );
      
      await tx.wait();
      setIsFormOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error creating proposal:", error);
      setError(error.message || "Failed to create proposal");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleSecondsChange = (value) => {
    // Remove non-numeric characters and leading zeros
    const cleaned = value.replace(/\D/g, '').replace(/^0+/, '');
    setSeconds(cleaned);
  }

  const resetForm = () => {
    setName("");
    setDescription("");
    setSeconds("");
    setError("");
  }

  return (
    <>
      <button
        onClick={() => setIsFormOpen(true)}
        className="w-full rounded-xl bg-white p-6 text-xl font-bold text-[#0C0C1D] shadow-[-9px_-9px_4px_0px_rgba(199,240,230,0.25)] transition-transform hover:scale-105"
      >
        Create Proposal
      </button>

      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsFormOpen(false);
              resetForm();
            }
          }}
        >
          <div className="w-[696px] h-[696px] rounded-xl bg-[#0C0C1D] p-12 overflow-y-auto">
            <h2 className="mb-8 text-center text-3xl font-bold text-white underline">Create Proposal</h2>

            {error && (
              <div className="mb-4 p-3 rounded bg-red-500/10 text-red-500 text-center">
                {error}
              </div>
            )}

            <form onSubmit={submitForm} className="space-y-8">
              <div className="space-y-2">
                <label className="block text-xl font-semibold text-white">Name Of the Proposal</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Type here"
                  className="w-full rounded-xl border-3 border-[#F7FDFC] bg-[#1FAD6B] p-4 text-lg text-[#0C0C1D] placeholder-[#0C0C1D] focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xl font-semibold text-white">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Type here"
                  className="h-48 w-full rounded-xl border-3 border-[#F7FDFC] bg-[#1FAD6B] p-4 text-lg text-[#0C0C1D] placeholder-[#0C0C1D] focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xl font-semibold text-white">Duration (in seconds)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  value={seconds}
                  onChange={(e) => handleSecondsChange(e.target.value)}
                  placeholder="Enter duration in seconds"
                  className="w-full rounded-xl border-3 border-[#F7FDFC] bg-[#1FAD6B] p-4 text-lg text-[#0C0C1D] placeholder-[#0C0C1D] focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-[#1FAD6B] px-16 py-3 text-xl font-bold text-[#0C0C1D] transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isSubmitting ? "Creating..." : "Confirm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}