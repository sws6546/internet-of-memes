import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router";

type Category = {
  id: string;
  name: string;
  pathName: string;
}

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
      <li onClick={() => navigate(`/category/${category.pathName}/${category.id}`)} key={index}>
        <p>{category.name}</p>
      </li>  
    ))}
    </>
  )
}
