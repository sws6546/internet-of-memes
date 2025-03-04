import { BrowserRouter, Routes, Route } from "react-router"
import Home from "./pages/Home"
import Drawer from "./components/Drawer"
import Navbar from "./components/Navbar"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Category from "./pages/Category"

function App() {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Drawer>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:pathName/:categoryId" element={<Category />} />
          </Routes>
        </Drawer>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
