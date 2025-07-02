import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
  Alert,
  CircularProgress,
  Divider,
  CardMedia,
} from "@mui/material"
import {
  ArrowBack,
  CalendarToday,
  Schedule,
  People,
  CheckCircle,
  Error,
  Edit,
  Delete,
  FitnessCenter,
  AccessTime,
  Repeat,
  PersonRemove,
} from "@mui/icons-material"
import { toast } from "react-toastify"
import { useAuthStore } from "../services/auth-store"
import API from "../services/api"

export default function ActivityDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const [activity, setActivity] = useState(null)
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [isUnenrolling, setIsUnenrolling] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [checkingEnrollment, setCheckingEnrollment] = useState(false)

  const loadActivity = async () => {
    try {
      const res = await API.get(`/activities/${id}`)
      setActivity(res.data)
    } catch (err) {
      console.error(err)
      toast.error("No se pudo cargar la actividad")
    } finally {
      setIsLoading(false)
    }
  }

  const checkEnrollmentStatus = async () => {
    if (!user?.id || !isAuthenticated) return
    
    setCheckingEnrollment(true)
    try {
      const res = await API.get(`/users/${user.id}/activities`)
      const userActivities = res.data || []
      const enrolled = userActivities.some(act => act.id === parseInt(id))
      setIsEnrolled(enrolled)
    } catch (err) {
      console.error("Error checking enrollment status:", err)
      // No mostrar error toast aquí para no interrumpir la experiencia del usuario
    } finally {
      setCheckingEnrollment(false)
    }
  }

  const handleEnroll = async () => {
    if (!user?.id) {
      toast.error("Debes estar logueado como socio para inscribirte")
      return
    }

    setIsEnrolling(true)
    try {
      await API.post("/activities/enroll", {
        activity_id: parseInt(id),
      })
      setIsEnrolled(true)
      setMessage("success")
      toast.success("Te has inscrito correctamente a la actividad")
    } catch (err) {
      setMessage("error")
      toast.error(err.response?.data?.error || "No se pudo completar la inscripción")
    } finally {
      setIsEnrolling(false)
    }
  }

  const handleUnenroll = async () => {
    if (!window.confirm("¿Estás seguro que deseas desinscribirte de esta actividad?")) return

    setIsUnenrolling(true)
    try {
      await API.delete(`/activities/${id}/unenroll`)
      setIsEnrolled(false)
      toast.success("Te has desinscrito exitosamente de la actividad")
    } catch (err) {
      console.error("Error al desinscribirse:", err)
      toast.error(err.response?.data?.error || "Error al desinscribirse de la actividad")
    } finally {
      setIsUnenrolling(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta actividad?")) return

    try {
      await API.delete(`/admin/activities/${id}`)
      toast.success("Actividad eliminada correctamente")
      navigate("/admin")
    } catch (err) {
      toast.error("No se pudo eliminar la actividad")
    }
  }

  useEffect(() => {
    loadActivity()
  }, [id])

  useEffect(() => {
    if (isAuthenticated && user?.id && user?.role === "socio") {
      checkEnrollmentStatus()
    }
  }, [isAuthenticated, user?.id, user?.role, id])

  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Box textAlign="center">
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Cargando actividad...
            </Typography>
          </Box>
        </Box>
      </Container>
    )
  }

  if (!activity) {
    return (
      <Container maxWidth="md">
        <Box textAlign="center" py={6}>
          <Error sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Actividad no encontrada
          </Typography>
          <Button variant="contained" onClick={() => navigate("/")} startIcon={<ArrowBack />} sx={{ mt: 2 }}>
            Volver al inicio
          </Button>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="md">
      <Button variant="outlined" onClick={() => navigate(-1)} startIcon={<ArrowBack />} sx={{ mb: 3 }}>
        Volver
      </Button>

      <Card>
        {activity.image_url && (
          <CardMedia
            component="img"
            height="300"
            image={activity.image_url}
            alt={activity.name}
            sx={{ objectFit: "cover" }}
          />
        )}
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {String(activity.name || "")}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Detalles de la actividad deportiva
              </Typography>
            </Box>
            <Chip label={String(activity.category.name || "")} color="primary" size="large" />
          </Box>

          <Divider sx={{ my: 3 }} />  

          <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <CalendarToday color="primary" />
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  Día
                </Typography>
                <Typography color="text.secondary">{String(activity.day || "")}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Schedule color="primary" />
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  Horario
                </Typography>
                <Typography color="text.secondary">{String(activity.start_hour || activity.hour || "")} hs</Typography>
              </Box>
            </Box>

            {activity.duration && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <AccessTime color="primary" />
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Duración
                  </Typography>
                  <Typography color="text.secondary">{String(activity.duration)} minutos</Typography>
                </Box>
              </Box>
            )}

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <People color="primary" />
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  Capacidad
                </Typography>
                <Typography color="text.secondary">{String(activity.capacity || "")} personas</Typography>
              </Box>
            </Box>

            {activity.frequency && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Repeat color="primary" />
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Frecuencia
                  </Typography>
                  <Typography color="text.secondary">{String(activity.frequency)}</Typography>
                </Box>
              </Box>
            )}
          </Box>

          {/* Mostrar estado de inscripción */}
          {isAuthenticated && user?.role === "socio" && !checkingEnrollment && isEnrolled && (
            <Alert
              severity="info"
              icon={<CheckCircle />}
              sx={{ mt: 3 }}
            >
              ¡Ya estás inscrito en esta actividad! Puedes desinscribirte si lo deseas.
            </Alert>
          )}

          {message && (
            <Alert
              severity={message === "success" ? "success" : "error"}
              icon={message === "success" ? <CheckCircle /> : <Error />}
              sx={{ mt: 3 }}
            >
              {message === "success"
                ? "¡Inscripción exitosa! Ya formas parte de esta actividad."
                : "No se pudo completar la inscripción. Inténtalo nuevamente."}
            </Alert>
          )}

          <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
            {isAuthenticated && user?.role === "socio" && (
              <>
                {checkingEnrollment ? (
                  <Button
                    variant="outlined"
                    size="large"
                    disabled
                    startIcon={<CircularProgress size={20} />}
                    sx={{ flex: 1 }}
                  >
                    Verificando estado...
                  </Button>
                ) : isEnrolled ? (
                  <Button
                    variant="contained"
                    color="error"
                    size="large"
                    onClick={handleUnenroll}
                    disabled={isUnenrolling}
                    startIcon={isUnenrolling ? <CircularProgress size={20} /> : <PersonRemove />}
                    sx={{ flex: 1 }}
                  >
                    {isUnenrolling ? "Desinscribiéndose..." : "Desinscribirse"}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleEnroll}
                    disabled={isEnrolling || message === "success"}
                    startIcon={isEnrolling ? <CircularProgress size={20} /> : <FitnessCenter />}
                    sx={{ flex: 1 }}
                  >
                    {isEnrolling ? "Inscribiendo..." : "Inscribirme"}
                  </Button>
                )}
              </>
            )}

            {isAuthenticated && user?.role === "admin" && (
              <>
                <Button variant="outlined" startIcon={<Edit />} onClick={() => navigate(`/admin/edit/${id}`)}>
                  Editar
                </Button>
                <Button variant="contained" color="error" startIcon={<Delete />} onClick={handleDelete}>
                  Eliminar
                </Button>
              </>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}
