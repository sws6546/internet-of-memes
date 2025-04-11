import Elysia, { t } from "elysia";
import { isUserMiddelware } from "../auth/auth.router";
import * as jose from 'jose'
import { prisma } from "../prisma";

export const Comment = new Elysia({ prefix: "/comment" })
  .get("/getAll/:postId",
    async ({ params: { postId } }: { params: { postId: string } }) => {
      const comments = await prisma.comment.findMany({
        where: { postId: postId },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          textContent: true,
          createdAt: true,
          postId: true,
          author: {
            select: {
              name: true
            }
          },
        }
      })
      return comments.map(comment => ({
        ...comment, author: comment.author.name,
      }))
    },
    {
      params: t.Object({
        postId: t.String()
      })
    }
  )
  .get("/count/:postId",
    async ({ params: { postId } }: { params: { postId: string } }) => {
      return await prisma.comment.count({ where: { postId: postId } })
    }, {
    params: t.Object({
      postId: t.String()
    })
  })
  .post("/create",
    async ({ headers, body }: { headers: any, body: { postId: string, textContent: string } }) => {
      const { userId }: { userId: string } = await jose.decodeJwt(headers.authorization.split(" ")[1])
      if (!await prisma.user.findFirst({ where: { id: userId } })) return { err: "There's no user in db :(" }
      if (!await isEnoughTimeFromLastComment(userId)) return { err: "You need to wait a bit before commenting again" }
      if (!await prisma.post.findFirst({ where: { id: body.postId } })) return { err: "There's no post with that id :(" }
      if (await prisma.comment.findFirst({ where: { postId: body.postId, authorId: userId, textContent: body.textContent } }))
        return { err: "The same comment already exists" }
      return await prisma.comment.create({
        data: {
          authorId: userId,
          postId: body.postId,
          textContent: body.textContent
        }
      })
    },
    {
      beforeHandle: isUserMiddelware,
      body: t.Object({
        postId: t.String(),
        textContent: t.String()
      })
    }
  )
  .delete("/delete/:commentId",
    async ({ headers, params }: { headers: any, params: { commentId: string } }) => {
      const { userId }: { userId: string } = await jose.decodeJwt(headers.authorization.split(" ")[1])
      if (!await prisma.user.findFirst({ where: { id: userId } })) return { err: "There's no user in db :(" }
      const comment = await prisma.comment.findFirst({ where: { id: params.commentId, authorId: userId } })
      if (!comment) return { err: "There's no comment with that id or you are not the author" }
      return await prisma.comment.delete({ where: { id: params.commentId } })
    },
    {
      beforeHandle: isUserMiddelware,
      params: t.Object({
        commentId: t.String()
      })
    }
  )
  .patch("/update/:commentId",
    async ({ headers, params, body }: { headers: any, params: { commentId: string }, body: { textContent: string } }) => {
      const { userId }: { userId: string } = await jose.decodeJwt(headers.authorization.split(" ")[1])
      if (!await prisma.user.findFirst({ where: { id: userId } })) return { err: "There's no user in db :(" }
      const comment = await prisma.comment.findFirst({ where: { id: params.commentId, authorId: userId } })
      if (!comment) return { err: "There's no comment with that id or you are not the author" }
      return await prisma.comment.update({
        where: { id: params.commentId },
        data: {
          textContent: body.textContent
        }
      })
    },
    {
      beforeHandle: isUserMiddelware,
      params: t.Object({
        commentId: t.String()
      }),
      body: t.Object({
        textContent: t.String()
      })
    }
  )


async function isEnoughTimeFromLastComment(userId: string) {
  const lastUserComment = await prisma.comment.findFirst({ orderBy: { createdAt: "desc" }, where: { authorId: userId } })
  if (!lastUserComment) return true
  return (Date.now() / 1000) - (lastUserComment.createdAt.getTime() / 1000) > Number(Bun.env.COMMENT_GAP)
}