import { Elysia, t } from "elysia";
import { prisma } from "../prisma";
import * as jose from 'jose'

type RegisterBody = {
  name: string;
  email: string;
  password: string;
  g_captcha: string;
}

type LoginBody = {
  name: string;
  password: string;
  g_captcha: string;
}

export const Auth = new Elysia({ prefix: "/auth" })
  .post("/register",
    async ({ body }: { body: RegisterBody }) => {
      if (await verifyReCaptcha(body.g_captcha) == false) return { err: "Captcha failed" }
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
    }, {
    body: t.Object({
      name: t.String(),
      email: t.String(),
      password: t.String(),
      g_captcha: t.String()
    })
  })

  .post("/login",
    async ({ body }: { body: LoginBody }) => {
      if (!await verifyReCaptcha(body.g_captcha)) return { err: "Captcha failed" }
      const user = await prisma.user.findFirst({ where: { name: body.name } })
      if (!user) return "There's no user with that name"
      if (!await Bun.password.verify(body.password, user.password)) {
        return "bad pwd :("
      }
      return { msg: "logged", token: await createToken({ userId: user.id, username: user.name, email: user.email }) }
    }, {
    body: t.Object({
      name: t.String(),
      password: t.String(),
      g_captcha: t.String()
    })
  }
  )


export async function createToken(payload: any) {
  return await new jose.SignJWT(payload)
    .setExpirationTime("4h")
    .setProtectedHeader({ alg: 'HS256' })
    .sign(new TextEncoder().encode(Bun.env.JWT_SECRET))
}

export async function verifyReCaptcha(g_captcha: string) {
  try {
    const params = new URLSearchParams({
      secret: Bun.env.GOOGLE_RECAPTCHA_SECRET_KEY || '',
      response: g_captcha
    });

    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    return false;
  }
}

export async function verifyToken(token: string) {
  return await jose.jwtVerify(token, new TextEncoder().encode(Bun.env.JWT_SECRET))
}

export async function isUserMiddelware({ headers }: { headers: any }) {
  if (headers.authorization == null) return "gimme token wtf"
  await verifyToken(headers.authorization.split(" ")[1])
}
