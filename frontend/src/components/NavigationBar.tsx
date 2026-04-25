import { useState } from "react"
import { Link } from "react-router-dom"
import Logo from "../assets/logo.png"
import Cart from "../assets/cart.svg"
import { useAuth } from '../context/AuthContext'

export default function NavigationBar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  return (
    <div className="w-full">
      <nav className="relative flex items-center justify-center px-4 pb-8 pt-4">

        {/* Desktop nav links — absolute left */}
        <div className="hidden xl:flex items-center gap-8 absolute left-8">
          <Link className="transition-all hover:scale-110 hover:tracking-widest duration-300" to="/about">ABOUT ME</Link>
          <Link className="transition-all hover:scale-110 hover:tracking-widest duration-300" to="/for-sale">FOR SALE</Link>
          <Link className="transition-all hover:scale-110 hover:tracking-widest duration-300" to="/archive">ART ARCHIVE</Link>
          <Link className="transition-all hover:scale-110 hover:tracking-widest duration-300" to="/contact">CONTACT ME</Link>
        </div>

        {/* Logo — always centered */}
        <Link to="/" onClick={close}>
          <img
            className="hover:scale-110 hover:opacity-40 transition-all duration-300"
            src={Logo} width={200} height={40}
          />
        </Link>

        {/* Desktop auth links — absolute right */}
        <div className="hidden xl:flex items-center gap-8 absolute right-8">
          {user ? (
            <>
              {user.roles?.includes('ROLE_ADMIN') && (
                <Link className="transition-all hover:scale-110 hover:tracking-widest duration-300" to="/admin">DASHBOARD</Link>
              )}
              <Link to="/cart" onClick={close}><img className="transition-all hover:scale-120 duration-300" src={Cart} height={20} width={20} /></Link>
              <Link className="transition-all hover:scale-110 hover:tracking-widest duration-300" to="/profile">PROFILE</Link>
              <button className="hover:cursor-pointer transition-all hover:scale-110 hover:tracking-widest duration-300" onClick={logout}>LOGOUT</button>
            </>
          ) : (
            <>
              <Link className="transition-all hover:scale-110 hover:tracking-widest duration-300" to="/login">LOGIN</Link>
              <Link className="transition-all hover:scale-110 hover:tracking-widest duration-300" to="/register">REGISTER</Link>
            </>
          )}
        </div>

        {/* Hamburger — absolute right, mobile only */}
        <button
          className="xl:hidden absolute right-8 flex flex-col justify-center items-center gap-1.5 w-8 h-8"
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="xl:hidden flex flex-col items-center gap-4 py-6 border-b-2 border-black/10 shadow-md mb-4">
          <Link className="transition-all hover:tracking-widest duration-300" to="/about" onClick={close}>ABOUT ME</Link>
          <Link className="transition-all hover:tracking-widest duration-300" to="/for-sale" onClick={close}>FOR SALE</Link>
          <Link className="transition-all hover:tracking-widest duration-300" to="/archive" onClick={close}>ART ARCHIVE</Link>
          <Link className="transition-all hover:tracking-widest duration-300" to="/contact" onClick={close}>CONTACT ME</Link>
          {user ? (
            <>
              {user.roles?.includes('ROLE_ADMIN') && (
                <Link className="transition-all hover:tracking-widest duration-300" to="/admin" onClick={close}>DASHBOARD</Link>
              )}
              <Link to="/cart" onClick={close}><img className="transition-all hover:scale-120 duration-300" src={Cart} height={20} width={20} /></Link>
              <Link className="transition-all hover:tracking-widest duration-300" to="/profile" onClick={close}>PROFILE</Link>
              <button className="hover:cursor-pointer transition-all hover:tracking-widest duration-300" onClick={() => { logout(); close(); }}>LOGOUT</button>
            </>
          ) : (
            <>
              <Link className="transition-all hover:tracking-widest duration-300" to="/login" onClick={close}>LOGIN</Link>
              <Link className="transition-all hover:tracking-widest duration-300" to="/register" onClick={close}>REGISTER</Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}
