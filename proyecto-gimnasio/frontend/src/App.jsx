import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Login from "./pages/Login"
import AdminDashboard from "./pages/AdminDashboard"
import Home from "./pages/Home"
import ActivityDetail from "./pages/ActivityDetail"
import MyActivities from "./pages/MyActivities"
import Navbar from "./components/Navbar"
import CategoriesManagement from "./pages/CategoriesManagement"

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
  const token = localStorage.getItem("token")

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <main style={{ minHeight: "calc(100vh - 64px)", padding: "24px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={token ? <AdminDashboard /> : <Navigate to="/login" />} />
            <Route path="/admin/categories" element={token ? <CategoriesManagement /> : <Navigate to="/login" />} />
            <Route path="/activities/:id" element={<ActivityDetail />} />
            <Route path="/mis-actividades" element={<MyActivities />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </main>
        <ToastContainer position="bottom-right" />
      </Router>
    </ThemeProvider>
  )
}

export default App
