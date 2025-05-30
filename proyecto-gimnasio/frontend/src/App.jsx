import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAuthStore } from "./services/auth-store"
import Login from "./pages/Login.jsx"
import AdminDashboard from "./pages/AdminDashboard.jsx"
import Home from "./pages/Home.jsx"
import ActivityDetail from "./pages/ActivityDetail.jsx"
import MyActivities from "./pages/MyActivities.jsx"
import Navbar from "./components/Navbar.jsx"
import CategoriesManagement from "./pages/CategoriesManagement.jsx"
import Register from "./pages/Register.jsx"

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
})

function App() {
  const { isAuthenticated, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <main style={{ minHeight: "calc(100vh - 64px)", padding: "24px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />} />
            <Route path="/admin/categories" element={isAuthenticated ? <CategoriesManagement /> : <Navigate to="/login" />} />
            <Route path="/activities/:id" element={<ActivityDetail />} />
            <Route path="/mis-actividades" element={<MyActivities />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </main>
        <ToastContainer position="bottom-right" />
      </Router>
    </ThemeProvider>
  )
}

export default App
