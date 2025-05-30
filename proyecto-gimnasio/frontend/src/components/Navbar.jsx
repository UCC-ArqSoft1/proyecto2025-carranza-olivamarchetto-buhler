"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from "@mui/material"
import { Home, Person, Settings, Logout, FitnessCenter, MoreVert, Category } from "@mui/icons-material"

export default function Navbar() {
  const token = localStorage.getItem("token")
  const navigate = useNavigate()
  const location = useLocation()
  const [anchorEl, setAnchorEl] = useState(null)

  let role = null
  if (token) {
    try {
      const decoded = jwtDecode(token)
      role = decoded.role
    } catch {
      role = null
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user_id")
    navigate("/")
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

          {token && role === "socio" && (
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

          {token && role === "admin" && (
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

          {token ? (
            <Button color="inherit" onClick={handleLogout} startIcon={<Logout />}>
              Cerrar sesión
            </Button>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Iniciar sesión
            </Button>
          )}
        </Box>

        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
            <MoreVert />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem component={Link} to="/" onClick={handleMenuClose}>
              <Home sx={{ mr: 1 }} /> Inicio
            </MenuItem>
            {token && role === "socio" && (
              <MenuItem component={Link} to="/mis-actividades" onClick={handleMenuClose}>
                <Person sx={{ mr: 1 }} /> Mis actividades
              </MenuItem>
            )}
            {token && role === "admin" && (
              <>
                <MenuItem component={Link} to="/admin" onClick={handleMenuClose}>
                  <Settings sx={{ mr: 1 }} /> Actividades
                </MenuItem>
                <MenuItem component={Link} to="/admin/categories" onClick={handleMenuClose}>
                  <Category sx={{ mr: 1 }} /> Categorías
                </MenuItem>
              </>
            )}
            {token ? (
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} /> Cerrar sesión
              </MenuItem>
            ) : (
              <MenuItem component={Link} to="/login" onClick={handleMenuClose}>
                Iniciar sesión
              </MenuItem>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
