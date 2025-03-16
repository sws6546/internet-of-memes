import { useContext, useEffect, useState } from "react"
import type { loginFormData, useAuthType } from "../types"
import { AuthContext } from "../Contexts/AuthContext"
import { useNavigate } from "react-router"

export default function LoginForm() {
  const [loginForm, setLoginForm] = useState<loginFormData>({ username: "", password: "" })
  const auth: useAuthType | null = useContext(AuthContext)
  const navigate = useNavigate()

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (auth == null) { console.error("AUTH IS NULL"); return }
    await auth.login(loginForm.username, loginForm.password)
  }

  useEffect(() => {
    if (auth?.isUserLogged) {
      navigate("/")
    }
  }, [auth?.isUserLogged])

  return (
    <form onSubmit={submitHandler} className="bg-base-300 flex flex-col gap-4 rounded-md items-center p-4 pt-12 pb-12
     border border-accent-content shadow-xl">
      <label className="floating-label w-4/5">
        <input onChange={(e) => { setLoginForm((data) => ({ ...data, username: e.target.value })) }}
          type="text" placeholder="Username" className="input validator" required minLength={3} />
        <span>Username</span>
        <p className="validator-hint">Must be more than 3 characters</p>
      </label>
      <label className="floating-label w-4/5">
        <input onChange={(e) => { setLoginForm((data) => ({ ...data, password: e.target.value })) }}
          type="password" placeholder="Password" className="input validator" required minLength={3} />
        <span>Password</span>
        <p className="validator-hint">
          Must be more than 3 characters
        </p>
      </label>
      <button type="submit" className="btn btn-primary">
        {auth?.loading ? <span className="loading loading-spinner loading-md"></span> : <p>Login</p>}
      </button>
      {auth?.isErr && <p className="text-red-500">{auth.err}</p>}
    </form>
  )
}
