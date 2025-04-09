import { useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { CommentType, Post } from "../types"
import PostCard from "../components/Post"
import { useEffect, useState } from "react"
import Comment from "../components/Comment"

export default function PostPage() {
  const { postId } = useParams()
  const [comments, setComments] = useState<CommentType[]>([])
  const { isError, error, isLoading, data } = useQuery({
    queryKey: ["post", postId], queryFn: async () => {
      const post: Post = (await axios.get(`${import.meta.env.VITE_BACKEND_MAINURL}/posts/getOne/${postId}`)).data
      return post
    }
  })

  const getComments = async () => {
    const resComments: CommentType[] = (await axios(`${import.meta.env.VITE_BACKEND_MAINURL}/comment/getAll/${postId}`)).data
    setComments(resComments)
  }
  useEffect(() => { getComments() }, [])

  return (
    <main className="flex flex-col items-center gap-4">
      {isError && <p className="text-red-500">{error.message}</p>}
      {
        isLoading ? <p>Loading...</p>
          : <PostCard post={data!} clickable={false} />
      }
      <div className="w-full md:w-2/5">
        {comments.map((comment, idx) => (
          <Comment comment={comment} key={idx} />
        ))}
      </div>
    </main>
  )
}
