import axios from "axios"
import { useContext, useState } from "react"
import { useAuthType } from "../types"
import { AuthContext } from "../Contexts/AuthContext"
import { useNavigate } from "react-router"

export default function AddCommentForm({ to, id }: { to: 'post' | 'comment', id: string }) {
  const [commentValue, setCommentValue] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const auth: useAuthType = useContext(AuthContext)!
  const navigate = useNavigate()

  const addComment = async () => {
    setLoading(true)
    if (commentValue.length < 3) {
      setError("Must be minimum 3 characters")
      return
    }

    if (to == "post") {
      setError("")
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_MAINURL}/comment/create`, {
        postId: id,
        textContent: commentValue
      }, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      })
      if (response.data.err) {
        setError(response.data.err)
      }
      else {
        navigate(0);
      }
    }
  }

  return (
    <>
      <p className="text-red-500">{error}</p>
      <form onSubmit={(e) => {
        e.preventDefault()
        addComment()
      }} className="flex flex-row items-start justify-between gap-2">
        <label className="floating-label w-full">
          <input onChange={(e) => { setCommentValue(e.target.value) }}
            type="text" placeholder="Write comment here" className="input validator w-full" required minLength={3} />
          <span>Write comment here</span>
          <p className="validator-hint">Must be more than 3 characters</p>
        </label>
        <button type="submit" className="btn btn-primary" disabled={loading}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
        </svg>
        </button>
      </form>
    </>
  )
}
