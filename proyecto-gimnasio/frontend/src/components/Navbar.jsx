"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from "@mui/material"
import {
  Home,
  Person,
  Settings,
  Logout,
  FitnessCenter,
  MoreVert,
  Category,
  Login,
  PersonAdd,
} from "@mui/icons-material"
import { toast } from "react-toastify"
import { useAuthStore } from "../services/auth-store"

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const location = useLocation()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleLogout = () => {
    logout()
    toast.success("Sesión cerrada correctamente")
    setAnchorEl(null)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <FitnessCenter sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          GymApp
        </Typography>

        {isAuthenticated ? (
          <>
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
              <Button
                color="inherit"
                component={Link}
                to="/"
                startIcon={<Home />}
                variant={location.pathname === "/" ? "outlined" : "text"}
              >
                Inicio
              </Button>

              {user?.role === "socio" && (
                <Button
                  color="inherit"
                  component={Link}
                  to="/mis-actividades"
                  startIcon={<Person />}
                  variant={location.pathname === "/mis-actividades" ? "outlined" : "text"}
                >
                  Mis actividades
                </Button>
              )}

              {user?.role === "admin" && (
                <>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/admin"
                    startIcon={<Settings />}
                    variant={location.pathname === "/admin" ? "outlined" : "text"}
                  >
                    Actividades
                  </Button>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/admin/categories"
                    startIcon={<Category />}
                    variant={location.pathname === "/admin/categories" ? "outlined" : "text"}
                  >
                    Categorías
                  </Button>
                </>
              )}

              <Button color="inherit" onClick={handleLogout} startIcon={<Logout />}>
                Cerrar sesión
              </Button>
            </Box>

            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
                <MoreVert />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem component={Link} to="/" onClick={handleMenuClose}>
                  <Home sx={{ mr: 1 }} /> Inicio
                </MenuItem>
                {user?.role === "socio" && (
                  <MenuItem component={Link} to="/mis-actividades" onClick={handleMenuClose}>
                    <Person sx={{ mr: 1 }} /> Mis actividades
                  </MenuItem>
                )}
                {user?.role === "admin" && (
                  <>
                    <MenuItem component={Link} to="/admin" onClick={handleMenuClose}>
                      <Settings sx={{ mr: 1 }} /> Actividades
                    </MenuItem>
                    <MenuItem component={Link} to="/admin/categories" onClick={handleMenuClose}>
                      <Category sx={{ mr: 1 }} /> Categorías
                    </MenuItem>
                  </>
                )}
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} /> Cerrar sesión
                </MenuItem>
              </Menu>
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                startIcon={<Login />}
                variant={location.pathname === "/login" ? "outlined" : "text"}
              >
                Iniciar sesión
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/register"
                startIcon={<PersonAdd />}
                variant={location.pathname === "/register" ? "outlined" : "text"}
              >
                Registrarse
              </Button>
            </Box>

            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
                <MoreVert />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem component={Link} to="/login" onClick={handleMenuClose}>
                  <Login sx={{ mr: 1 }} /> Iniciar sesión
                </MenuItem>
                <MenuItem component={Link} to="/register" onClick={handleMenuClose}>
                  <PersonAdd sx={{ mr: 1 }} /> Registrarse
                </MenuItem>
              </Menu>
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  )
}
