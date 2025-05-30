import { useEffect, useState } from "react"
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
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
} from "@mui/material"
import { Add, Edit, Delete, CalendarToday, Schedule, People, Close, Category } from "@mui/icons-material"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import ActivityForm from "../components/ActivityForm.jsx"
import API from "../services/api"

export default function AdminDashboard() {
  const [activities, setActivities] = useState([])
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const loadActivities = async () => {
    try {
      const res = await API.get("/activities")
      setActivities(res.data || [])
    } catch (err) {
      toast.error("No se pudieron cargar las actividades")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadActivities()
  }, [])

  const deleteActivity = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta actividad?")) return

    try {
      await API.delete(`/admin/activities/${id}`)
      toast.success("Actividad eliminada correctamente")
      loadActivities()
    } catch (err) {
      toast.error("No se pudo eliminar la actividad")
      console.error(err)
    }
  }

  const handleFormSuccess = () => {
    setEditing(null)
    setShowForm(false)
    loadActivities()
  }

  const handleCloseDialog = () => {
    setEditing(null)
    setShowForm(false)
  }

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Box textAlign="center">
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Cargando panel de administración...
            </Typography>
          </Box>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Panel de Administración
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Gestiona las actividades del gimnasio
          </Typography>
        </Box>
        <Button component={Link} to="/admin/categories" variant="outlined" startIcon={<Category />}>
          Gestionar Categorías
        </Button>
      </Box>

      {activities.length === 0 ? (
        <Box textAlign="center" py={6}>
          <CalendarToday sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No hay actividades
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Comienza creando tu primera actividad.
          </Typography>
          <Button variant="contained" size="large" onClick={() => setShowForm(true)} startIcon={<Add />}>
            Crear primera actividad
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
                    <Chip label={String(activity.category.name || "")} color="primary" size="small" />
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

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <People sx={{ mr: 1, fontSize: 18, color: "text.secondary" }} />
                    <Typography variant="body2" color="text.secondary">
                      Cupo: {String(activity.capacity || "")} personas
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => setEditing(activity)}
                    disabled={showForm || editing}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => deleteActivity(activity.ID)}
                    disabled={showForm || editing}
                  >
                    Eliminar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={() => setShowForm(true)}
        disabled={showForm || editing}
      >
        <Add />
      </Fab>

      <Dialog open={showForm || Boolean(editing)} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {editing ? "Editar Actividad" : "Nueva Actividad"}
          <Button onClick={handleCloseDialog} sx={{ minWidth: "auto", p: 1 }}>
            <Close />
          </Button>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <ActivityForm activity={editing} onSuccess={handleFormSuccess} />
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  )
}
