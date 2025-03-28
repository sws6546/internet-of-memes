import { useState } from "react"
import { useNavigate, useParams } from "react-router"
import { useAuth } from "../hooks/useAuth"

export default function AddPostForm() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [err, setErr] = useState<string>('')
  const [isSending, setIsSending] = useState<boolean>(false)
  const { categoryId } = useParams();
  const { token } = useAuth()
  const navigate = useNavigate();

  const handleFormClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const submitPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true)

    // Get form elements
    const titleInput = e.currentTarget.querySelector('input[type="text"]') as HTMLInputElement;
    const descriptionTextarea = e.currentTarget.querySelector('textarea') as HTMLTextAreaElement;
    const imageInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;

    // Create FormData object
    const formData = new FormData();
    formData.append("title", titleInput.value);
    formData.append("textContent", descriptionTextarea.value);
    formData.append("categoryId", categoryId!);

    // Add image if selected
    if (imageInput.files && imageInput.files.length > 0) {
      formData.append("file", imageInput.files[0]);
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_MAINURL}/posts/create`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.err) {
          setErr(responseData.err)
        }
        else {
          setErr("")
          // refreshes the current route without full page reload
          navigate(0);
        }
      } else {
        console.error("Failed to submit post: ");
      }
      setIsSending(false)
    } catch (error) {
      console.error("Error submitting post:", error);
      setIsSending(false)
    }
  }

  return (
    <>
      <div className={`${!isModalOpen && "hidden"}
      flex justify-center items-center
      fixed top-0 left-0 w-full h-[100vh] z-10 bg-slate-800/60`} onClick={() => setIsModalOpen(false)}>
        <form className="fieldset bg-base-100 p-6 rounded-md shadow-xl w-4/5 md:w-2/5"
          onSubmit={submitPost}
          onClick={handleFormClick}>
          <legend className="fieldset-legend">Add post</legend>
          <input
            type="text" className="input w-full" placeholder="title" />
          <textarea
            className="textarea w-full" cols={3} placeholder="description *optional"></textarea>
          <label htmlFor="imageInput">Select image:</label>
          <input
            id="imageInput" type="file" className="file-input w-full" accept="image/png, image/jpeg" />
          <button type="submit" className="btn btn-soft btn-primary" disabled={isSending}
          >Send</button>
          <p className="text-red-500">{err}</p>
        </form>
      </div>
      <button onClick={() => setIsModalOpen(true)}
        className="btn btn-primary fixed bottom-8 right-8 btn-xl">+</button>
    </>
  )
}
