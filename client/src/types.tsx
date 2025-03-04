export type Post = {
  id: string;
  title: string;
  textContent: string;
  filePath: string;
  createdAt: Date;
  author: Author;
  category: Category;
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