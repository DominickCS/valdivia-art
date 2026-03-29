import { Link } from "react-router-dom"
import Logo from "../assets/logo.png"
import { useAuth } from '../context/AuthContext'

export default function NavigationBar() {
  const { user, logout } = useAuth();
  return (
    <div className="mx-auto">
      <div>
        <Link to={"/"} ><img className="mx-auto my-8 hover:scale-110 hover:opacity-40 transition-all duration-300" src={Logo} width={260} height={240} /></Link>
      </div>
      <nav>
        <div className="flex justify-evenly border-b-2 border-black/10 shadow-xl rounded-b-4xl shadow-black/20 px-8 py-4">
          <div className='*:mx-8 flex items-center text-center'>
            <Link className='transition-all hover:scale-110 hover:tracking-widest duration-300' to="/about">About</Link>
            <Link className='transition-all hover:scale-110 hover:tracking-widest duration-300' to="/about">Archive</Link>
            <Link className='transition-all hover:scale-110 hover:tracking-widest duration-300' to="/about">Current Art</Link>
            <Link className='transition-all hover:scale-110 hover:tracking-widest duration-300' to="/contact">Contact</Link>
          </div>
          <div className='*:mx-8 flex items-center text-center'>
            {user ? (
              <>
                {user.roles?.includes('ROLE_ADMIN') && (
                  <Link className='transition-all hover:scale-110 hover:tracking-widest duration-300' to="/admin">Creator Dashboard</Link>
                )}
                <Link className='transition-all hover:scale-110 hover:tracking-widest duration-300' to="/profile">Profile</Link>
                <Link className='transition-all hover:scale-110 hover:tracking-widest duration-300 hover:cursor-pointer' to="" onClick={logout} >Logout</Link>
              </>
            ) : (
              <>
                <Link className='transition-all hover:scale-110 hover:tracking-widest duration-300' to="/login">Login</Link>
                <Link className='transition-all hover:scale-110 hover:tracking-widest duration-300' to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  )
}
