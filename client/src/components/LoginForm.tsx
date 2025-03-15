import { useContext, useState } from "react"
import type { loginFormData, useAuthType } from "../types"
import { AuthContext } from "../Contexts/AuthContext"

export default function LoginForm() {
  const [loginForm, setLoginForm] = useState<loginFormData>({username: "", password: ""})
  const auth: useAuthType | null = useContext(AuthContext)

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(auth==null) {console.error("AUTH IS NULL"); return}
    auth.login(loginForm.username, loginForm.password)
    // TODO: is good logged?
  }

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
      <input type="submit" value="login" className="btn btn-primary" />
    </form>
  )
}
