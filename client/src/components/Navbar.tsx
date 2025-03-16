import { useContext } from "react"
import { NavLink } from "react-router"
import { AuthContext } from "../Contexts/AuthContext"
import type { useAuthType } from "../types"

export default function Navbar() {
  const auth = useContext<useAuthType | null>(AuthContext)

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
        {auth?.isUserLogged
          ? <div className="flex flex-row gap-4 items-center">
            <p >Welcome <span className="text-accent font-bold">{auth.user?.name}</span></p>
            <button onClick={() => { auth.logout() }} className="btn btn-warning">Logout</button>
          </div>
          : <NavLink to={"/auth"} className="btn btn-secondary">Sign in/up</NavLink>
        }
      </div>
    </nav>
  )
}
