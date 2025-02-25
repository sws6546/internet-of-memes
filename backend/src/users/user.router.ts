import { Elysia } from "elysia";
import { prisma } from "../prisma";
import { isUserMiddelware } from "../auth/auth.router";
import * as jose from 'jose'

type ChangePwdBody = {
  oldPassword: string;
  newPassword: string;
}

export const User = new Elysia({ prefix: "users" })
  .get("/getall",
    async () => {
      const users = await prisma.user.findMany({
        select: {
          name: true,
          createdAt: true,
          posts: {
            select: {
              title: true,
              textContent: true,
              createdAt: true,
              filePath: true,
            }
          }
        }
      })
      return users
    },
    { beforeHandle: isUserMiddelware }
  )
  .post("/change_password",
    async ({ headers, body }: { headers: any, body: ChangePwdBody }) => {
      const { userId }: { userId: string } = await jose.decodeJwt(headers.authorization.split(" ")[1])
      const userInDb = await prisma.user.findFirst({ where: { id: userId } })
      if (!userInDb) return "There's no that user in db :("
      if (!await Bun.password.verify(body.oldPassword, userInDb.password)) return "Bad old pwd"
      return await prisma.user.update({ where: { id: userId }, data: { password: await Bun.password.hash(body.newPassword) } })
    },
    { beforeHandle: isUserMiddelware }
  )