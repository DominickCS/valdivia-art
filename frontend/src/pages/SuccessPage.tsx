import { useEffect } from "react"
import Checkmark from "../assets/checkmark.png"
import { useNavigate } from "react-router-dom"

export default function SuccessPage() {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate("/")
    }, 8000)
  })
  return (
    <>
      <div className="mt-24 px-12 [&>p]:leading-10 tracking-tight">
        <img className="mx-auto" src={Checkmark} width={200} />
        <h1 className="text-center font-extrabold text-4xl mb-8">PAYMENT SUCCESSFUL!</h1>
        <p className="text-center font-extrabold text-xl">An invoice for your purchase will be sent to your email! <br />Please reach out to support if you have any issues.</p>
      </div>
      <p className="text-center text-md mt-8 font-light">Redirecting...</p>

    </>
  )
}
