import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  CircularProgress,
} from "@mui/material"
import { Login as LoginIcon, Person, Lock } from "@mui/icons-material"
import { toast } from "react-toastify"
import { useAuthStore } from "../services/auth-store"
import API from "../services/api"

export default function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await API.post("/login", { username, password })
      
      if (login(res.data.token)) {
        toast.success("¡Bienvenido! Has iniciado sesión correctamente")
        
        // Get user role from store after login
        const { user } = useAuthStore.getState()
        
        // Redirect based on role
        if (user?.role === "admin") {
          navigate("/admin")
        } else {
          navigate("/")
        }
      } else {
        toast.error("Token inválido")
      }
    } catch (err) {
      toast.error("Usuario o contraseña incorrectos")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "calc(100vh - 200px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card sx={{ width: "100%", maxWidth: 400 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Avatar sx={{ mx: "auto", mb: 2, bgcolor: "primary.main", width: 56, height: 56 }}>
                <LoginIcon />
              </Avatar>
              <Typography variant="h4" component="h1" gutterBottom>
                Iniciar Sesión
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Ingresa tus credenciales para acceder al sistema
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleLogin} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                label="Usuario"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                fullWidth
                InputProps={{
                  startAdornment: <Person sx={{ mr: 1, color: "text.secondary" }} />,
                }}
              />

              <TextField
                label="Contraseña"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                InputProps={{
                  startAdornment: <Lock sx={{ mr: 1, color: "text.secondary" }} />,
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : <LoginIcon />}
                fullWidth
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}
