export type Post = {
  id: string;
  title: string;
  textContent: string;
  filePath: string;
  createdAt: Date;
  author: Author;
  category: Category;
  likes: Like[];
}

export type Like = {
  id: string;
  value: boolean;
  userId: string;
  postId: string;
}

export type Author = {
  name: string
}

export type Category = {
  id: string;
  name: string;
  pathName: string;
  createdAt: Date;
}