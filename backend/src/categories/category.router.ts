import Elysia from "elysia";
import { prisma } from "../prisma";

export const Category = new Elysia({prefix: "/category"})
  .get('/getAll', async () => await prisma.category.findMany())