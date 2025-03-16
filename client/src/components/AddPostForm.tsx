import { useState } from "react"

export default function AddPostForm() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  return (
    <>
      <div className={`${!isModalOpen && "hidden"}
      flex justify-center items-center
      fixed top-0 left-0 w-full h-[100vh] z-10 bg-slate-800/60`} onClick={() => setIsModalOpen(false)}>
        <fieldset className="fieldset bg-base-100 p-6 rounded-md shadow-xl w-4/5 md:w-2/5">
          <legend className="fieldset-legend">Add post</legend>
          <input type="text" className="input w-full" placeholder="title" />
          <textarea className="textarea w-full" cols={3} placeholder="description"></textarea>
          <label htmlFor="imageInput">Select image:</label>
          <input id="imageInput" type="file" className="file-input w-full" accept="image/png, image/jpeg"/>
          <button onClick={() => {/* TODO */}}> Send</button>
        </fieldset>
      </div>
      <button onClick={() => setIsModalOpen(true)} className="btn btn-primary fixed bottom-8 right-8 btn-xl">+</button>
    </>
  )
}
