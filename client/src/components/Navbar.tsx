import { NavLink } from "react-router"

export default function Navbar() {
  const appName = import.meta.env.VITE_APP_NAME
  return (
    <nav className="navbar bg-base-300 rounded-b-md">
      <div className="navbar-start">
        <label htmlFor="my-drawer" className="btn btn-primary drawer-button">Open drawer</label>
      </div>
      <div className="navbar-center">
        <p className="text-xl">{appName}</p>
      </div>
      <div className="navbar-end">
        
        <NavLink to={"/auth"} className="btn btn-secondary">Sign in/up</NavLink>
      </div>
    </nav>
  )
}
