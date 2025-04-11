import { ReactNode, useContext, useEffect, useState } from "react"
import type { Like, Post } from "../types"
import axios from "axios"
import { AuthContext } from "../Contexts/AuthContext"
import { useNavigate } from "react-router"

export default function PostCard({ post, clickable }: { post: Post, clickable?: boolean }) {
  const [likes, setLikes] = useState<Like[]>(post.likes)
  const [userLikeValue, setUserLikeValue] = useState<boolean | null>(null)
  const [commentsCount, setCommentsCount] = useState<number>(0)
  const auth = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_MAINURL}/comment/count/${post.id}`)
      .then(data => {
        setCommentsCount(data.data)
      })
  }, [])

  const sendLike = async (likeValue: boolean) => {
    const appUrl = import.meta.env.VITE_BACKEND_MAINURL
    try {
      const { data } = await axios.post(`${appUrl}/posts/addLike/`, {
        postId: post.id,
        likeValue: likeValue
      }, { headers: { "Authorization": `Bearer ${auth?.token}` } })
      if (data.id) {
        setUserLikeValue(likeValue)
      }
    } catch (err) { console.log(err) }
  }

  return (
    <div className="border m-4 w-full md:w-2/5">
      <Clickable clickable={clickable} onClick={() => {
        navigate(`/post/${post.id}`)
      }}>
        <div className="p-4 flex flex-col gap-2">
          <p className="text-xl">{post.title}</p>
          <div className="flex flex-row items-center justify-between">
            <p>{post.author.name}</p>
            <p className="text-sm">{new Date(post.createdAt).toLocaleDateString("pl-PL", { hour: "numeric", minute: "2-digit" })}</p>
          </div>
          <p>{post.textContent}</p>
        </div>
        <img src={`${import.meta.env.VITE_BACKEND_MAINURL}/${post.filePath}`} alt={post.filePath} />
      </Clickable>
      <div className="flex flex-row justify-between gap-1 items-center">
        <div className="flex flex-row gap-1">
          <button onClick={() => { sendLike(true) }} className="btn btn-dash">{import.meta.env.VITE_LIKE_EMOJI}{
            likes.filter(like => like.value).length + [userLikeValue].filter(like => like != null).filter(like => like).length
          }</button>
          <button onClick={() => { sendLike(false) }} className="btn btn-dash">{import.meta.env.VITE_DISLIKE_EMOJI}{
            likes.filter(like => !like.value).length + [userLikeValue].filter(like => like != null).filter(like => !like).length
          }</button>
        </div>
        <p className="p-2 text-secondary-content">comments: {commentsCount}</p>
      </div>
    </div>
  )
}

function Clickable({ clickable, children, onClick }: { clickable?: boolean, children: ReactNode, onClick?: () => void }) {
  return (
    <>
      {clickable != false ?
        <div onClick={onClick} className="cursor-pointer">
          {children}
        </div>
        :
        <div>
          {children}
        </div>
      }
    </>
  )
}