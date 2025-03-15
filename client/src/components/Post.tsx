import { useState } from "react"
import type { Like, Post } from "../types"
import axios from "axios"

export default function PostCard({ post }: { post: Post }) {
  const [likes, setLikes] = useState<Like[]>(post.likes)

  const sendLike = async (likeValue: boolean) => {
    const appUrl = import.meta.env.VITE_BACKEND_MAINURL
    const { data } = await axios.post(`${appUrl}/posts/addLike/`, {
      postId: post.id,
      likeValue: likeValue
    })
    console.log(data)
  }

  return (
    <div className="border m-4 w-full md:w-2/5">
      <div className="p-4 flex flex-col gap-2">
        <p className="text-xl">{post.title}</p>
        <div className="flex flex-row items-center justify-between">
          <p>{post.author.name}</p>
          <p className="text-sm">{new Date(post.createdAt).toLocaleDateString("pl-PL", { hour: "numeric", minute: "2-digit" })}</p>
        </div>
        <p>{post.textContent}</p>
      </div>
      <img src={`${import.meta.env.VITE_BACKEND_MAINURL}/${post.filePath}`} alt={post.filePath} />
      <button onClick={() => { sendLike(true) }} className="btn btn-dash">{import.meta.env.VITE_LIKE_EMOJI}{
        likes.filter(like => like.value).length
      }end it</button>
      <button className="btn btn-dash">{import.meta.env.VITE_DISLIKE_EMOJI}{
        likes.filter(like => !like.value).length
      }</button>
    </div>
  )
}
