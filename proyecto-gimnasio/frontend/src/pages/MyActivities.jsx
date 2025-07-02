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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
} from "@mui/material"
import { CalendarToday, Schedule, People, FitnessCenter, Warning, PersonRemove } from "@mui/icons-material"
import { useAuthStore } from "../services/auth-store"
import API from "../services/api"

export default function MyActivities() {
  const { user, isAuthenticated } = useAuthStore()
  const [activities, setActivities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [unenrollDialog, setUnenrollDialog] = useState({ open: false, activity: null })
  const [isUnenrolling, setIsUnenrolling] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })

  const load = async () => {
    if (!user?.id) return
    
    try {
      const res = await API.get(`/users/${user.id}/activities`)
      setActivities(res.data || [])
    } catch (err) {
      console.error("Error al obtener actividades del usuario", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnenrollClick = (activity) => {
    setUnenrollDialog({ open: true, activity })
  }

  const handleUnenrollConfirm = async () => {
    if (!unenrollDialog.activity) return

    setIsUnenrolling(true)
    try {
      await API.delete(`/activities/${unenrollDialog.activity.id}/unenroll`)
      
      // Remove the activity from the local state
      setActivities(prev => prev.filter(act => act.id !== unenrollDialog.activity.id))
      
      setSnackbar({
        open: true,
        message: `Te has desinscrito exitosamente de "${unenrollDialog.activity.name}"`,
        severity: "success"
      })
    } catch (err) {
      console.error("Error al desinscribirse de la actividad", err)
      setSnackbar({
        open: true,
        message: err.response?.data?.error || "Error al desinscribirse de la actividad",
        severity: "error"
      })
    } finally {
      setIsUnenrolling(false)
      setUnenrollDialog({ open: false, activity: null })
    }
  }

  const handleUnenrollCancel = () => {
    setUnenrollDialog({ open: false, activity: null })
  }

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      load()
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated, user?.id])

  if (!isAuthenticated) {
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
            <Grid item xs={12} sm={6} md={4} key={activity.id}>
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

                <CardActions sx={{ flexDirection: "column", gap: 1 }}>
                  <Button
                    component={Link}
                    to={`/activities/${activity.id}`}
                    variant="outlined"
                    fullWidth
                    startIcon={<FitnessCenter />}
                  >
                    Ver detalles
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    startIcon={<PersonRemove />}
                    onClick={() => handleUnenrollClick(activity)}
                  >
                    Desinscribirse
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={unenrollDialog.open}
        onClose={handleUnenrollCancel}
        aria-labelledby="unenroll-dialog-title"
        aria-describedby="unenroll-dialog-description"
      >
        <DialogTitle id="unenroll-dialog-title">
          Confirmar desinscripción
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="unenroll-dialog-description">
            ¿Estás seguro que deseas desinscribirte de la actividad "{unenrollDialog.activity?.name}"?
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUnenrollCancel} color="inherit">
            Cancelar
          </Button>
          <Button 
            onClick={handleUnenrollConfirm} 
            color="error" 
            variant="contained"
            disabled={isUnenrolling}
            startIcon={isUnenrolling ? <CircularProgress size={20} /> : <PersonRemove />}
          >
            {isUnenrolling ? "Desinscribiendo..." : "Desinscribirse"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}
