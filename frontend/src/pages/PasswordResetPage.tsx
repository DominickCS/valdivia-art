// ResetPasswordPage.tsx
import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../api/AxiosInstance'
import type { AxiosError } from 'axios'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ password: '', confirm: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (formData.password !== formData.confirm) {
      toast.error(<p className="font-extrabold text-center text-lg px-4">Passwords do not match.</p>)
      return
    }

    if (formData.password.length < 8) {
      toast.error(<p className="font-extrabold text-center text-lg px-4">Password must be at least 8 characters.</p>)
      return
    }

    try {
      setIsLoading(true)
      const response = await api.post('/api/auth/reset-password', {
        token,
        newPassword: formData.password,
      })
      toast.success(<p className="font-extrabold text-center text-lg px-4">{response.data.message ?? 'Password updated successfully.'}</p>)
      setTimeout(() => navigate('/login'), 2500)
    } catch (err) {
      const error = err as AxiosError<{ message: string }>
      toast.error(<p className="font-extrabold text-center text-lg px-4">{error.response?.data.message ?? 'Something went wrong. Please request a new link.'}</p>)
    } finally {
      setIsLoading(false)
    }
  }

  // Token missing — show a dead-end state instead of a broken form
  if (!token) {
    return (
      <div className='mx-auto max-w-sm h-200 content-center px-8 text-center'>
        <p className='font-semibold text-lg mb-2'>Invalid reset link.</p>
        <p className='font-light text-sm text-gray-500 mb-6'>
          This link is missing a reset token. Please request a new one.
        </p>
        <Link to='/forgot-password' className='button-spcl inline-block w-full text-center'>
          REQUEST NEW LINK
        </Link>
      </div>
    )
  }

  return (
    <div className='mx-auto max-w-sm h-200 content-center px-8'>
      <form
        onSubmit={handleSubmit}
        className='[&>input]:bg-white [&>input]:text-black [&>input]:px-2 font-semibold *:my-4 flex flex-col'
      >
        <label htmlFor='password'>New Password</label>
        <input
          id='password'
          type='password'
          name='password'
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label htmlFor='confirm'>Confirm Password</label>
        <input
          id='confirm'
          type='password'
          name='confirm'
          value={formData.confirm}
          onChange={handleChange}
          required
        />

        <button
          type='submit'
          disabled={isLoading}
          className='button-spcl mx-auto w-full'
        >
          {isLoading ? 'PLEASE WAIT...' : 'SET NEW PASSWORD'}
        </button>
      </form>

      <p className='font-light text-sm px-4 text-center'>
        Password must be at least 8 characters. After updating you'll be redirected to login.
      </p>
    </div>
  )
}
