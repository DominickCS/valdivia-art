import { Link } from "react-router-dom"
import Logo from "../assets/logo.png"
import { useAuth } from '../context/AuthContext'

export default function NavigationBar() {
  const { user, logout } = useAuth();
  return (
    <div className="mx-auto">
      <nav className='items-center'>
        <div className="flex justify-center border-b-2 border-black/10 shadow-xl rounded-b-4xl shadow-black/15 bg-transparent px-16">
          <div className='*:mx-8 flex items-center text-center'>
            <Link className='transition-all hover:scale-110 hover:tracking-widest duration-300' to="/about">About</Link>
            <Link className='transition-all hover:scale-110 hover:tracking-widest duration-300' to="/about">Archive</Link>
            <Link className='transition-all hover:scale-110 hover:tracking-widest duration-300' to="/about">Current Art</Link>
            <Link className='transition-all hover:scale-110 hover:tracking-widest duration-300' to="/about">Contact</Link>
          </div>
          <div>
            <Link to={"/"} ><img className="mx-auto my-4 hover:scale-110 hover:opacity-40 transition-all duration-300" src={Logo} width={240} height={240} /></Link>
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
