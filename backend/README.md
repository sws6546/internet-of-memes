add `.env.local` file, and put into it:
```
JWT_SECRET="<secret>"
POST_GAP=<gap between user can  make another post (in seconds)>
```
---
in terminal type :
* `bun i`
* `bunx prisma db push`
* `bunx prisma db seed`
* `bun dev`