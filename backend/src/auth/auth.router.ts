import { Elysia } from "elysia";
import { prisma } from "../prisma";
import * as jose from 'jose'

type RegisterBody = {
  name: string;
  email: string;
  password: string;
}

type LoginBody = {
  name: string;
  password: string;
}

export const Auth = new Elysia({prefix: "/auth"})
  .post("/register",
    async ({ body }: { body: RegisterBody }) => {
      const existedUserName = await prisma.user.findFirst({ where: { name: body.name } })
      const existedUserEmail = await prisma.user.findFirst({ where: { email: body.email } })
      if (existedUserName) return "User with that name exist"
      if (existedUserEmail) return "User with that email exist"
      const createdUser = await prisma.user.create({
        data: {
          name: body.name,
          email: body.email,
          password: await Bun.password.hash(body.password)
        }
      })
      return { ...createdUser, password: "SECRET :D" }
    }
  )

  .post("/login",
    async ({ body }: { body: LoginBody }) => {
      const user = await prisma.user.findFirst({ where: { name: body.name } })
      if (!user) return "There's no user with that name"
      if (!await Bun.password.verify(body.password, user.password)) {
        return "bad pwd :("
      }
      return { msg: "logged", token: await createToken({ userId: user.id, username: user.name, email: user.email }) }
    }
  )


export async function createToken(payload: any) {
  return await new jose.SignJWT(payload)
    .setExpirationTime("4h")
    .setProtectedHeader({ alg: 'HS256' })
    .sign(new TextEncoder().encode(Bun.env.JWT_SECRET))
}

export async function verifyToken(token: string) {
  return await jose.jwtVerify(token, new TextEncoder().encode(Bun.env.JWT_SECRET))
}

export async function isUserMiddelware({ headers }: { headers: any }) {
  if (headers.authorization == null) return "gimme token wtf"
  await verifyToken(headers.authorization.split(" ")[1])
}
