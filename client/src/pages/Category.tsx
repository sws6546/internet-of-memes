import { useParams } from "react-router"
import type { Post } from "../types"
import { useEffect, useState } from "react"
import axios from "axios"
import PostCard from "../components/Post"
import InfiniteScroll from "react-infinite-scroll-component"
import AddPostForm from "../components/AddPostForm"
import { useAuth } from "../hooks/useAuth"

export default function Category() {
  const { categoryId } = useParams()
  const [posts, setPosts] = useState<Post[]>([])
  const [hasMore, setHasMore] = useState<boolean>(true)
  const { isUserLogged } = useAuth()

  const fetchFirstPosts = async () => {
    const url = `${import.meta.env.VITE_BACKEND_MAINURL}/posts/fromCategory/${categoryId}/${posts.length + 1}/${10}`
    const tempPosts = await (await axios.get(url)).data
    setPosts([...tempPosts])
    if (tempPosts.length < 10) setHasMore(false)
  }

  const fetchNextPosts = async () => {
    const url = `${import.meta.env.VITE_BACKEND_MAINURL}/posts/fromCategory/${categoryId}/${posts.length + 1}/${10}`
    const tempPosts = await (await axios.get(url)).data
    setPosts((existingArrayOfPosts: Post[]) => [...existingArrayOfPosts, ...tempPosts])
    if (tempPosts.length < 10) setHasMore(false)
  }

  useEffect(() => {
    fetchFirstPosts()
  }, [])

  return (
    <>
      {isUserLogged && <AddPostForm /> }
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchNextPosts}
        hasMore={hasMore}
        loader={<p>Loading...</p>}
        endMessage={<p>There's no more posts :P</p>}
      >
        <main className="flex flex-col items-center">
          {posts.map((post, index) => (
            <PostCard post={post} key={index} />
          ))}
        </main>
      </InfiniteScroll>
    </>
  )
}
