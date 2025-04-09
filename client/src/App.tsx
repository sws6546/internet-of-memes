import { BrowserRouter, Routes, Route } from "react-router"
import Home from "./pages/Home"
import Drawer from "./components/Drawer"
import Navbar from "./components/Navbar"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Category from "./pages/Category"
import AuthPage from "./pages/AuthPage"
import { useAuth } from "./hooks/useAuth"
import { useAuthType } from "./types"
import { AuthContext } from "./Contexts/AuthContext"
import PostPage from "./pages/PostPage"

function App() {
  const queryClient = new QueryClient()
  const { login, logout, isUserLogged, user, token, loading, err, isErr }: useAuthType = useAuth()
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ login, logout, isUserLogged, user, token, loading, err, isErr }}>
        <BrowserRouter>
          <Drawer>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/category/:pathName/:categoryId" element={<Category />} />
              <Route path="/post/:postId" element={<PostPage />} />
            </Routes>
          </Drawer>
        </BrowserRouter>
      </AuthContext.Provider>
    </QueryClientProvider>
  )
}

export default App
