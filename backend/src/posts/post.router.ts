import Elysia, { form, t } from "elysia";
import { prisma } from "../prisma";
import { isUserMiddelware } from "../auth/auth.router";
import * as jose from 'jose'
import { randomUUIDv7 } from "bun";

export const Post = new Elysia({ prefix: "/posts" })
  .get("/getAll", async () => await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      textContent: true,
      filePath: true,
      createdAt: true,
      author: { select: { name: true } },
      category: true
    }
  }))
  .get("/fromCategory/:categoryId/:from/:amount",
    async ({ params: { categoryId, from, amount } }) => {
      return await prisma.post.findMany({
        where: { categoryId: categoryId },
        orderBy: { createdAt: 'desc' },
        skip: from - 1,
        take: amount,
        select: {
          id: true,
          title: true,
          textContent: true,
          filePath: true,
          createdAt: true,
          author: { select: { name: true } },
          category: true,
          likes: true
        }
      })
    },
    {
      params: t.Object({
        categoryId: t.String(),
        from: t.Number(),
        amount: t.Number()
      })
    }
  )
  .get("/:from/:amount",
    async ({ params: { from, amount } }) => {
      return await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        skip: from - 1,
        take: amount,
        select: {
          title: true,
          textContent: true,
          filePath: true,
          createdAt: true,
          author: { select: { name: true } },
          category: true
        }
      })
    },
    {
      params: t.Object({
        from: t.Number(),
        amount: t.Number()
      })
    }
  )
  .post('/create',
    async ({ headers, body }: { headers: any, body: { title: string, textContent?: string, file: File, categoryId: string } }) => {
      const { userId }: { userId: string } = await jose.decodeJwt(headers.authorization.split(" ")[1])
      if (!await prisma.user.findFirst({ where: { id: userId } })) return "There's no user in db :("
      if (!await isEnoughTimeFromLastPost(userId)) return `Wait. Your last post was created less than ${Bun.env.POST_GAP}`
      if (!await prisma.category.findFirst({ where: { id: body.categoryId } })) return "This category does not exist"
      const filename: string = randomUUIDv7()
      await Bun.write(`./public/${filename}.jpg`, await body.file.arrayBuffer())
      return await prisma.post.create({
        data: {
          title: body.title,
          authorId: userId,
          textContent: body.textContent,
          filePath: `./public/${filename}.jpg`,
          categoryId: body.categoryId
        }
      })
    },
    {
      beforeHandle: isUserMiddelware,
      body: t.Object({
        title: t.String(),
        textContent: t.MaybeEmpty(t.String()),
        file: t.File({ type: ["image/*"] }),
        categoryId: t.String()
      })
    }
  )
  .delete('/delete',
    async ({ headers, body: { postId } }: { headers: any, body: { postId: string } }) => {
      const { userId }: { userId: string } = await jose.decodeJwt(headers.authorization.split(" ")[1])
      const post = await prisma.post.findFirst({ where: { id: postId } })
      if (!post) return "This post does not exist"
      if (post.authorId != userId) return "You aren't creator of this post"
      if (post.filePath) await Bun.file(post.filePath).delete()
      return await prisma.post.delete({
        where: {
          id: postId,
          authorId: userId
        }
      })
    },
    { 
      beforeHandle: isUserMiddelware,
      body: t.Object({
        postId: t.String()
      })
    }
  )
  .post('/addLike',
    async ({ headers, body: { postId, likeValue } }: { headers: any, body: { postId: string, likeValue: boolean } }) => {
      const { userId }: { userId: string } = await jose.decodeJwt(headers.authorization.split(" ")[1])
      if (!await prisma.user.findFirst({ where: { id: userId } })) return "there's no user with that token :("
      if (!await prisma.post.findFirst({ where: { id: postId } })) return "there's no post with that id :("
      const existingLike = await prisma.like.findFirst({ where: { postId: postId, userId: userId } })
      if (!existingLike) {
        return await prisma.like.create({
          data: {
            userId: userId,
            postId: postId,
            value: likeValue
          }
        })
      }
      else {
        return await prisma.like.update({where: {
          id: existingLike.id
        },
        data: {
          value: likeValue
        }
      })
      }
    },
    {
      beforeHandle: isUserMiddelware,
      body: t.Object({
        postId: t.String(),
        likeValue: t.Boolean()
      })
    }
  )
  .delete('/removeLike',
    async ({ headers, body: { postId } }: { headers: any, body: { postId: string } }) => {
      const { userId }: { userId: string } = await jose.decodeJwt(headers.authorization.split(" ")[1])
      if (!await prisma.user.findFirst({ where: { id: userId } })) return "there's no user with that token :("
      if (!await prisma.post.findFirst({ where: { id: postId } })) return "there's no post with that id :("
      const deletedLikes = await prisma.like.deleteMany({ where: { userId: userId, postId: postId } })
      return { deleted_likes: deletedLikes.count }
    },
    {
      beforeHandle: isUserMiddelware,
      body: t.Object({
        postId: t.String()
      })
    }
  )

async function isEnoughTimeFromLastPost(userId: string) {
  const lastUserPost = await prisma.post.findFirst({ orderBy: { createdAt: "desc" }, where: { authorId: userId } })
  if (!lastUserPost) return true
  return (Date.now() / 1000) - (lastUserPost.createdAt.getTime() / 1000) > Number(Bun.env.POST_GAP)
}
