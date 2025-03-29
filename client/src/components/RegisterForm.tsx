import { useState } from "react"
import type { registerFormData } from "../types"
import axios from "axios"
import RecaptchaButton from "./RecaptchaButton"

export default function RegisterForm() {
  const [registerForm, setRegisterForm] = useState<registerFormData>({ username: "", email: "", password: "" })
  const [error, setError] = useState<string>("")
  const [isRegistered, setIsRegistered] = useState<boolean>(false)
  const [GCaptcha, setGCaptcha] = useState<string>("")

  const register = async () => {
    const backendUrl = import.meta.env.VITE_BACKEND_MAINURL
    const { data } = await axios.post(`${backendUrl}/auth/register`, {
      name: registerForm.username,
      email: registerForm.email,
      password: registerForm.password,
      g_captcha: GCaptcha
    })
    if (!data.id) {
      if(data.err) setError(data.err)
      else setError(data)
      return
    }
    else {
      setIsRegistered(true)
      setError("")
    }
  }

  return (
    <>
      {isRegistered && (
        <div role="alert" className="alert alert-success mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Account Created 🎆. Now you can Log in</span>
        </div>
      )}
      <form onSubmit={(e) => { e.preventDefault(); register() }} className="bg-base-300 flex flex-col gap-4 rounded-md items-center p-4 pt-12 pb-12
     border border-accent-content shadow-xl">
        <label className="floating-label w-4/5">
          <input onChange={(e) => { setRegisterForm((data) => ({ ...data, username: e.target.value })) }}
            type="text" placeholder="Username" className="input validator w-full" required minLength={3} />
          <span>Username</span>
          <p className="validator-hint">Must be more than 3 characters</p>
        </label>
        <label className="floating-label w-4/5">
          <input onChange={(e) => { setRegisterForm((data) => ({ ...data, email: e.target.value })) }}
            type="email" placeholder="Email" className="input validator w-full" required />
          <span>Email</span>
          <p className="validator-hint">Must be real email</p>
        </label>
        <label className="floating-label w-4/5">
          <input onChange={(e) => { setRegisterForm((data) => ({ ...data, password: e.target.value })) }}
            type="password" placeholder="Password" className="input validator w-full" required
            minLength={4} // pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          />
          <span>Password</span>
        </label>
        <RecaptchaButton setGCaptcha={setGCaptcha}/>
        <input type="submit" value="register" className="btn btn-accent" />
        <p className="text-red-500">{error}</p>
      </form>
    </>

  )
}
