import { useEffect, useState } from "react";
import type { User } from "../types";
import axios from "axios";
import * as jose from 'jose';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isUserLogged, setIsUserLogged] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [isErr, setIsErr] = useState<boolean>(false)
  const [err, setErr] = useState<string | null>(null)

  const backendUrl = import.meta.env.VITE_BACKEND_MAINURL

  useEffect(() => {
    const localToken = localStorage.getItem("token")
    if (localToken !== null) {
      axios.get(`${backendUrl}/users/info`, { headers: { Authorization: `Bearer ${localToken}` } })
      .then(({ data }) => {
        if(!data.id) {localStorage.clear(); return}
        setIsUserLogged(true)
        setUser({id: data.id, name: data.name, email: data.email})
        setToken(localToken)
      })
      .catch(() => {})
    }
  }, [])

  async function login(username: string, password: string, GCaptcha: string) {
    setLoading(true)
    const { data } = await axios.post(`${backendUrl}/auth/login/`, {
      name: username,
      password: password,
      g_captcha: GCaptcha
    })
    if (!data.token) {
      setIsErr(true)
      if(data.err) setErr(data.err)
      else setErr("Bad username or password")
      setLoading(false)
      return
    }
    setIsErr(false)
    setErr("")
    setToken(data.token)
    setIsUserLogged(true)
    const userData: { userId: string, username: string, email: string } = await jose.decodeJwt(data.token)
    setUser({ id: userData.userId, email: userData.email, name: username })
    setLoading(false)
    localStorage.setItem("token", data.token)
  }

  function logout() {
    setToken(null)
    setIsUserLogged(false)
    setUser(null)
    localStorage.clear()
  }

  return {login, logout, isUserLogged, user, token, loading, err, isErr}
}