import { useEffect } from "react"
import Checkmark from "../assets/checkmark.png"
import { useNavigate } from "react-router-dom"

export default function SuccessPage() {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate("/")
    }, 5000)
  })
  return (
    <>
      <div className="px-12 [&>p]:leading-12 tracking-tight min-h-svh content-center">
        <img className="mx-auto my-8" src={Checkmark} width={160} />
        <p className="text-center font-extrabold text-3xl">PAYMENT SUCCESSFUL!</p>
        <p className="text-center font-extrabold text-md">An invoice for your purchase will be sent to your email! <br />Please reach out to me if you have any questions or concerns.</p>
        <p className="text-center text-md mt-4 font-light">Redirecting...</p>
      </div>

    </>
  )
}
