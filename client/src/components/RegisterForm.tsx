import { useState } from "react"
import type { registerFormData } from "../types"

export default function RegisterForm() {
    const [registerForm, setRegisterForm] = useState<registerFormData>({username: "", email: "", password: ""})
  return (
    <form onSubmit={(e) => { e.preventDefault() }} className="bg-base-300 flex flex-col gap-4 rounded-md items-center p-4 pt-12 pb-12
     border border-accent-content shadow-xl">
      <label className="floating-label w-4/5">
        <input onChange={(e) => { setRegisterForm((data) => ({...data, username: e.target.value}))}} 
        type="text" placeholder="Username" className="input validator" required minLength={3} />
        <span>Username</span>
        <p className="validator-hint">Must be more than 3 characters</p>
      </label>
      <label className="floating-label w-4/5">
        <input onChange={(e) => { setRegisterForm((data) => ({...data, email: e.target.value}))}} 
        type="email" placeholder="Email" className="input validator" required />
        <span>Email</span>
        <p className="validator-hint">Must be real email</p>
      </label>
      <label className="floating-label w-4/5">
        <input onChange={(e) => { setRegisterForm((data) => ({...data, password: e.target.value}))}} 
        type="password" placeholder="Password" className="input validator" required
          minLength={8} pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
        />
        <span>Password</span>
        <p className="validator-hint">
          Must be more than 8 characters, including
          <br />At least one number
          <br />At least one lowercase letter
          <br />At least one uppercase letter
        </p>
      </label>
      <input type="submit" value="register" className="btn btn-accent" />

    </form>
  )
}
