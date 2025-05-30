"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Box,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material"
import { CalendarToday, Schedule, People, FitnessCenter, Warning } from "@mui/icons-material"
import API from "../services/api"

export default function MyActivities() {
  const [activities, setActivities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const userID = localStorage.getItem("user_id")

  const load = async () => {
    try {
      const res = await API.get(`/users/${userID}/activities`)
      setActivities(res.data || [])
    } catch (err) {
      console.error("Error al obtener actividades del usuario", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (userID) load()
  }, [userID])

  if (!userID) {
    return (
      <Container maxWidth="md">
        <Box textAlign="center" py={6}>
          <Alert severity="warning" sx={{ maxWidth: 400, mx: "auto" }}>
            <Warning sx={{ mr: 1 }} />
            Debes iniciar sesión para ver tus actividades.
          </Alert>
        </Box>
      </Container>
    )
  }

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Box textAlign="center">
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Cargando tus actividades...
            </Typography>
          </Box>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Mis Actividades
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Actividades en las que estás inscrito
        </Typography>
      </Box>

      {activities.length === 0 ? (
        <Box textAlign="center" py={6}>
          <FitnessCenter sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No tienes actividades
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Aún no te has inscrito en ninguna actividad.
          </Typography>
          <Button component={Link} to="/" variant="contained" size="large" startIcon={<FitnessCenter />}>
            Explorar actividades
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {activities.map((activity) => (
            <Grid item xs={12} sm={6} md={4} key={activity.ID}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {String(activity.name || "")}
                    </Typography>
                    <Chip label={String(activity.category || "")} color="primary" size="small" />
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <CalendarToday sx={{ mr: 1, fontSize: 18, color: "text.secondary" }} />
                    <Typography variant="body2" color="text.secondary">
                      {String(activity.day || "")}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Schedule sx={{ mr: 1, fontSize: 18, color: "text.secondary" }} />
                    <Typography variant="body2" color="text.secondary">
                      {String(activity.hour || "")} hs
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <People sx={{ mr: 1, fontSize: 18, color: "text.secondary" }} />
                    <Typography variant="body2" color="text.secondary">
                      Cupo: {String(activity.capacity || "")} personas
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions>
                  <Button
                    component={Link}
                    to={`/activities/${activity.ID}`}
                    variant="outlined"
                    fullWidth
                    startIcon={<FitnessCenter />}
                  >
                    Ver detalles
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}
