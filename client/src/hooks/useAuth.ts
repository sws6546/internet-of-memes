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
    console.log(localToken)
    if (localToken !== null) {
      axios.get(`${backendUrl}/users/info`, { headers: { Authorization: `Bearer ${localToken}` } })
      .then(({ data }) => {
        if(!data.id) return
        setIsUserLogged(true)
        setUser({id: data.id, name: data.name, email: data.email})
        setToken(localToken)
      })
    }
  }, [])

  async function login(username: string, password: string) {
    setLoading(true)
    const { data } = await axios.post(`${backendUrl}/auth/login/`, {
      name: username,
      password: password
    })
    if (!data.token) {
      setIsErr(true)
      setErr("Bad username or password")
      return
    }
    setIsErr(false)
    setErr("")
    setToken(data.token)
    setIsUserLogged(true)
    const userData: { userId: string, username: string, email: string } = jose.decodeJwt(data.token)
    setUser({ id: userData.userId, email: userData.email, name: username })
    setLoading(false)
    localStorage.setItem("token", data.token)
  }

  function logout() {
    setToken(null)
    setIsUserLogged(false)
    setUser(null)
  }

  return {login, logout, isUserLogged, user, token, loading, err, isErr}
}