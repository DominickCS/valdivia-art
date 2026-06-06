import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import api from '../api/AxiosInstance';
import type { AxiosError } from 'axios';


export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    "email": '',
  })
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setIsLoading(true);
      const response = await api.post('/api/auth/forgot-password', {
        email: formData.email,
      });

      toast.success(<p className="font-extrabold text-center text-lg px-4">{response.data.message}</p>);

      setIsLoading(false);

      setTimeout(() => navigate("/login"), 3000);

    } catch (err) {
      setIsLoading(false)
      const error = err as AxiosError<{ message: string }>;
      toast.error(<p className="font-extrabold text-center text-lg px-4">{error.response?.data.message}</p>);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <div className='mx-auto max-w-sm h-200 content-center px-8'>
        <form onSubmit={handleSubmit} className='[&>input]:bg-white [&>input]:text-black [&>input]:px-2 font-semibold *:my-4 flex flex-col'>
          <label htmlFor='email'>Email Address</label>
          <input type='email' value={formData.email} onChange={handleChange} name='email' />
          <button type='submit' disabled={isLoading} className='button-spcl mx-auto w-full'>{isLoading ? "PLEASE WAIT..." : "RESET PASSWORD"}</button>
        </form >
        <p className='font-light text-sm px-4 text-center'>A password reset link will be sent to your email if your account is found in our records.</p>
      </div >
    </>
  )
}
