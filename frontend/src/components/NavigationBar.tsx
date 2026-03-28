import { Link } from "react-router-dom"
import Logo from "../assets/logo.png"
import { useAuth } from '../context/AuthContext'

export default function NavigationBar() {
  const { user, logout } = useAuth();
  return (
    <div className='py-8'>
      <nav className='items-center'>
        <div>
          <Link to={"/"} ><img className="mx-auto" src={Logo} width={260} height={260} /></Link>
        </div>
        <div className='*:mx-4 flex justify-end px-16'>
          {user ? (
            <>
              {user.roles?.includes('ROLE_ADMIN') && (
                <Link className='transition-all hover:scale-110 hover:tracking-widest duration-500' to="/admin">Creator Dashboard</Link>
              )}
              <Link className='transition-all hover:scale-110 hover:tracking-widest duration-500' to="/profile">Profile</Link>
              <button className='transition-all hover:scale-110 hover:tracking-widest duration-500 hover:cursor-pointer' onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link className='transition-all hover:scale-110 hover:tracking-widest duration-500' to="/login">Login</Link>
              <Link className='transition-all hover:scale-110 hover:tracking-widest duration-500' to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
    </div>
  )
}
