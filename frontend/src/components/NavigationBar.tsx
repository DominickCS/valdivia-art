import { useState } from "react"
import { Link } from "react-router-dom"
import Logo from "../assets/logo.png"
import { useAuth } from '../context/AuthContext'

export default function NavigationBar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const close = () => setMenuOpen(false);

  return (
    <div className="mx-auto max-w-xs sm:max-w-full">
      <div>
        <Link to="/" onClick={close}>
          <img
            className="mx-auto my-8 hover:scale-110 hover:opacity-40 transition-all duration-300"
            src={Logo} width={260} height={240}
          />
        </Link>
      </div>

      <nav>
        <div className="flex items-center justify-between px-8 py-4">

          {/* Desktop links */}
          <div className="hidden sm:flex items-center text-center *:mx-8">
            <Link className="transition-all hover:scale-110 hover:tracking-widest duration-300" to="/about">About</Link>
            <Link className="transition-all hover:scale-110 hover:tracking-widest duration-300" to="/archive">Archive</Link>
            <Link className="transition-all hover:scale-110 hover:tracking-widest duration-300" to="/current-art">Current Art</Link>
            <Link className="transition-all hover:scale-110 hover:tracking-widest duration-300" to="/contact">Contact</Link>
          </div>

          {/* Desktop auth links */}
          <div className="hidden sm:flex items-center text-center *:mx-8">
            {user ? (
              <>
                {user.roles?.includes('ROLE_ADMIN') && (
                  <Link className="transition-all hover:scale-110 hover:tracking-widest duration-300" to="/admin">Creator Dashboard</Link>
                )}
                <Link className="transition-all hover:scale-110 hover:tracking-widest duration-300" to="/profile">Profile</Link>
                <Link className="transition-all hover:scale-110 hover:tracking-widest duration-300 hover:cursor-pointer" to="" onClick={logout}>Logout</Link>
              </>
            ) : (
              <>
                <Link className="transition-all hover:scale-110 hover:tracking-widest duration-300" to="/login">Login</Link>
                <Link className="transition-all hover:scale-110 hover:tracking-widest duration-300" to="/register">Register</Link>
              </>
            )}
          </div>

          {/* Hamburger button */}
          <button
            className="sm:hidden content-center flex flex-col justify-center items-center gap-1.5 w-8 h-8 ml-auto"
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden flex flex-col items-center gap-4 py-6 border-b-2 border-black/10 shadow-md">
            <Link className="transition-all hover:tracking-widest duration-300" to="/about" onClick={close}>About</Link>
            <Link className="transition-all hover:tracking-widest duration-300" to="/archive" onClick={close}>Archive</Link>
            <Link className="transition-all hover:tracking-widest duration-300" to="/current-art" onClick={close}>Current Art</Link>
            <Link className="transition-all hover:tracking-widest duration-300" to="/contact" onClick={close}>Contact</Link>
            {user ? (
              <>
                {user.roles?.includes('ROLE_ADMIN') && (
                  <Link className="transition-all hover:tracking-widest duration-300" to="/admin" onClick={close}>Creator Dashboard</Link>
                )}
                <Link className="transition-all hover:tracking-widest duration-300" to="/profile" onClick={close}>Profile</Link>
                <button className="transition-all hover:tracking-widest duration-300" onClick={() => { logout(); close(); }}>Logout</button>
              </>
            ) : (
              <>
                <Link className="transition-all hover:tracking-widest duration-300" to="/login" onClick={close}>Login</Link>
                <Link className="transition-all hover:tracking-widest duration-300" to="/register" onClick={close}>Register</Link>
              </>
            )}
          </div>
        )}
      </nav>
    </div>
  )
}
