add `.env.local` file, and put into it:
```
JWT_SECRET="<secret>"
POST_GAP=<gap between user can make another post (in seconds)>
COMMENT_GAP=<gap between user can make another comment (in seconds)>
GOOGLE_RECAPTCHA_SECRET_KEY="<recaptcha secret key>"
```
---
in terminal type :
* `bun i`
* `bunx prisma db push`
* `bunx prisma db seed`
* `bun dev`