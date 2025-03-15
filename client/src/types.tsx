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

export type User = {
  id: string;
  name: string;
  email: string;
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

export type registerFormData = {
  username: string;
  email: string;
  password: string;
}

export type loginFormData = {
  username: string;
  password: string;
}

export type useAuthType = {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isUserLogged: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  err: string | null;
  isErr: boolean;
}