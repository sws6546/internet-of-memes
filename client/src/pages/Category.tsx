import { useParams } from "react-router"
import type { Post } from "../types"
import { useEffect, useState } from "react"
import axios from "axios"

export default function Category() {
  const { categoryId } = useParams()
  const [ posts, setPosts ] = useState<Post[]>([])

  const fetchNextPosts = async () => {
    const url = `${import.meta.env.VITE_BACKEND_MAINURL}/posts/fromCategory/${categoryId}/${posts.length+1}/${10}`
    const tempPosts = await (await axios.get(url)).data
    setPosts((existingArrayOfPosts: Post[]) => [...existingArrayOfPosts, ...tempPosts])
  }

  useEffect(() => {
    fetchNextPosts()
  }, [])


  return (
    <main>
    </main>
  )
}
