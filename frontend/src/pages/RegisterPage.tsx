import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Bounce, ToastContainer } from "react-toastify";
import api from '../api/AxiosInstance';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    "fullName": '',
    "email": '',
    "password": ''
  })
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await api.post('/api/auth/register', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });


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

      setTimeout(() => navigate("/"), 3000);

    } catch (err) {
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
      <ToastContainer />
      <div className='mx-auto max-w-sm h-200 content-center px-4'>
        <form onSubmit={handleSubmit} className='[&>input]:bg-white [&>input]:text-black [&>input]:px-2 font-semibold *:my-4 flex flex-col'>
          <label htmlFor="fullName">Full Name</label>
          <input type="text" value={formData.fullName} onChange={handleChange} name="fullName" />
          <label htmlFor="email">Email Address</label>
          <input type='email' value={formData.email} onChange={handleChange} name='email' />
          <label htmlFor="password">Password</label>
          <input type='password' value={formData.password} onChange={handleChange} name='password' />
          <button type="submit" className="bn54 mx-auto">REGISTER</button>
        </form>
      </div>
    </>
  )
}
