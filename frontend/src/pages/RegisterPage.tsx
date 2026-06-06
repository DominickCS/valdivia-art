import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from '../api/AxiosInstance';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    "fullName": '',
    "email": '',
    "password": ''
  })
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setIsLoading(true)
      const response = await api.post('/api/auth/register', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });


      toast.success(<p className="font-extrabold text-center text-lg px-4">{response.data.message}</p>);

      setIsLoading(false);
      setTimeout(() => navigate("/"), 3000);

    } catch (err) {
      setIsLoading(false);
      toast.error(<p className="font-extrabold text-center text-lg px-4">{"An error has occurred during registration"}</p>);
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
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            name="fullName"
            autoComplete="name"
          />
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type='email'
            value={formData.email}
            onChange={handleChange}
            name='email'
            autoComplete="email"
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type='password'
            value={formData.password}
            onChange={handleChange}
            name='password'
            autoComplete="new-password"
          />
          <button type="submit" disabled={isLoading} className="button-spcl mx-auto w-full">{isLoading ? "PLEASE WAIT..." : "REGISTER"}</button>
        </form>
        <p className='text-sm text-center hover:font-extrabold duration-300 transition-all'><Link to={"/login"}>I already have an account</Link></p>
      </div>
    </>
  )
}
