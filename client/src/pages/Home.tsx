import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router"
import { Category } from "../types";

export default function Home() {
  const navigate = useNavigate();
  const { isError, isPending, data, error } = useQuery({
    queryKey: ['listOfCategories'], queryFn: async () => {
      const url = `${import.meta.env.VITE_BACKEND_MAINURL}/category/getAll`
      const categories: Category[] = await (await axios.get(url)).data
      return categories
    }
  })

  useEffect(() => {
    if (!isPending && !isError) {
      navigate(`category/${data[0].pathName}/${data[0].id}`)
    }
  }, [data])
  return (
    <p className="text-red-500">{error?.message}</p>
  )
}
