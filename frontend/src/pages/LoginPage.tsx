import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast, Bounce } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import api from '../api/AxiosInstance';
import { useAuth } from '../context/AuthContext';


export default function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    "email": '',
    "password": ''
  })
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setIsLoading(true);
      const response = await api.post('/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      const token = response.data.token;
      login(token)

      toast.success(<p className="font-extrabold text-center text-lg px-4">{response.data.message}</p>, {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });

      setIsLoading(false);

      setTimeout(() => navigate("/"), 3000);

    } catch (err) {
      setIsLoading(false)
      toast.error(<p className="font-extrabold text-center text-lg px-4">{err.response.data.message}</p>, {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
    }
  }

  const handleChange = (e) => {

    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <ToastContainer className="px-8 py-4" />
      <div className='mx-auto max-w-sm h-200 content-center px-8'>
        <form onSubmit={handleSubmit} className='[&>input]:bg-white [&>input]:text-black [&>input]:px-2 font-semibold *:my-4 flex flex-col'>
          <label htmlFor='email'>Email Address</label>
          <input type='email' value={formData.email} onChange={handleChange} name='email' />
          <label htmlFor='password'>Password</label>
          <input type='password' value={formData.password} onChange={handleChange} name='password' />
          <button type='submit' disabled={isLoading} className='button-spcl mx-auto w-full'>{isLoading ? "PLEASE WAIT..." : "LOGIN"}</button>
        </form >
      </div >
    </>
  )
}
