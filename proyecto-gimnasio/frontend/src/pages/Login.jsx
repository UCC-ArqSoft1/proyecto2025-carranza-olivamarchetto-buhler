"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
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
  Alert,
  Divider,
} from "@mui/material"
import { Login as LoginIcon, Person, Lock } from "@mui/icons-material"
import { toast } from "react-toastify"
import API from "../services/api"
import { useAuthStore } from "../services/auth-store"

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated, user } = useAuthStore()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Get message and username from register redirect
  const registerMessage = location.state?.message
  const suggestedUsername = location.state?.username

  useEffect(() => {
    if (suggestedUsername) {
      setUsername(suggestedUsername)
    }
  }, [suggestedUsername])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const from = location.state?.from?.pathname || (user.role === "admin" ? "/admin" : "/")
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, user, navigate, location])

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await API.post("/login", { username, password })
      const success = login(res.data.token)

      if (success) {
        toast.success("¡Bienvenido! Has iniciado sesión correctamente")

        // Get user role from store after login
        const { user: loggedUser } = useAuthStore.getState()
        const from = location.state?.from?.pathname || (loggedUser?.role === "admin" ? "/admin" : "/")
        navigate(from, { replace: true })
      } else {
        toast.error("Token inválido o expirado")
      }
    } catch (err) {
      toast.error("Usuario o contraseña incorrectos")
    } finally {
      setIsLoading(false)
    }
  }

  // Don't render login form if already authenticated
  if (isAuthenticated) {
    return null
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

            {registerMessage && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {registerMessage}
              </Alert>
            )}

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

              <Divider sx={{ my: 2 }} />

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  ¿No tienes una cuenta?{" "}
                  <Button
                    component={Link}
                    to="/register"
                    variant="text"
                    sx={{ textTransform: "none", p: 0, minWidth: "auto" }}
                  >
                    Regístrate aquí
                  </Button>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}
