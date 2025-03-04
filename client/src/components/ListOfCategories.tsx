import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router";
import type { Category } from "../types";

export default function ListOfCategories() {
  const { isError, isPending, data, error } = useQuery({
    queryKey: ['listOfCategories'], queryFn: async () => {
      const url = `${import.meta.env.VITE_BACKEND_MAINURL}/category/getAll`
      const categories: Category[] = await (await axios.get(url)).data
      return categories
    }
  })

  const navigate = useNavigate()

  if (isError) {
    return <p>error: {error.message}</p>
  }
  if (isPending) {
    return <p>Loading</p>
  }
  return (
    <>
      {data.map((category, index) => (
        <li key={index}>
          <button
            onClick={() => navigate(`/category/${category.pathName}/${category.id}`)}
            className="btn btn-dash">
            {category.name}
          </button>
        </li>
      ))}
    </>
  )
}
