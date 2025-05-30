"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  Container,
  Typography,
  TextField,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Box,
  Grid,
  CircularProgress,
  InputAdornment,
  CardMedia,
} from "@mui/material"
import { Search, Schedule, People, CalendarToday, FitnessCenter, AccessTime } from "@mui/icons-material"
import API from "../services/api"

export default function Home() {
  const [activities, setActivities] = useState([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const loadActivities = async () => {
    try {
      const res = await API.get("/activities")
      setActivities(res.data || [])
    } catch (err) {
      console.error("Error al cargar actividades", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadActivities()
  }, [])

  const filtered = activities.filter((a) => {
    const term = search.toLowerCase()
    return (
      String(a.name || "")
        .toLowerCase()
        .includes(term) ||
      String(a.category || "")
        .toLowerCase()
        .includes(term) ||
      String(a.start_hour || a.hour || "")
        .toLowerCase()
        .includes(term) ||
      String(a.day || "")
        .toLowerCase()
        .includes(term)
    )
  })

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Box textAlign="center">
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Cargando actividades...
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
          Actividades Disponibles
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Descubre y únete a nuestras actividades deportivas
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 600, mx: "auto", mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Buscar por nombre, horario o categoría..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid container spacing={3}>
        {filtered.map((activity) => (
          <Grid item xs={12} sm={6} md={4} key={activity.ID}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              {activity.image_url && (
                <CardMedia
                  component="img"
                  height="200"
                  image={activity.image_url}
                  alt={activity.name}
                  sx={{ objectFit: "cover" }}
                />
              )}
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
                    {String(activity.start_hour || activity.hour || "")} hs
                  </Typography>
                </Box>

                {activity.duration && (
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <AccessTime sx={{ mr: 1, fontSize: 18, color: "text.secondary" }} />
                    <Typography variant="body2" color="text.secondary">
                      {String(activity.duration)} minutos
                    </Typography>
                  </Box>
                )}

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
                  variant="contained"
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

      {filtered.length === 0 && (
        <Box textAlign="center" py={6}>
          <Search sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No se encontraron actividades
          </Typography>
          <Typography color="text.secondary">Intenta con otros términos de búsqueda</Typography>
        </Box>
      )}
    </Container>
  )
}
