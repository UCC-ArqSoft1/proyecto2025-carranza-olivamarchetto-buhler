"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
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
import { PersonAdd, Person, Lock, Email } from "@mui/icons-material"
import { toast } from "react-toastify"
import API from "../services/api"
import { useAuthStore } from "../services/auth-store"

export default function Register() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectTo = user.role === "admin" ? "/admin" : "/"
      navigate(redirectTo, { replace: true })
    }
  }, [isAuthenticated, user, navigate])

  const handleChange = (field) => (e) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    })
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es requerido"
    } else if (formData.username.length < 3) {
      newErrors.username = "El nombre de usuario debe tener al menos 3 caracteres"
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El formato del email no es válido"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Prepare data according to API specification
      const registerData = {
        username: formData.username.trim(),
        password: formData.password,
        email: formData.email.trim(),
        role: "socio"
      }

      const response = await API.post("/register", registerData)

      toast.success("¡Registro exitoso! Ya puedes iniciar sesión")

      // Redirect to login page
      navigate("/login", {
        replace: true,
        state: {
          message: "Registro completado. Inicia sesión con tus credenciales.",
          username: formData.username,
        },
      })
    } catch (err) {
      console.error("Registration error:", err)

      if (err.response?.status === 400) {
        toast.error("Datos inválidos. Verifica la información ingresada")
      } else if (err.response?.status === 409) {
        toast.error("El usuario o email ya existe")
      } else {
        toast.error("Error al registrar usuario. Inténtalo nuevamente")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Don't render register form if already authenticated
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
          py: 4,
        }}
      >
        <Card sx={{ width: "100%", maxWidth: 450 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Avatar sx={{ mx: "auto", mb: 2, bgcolor: "primary.main", width: 56, height: 56 }}>
                <PersonAdd />
              </Avatar>
              <Typography variant="h4" component="h1" gutterBottom>
                Crear Cuenta
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Completa el formulario para registrarte en el sistema
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleRegister} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                label="Nombre de usuario"
                placeholder="Ingresa tu nombre de usuario"
                value={formData.username}
                onChange={handleChange("username")}
                error={!!errors.username}
                helperText={errors.username}
                required
                fullWidth
                InputProps={{
                  startAdornment: <Person sx={{ mr: 1, color: "text.secondary" }} />,
                }}
              />

              <TextField
                label="Email"
                type="email"
                placeholder="Ingresa tu email"
                value={formData.email}
                onChange={handleChange("email")}
                error={!!errors.email}
                helperText={errors.email}
                required
                fullWidth
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: "text.secondary" }} />,
                }}
              />

              <TextField
                label="Contraseña"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={formData.password}
                onChange={handleChange("password")}
                error={!!errors.password}
                helperText={errors.password}
                required
                fullWidth
                InputProps={{
                  startAdornment: <Lock sx={{ mr: 1, color: "text.secondary" }} />,
                }}
              />

              <TextField
                label="Confirmar contraseña"
                type="password"
                placeholder="Confirma tu contraseña"
                value={formData.confirmPassword}
                onChange={handleChange("confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                required
                fullWidth
                InputProps={{
                  startAdornment: <Lock sx={{ mr: 1, color: "text.secondary" }} />,
                }}
              />

              <Alert severity="info" sx={{ mt: 1 }}>
                Al registrarte, serás creado como usuario "socio" y podrás inscribirte en actividades.
              </Alert>

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : <PersonAdd />}
                fullWidth
              >
                {isLoading ? "Registrando..." : "Crear Cuenta"}
              </Button>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  ¿Ya tienes una cuenta?{" "}
                  <Button
                    component={Link}
                    to="/login"
                    variant="text"
                    sx={{ textTransform: "none", p: 0, minWidth: "auto" }}
                  >
                    Inicia sesión aquí
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
