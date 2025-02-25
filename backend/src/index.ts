import { Elysia } from "elysia";
import { User } from "./users/user.router";
import { Auth } from "./auth/auth.router";
import { swagger } from "@elysiajs/swagger";
import { Post } from "./posts/post.router";
import staticPlugin from "@elysiajs/static";
import cors from "@elysiajs/cors";
import { Category } from "./categories/category.router";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .use(cors({ origin: true })) // now it`s set to *
  .use(swagger())
  .use(staticPlugin())
  .use(User)
  .use(Auth)
  .use(Category)
  .use(Post)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
