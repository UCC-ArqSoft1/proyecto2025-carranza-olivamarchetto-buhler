import { useEffect, useState } from "react"
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
} from "@mui/material"
import {
  BarChart,
  People,
  TrendingUp,
  CalendarToday,
  FitnessCenter,
  Assessment,
  Star,
  PersonAdd,
} from "@mui/icons-material"
import API from "../services/api"

export default function AdminStats() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    activities: [],
    days: [],
    enrollments: null,
    popularActivities: [],
    users: null,
  })

  const loadStats = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [
        activitiesRes,
        daysRes,
        enrollmentsRes,
        popularRes,
        usersRes,
      ] = await Promise.all([
        API.get("/admin/stats/activities"),
        API.get("/admin/stats/days"),
        API.get("/admin/stats/enrollments"),
        API.get("/admin/stats/popular-activities"),
        API.get("/admin/stats/users"),
      ])

      setStats({
        activities: activitiesRes.data || [],
        days: daysRes.data || [],
        enrollments: enrollmentsRes.data || null,
        popularActivities: popularRes.data || [],
        users: usersRes.data || null,
      })
    } catch (err) {
      console.error("Error loading statistics:", err)
      setError("Error al cargar las estadísticas. Por favor, intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  const getOccupancyColor = (rate) => {
    if (rate >= 80) return "error"
    if (rate >= 60) return "warning" 
    if (rate >= 40) return "info"
    return "success"
  }

  const getOccupancyText = (rate) => {
    if (rate >= 80) return "Muy Alta"
    if (rate >= 60) return "Alta"
    if (rate >= 40) return "Media"
    return "Baja"
  }

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Box textAlign="center">
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Cargando estadísticas...
            </Typography>
          </Box>
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          <Assessment sx={{ mr: 2, fontSize: "inherit" }} />
          Estadísticas del Gimnasio
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Panel de análisis y métricas del sistema
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* User Statistics */}
        {stats.users && (
          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <People sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h6">Estadísticas de Usuarios</Typography>
                </Box>
                <Box sx={{ space: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2">Total Usuarios:</Typography>
                    <Typography variant="body2" fontWeight="bold">{stats.users.total_users}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2">Socios:</Typography>
                    <Typography variant="body2" fontWeight="bold" color="primary.main">{stats.users.total_socios}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2">Administradores:</Typography>
                    <Typography variant="body2" fontWeight="bold" color="secondary.main">{stats.users.total_admins}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2">Usuarios Activos:</Typography>
                    <Typography variant="body2" fontWeight="bold" color="success.main">{stats.users.active_users}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2">Usuarios Inactivos:</Typography>
                    <Typography variant="body2" fontWeight="bold" color="error.main">{stats.users.inactive_users}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Enrollment Statistics */}
        {stats.enrollments && (
          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <PersonAdd sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h6">Estadísticas de Inscripciones</Typography>
                </Box>
                <Box sx={{ space: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2">Total Inscripciones:</Typography>
                    <Typography variant="body2" fontWeight="bold">{stats.enrollments.total_enrollments}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2">Promedio por Actividad:</Typography>
                    <Typography variant="body2" fontWeight="bold">{stats.enrollments.average_per_activity?.toFixed(1)}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2">Promedio por Usuario:</Typography>
                    <Typography variant="body2" fontWeight="bold">{stats.enrollments.average_per_user?.toFixed(1)}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2">Día Más Popular:</Typography>
                    <Chip label={stats.enrollments.most_popular_day} color="success" size="small" />
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2">Día Menos Popular:</Typography>
                    <Chip label={stats.enrollments.least_popular_day} color="default" size="small" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Days Statistics */}
        {stats.days.length > 0 && (
          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <CalendarToday sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h6">Estadísticas por Día</Typography>
                </Box>
                <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
                  {stats.days.map((day, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="body2" fontWeight="bold">{day.day}</Typography>
                        <Typography variant="body2">{day.total_enrollments} inscripciones</Typography>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {day.total_activities} actividades
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.max(stats.days) ? (day.total_enrollments / Math.max(...stats.days.map(d => d.total_enrollments))) * 100 : 0}
                        sx={{ height: 6, borderRadius: 1 }}
                      />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Popular Activities */}
        {stats.popularActivities.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Star sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h6">Actividades Más Populares</Typography>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Ranking</TableCell>
                        <TableCell>Actividad</TableCell>
                        <TableCell>Categoría</TableCell>
                        <TableCell>Día</TableCell>
                        <TableCell>Hora</TableCell>
                        <TableCell align="center">Inscripciones</TableCell>
                        <TableCell align="center">Capacidad</TableCell>
                        <TableCell align="center">Ocupación</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats.popularActivities.slice(0, 10).map((activity) => (
                        <TableRow key={activity.activity_id}>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              {activity.rank <= 3 && (
                                <Star sx={{ 
                                  mr: 1, 
                                  color: activity.rank === 1 ? "gold" : activity.rank === 2 ? "silver" : "#CD7F32",
                                  fontSize: 20 
                                }} />
                              )}
                              #{activity.rank}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {activity.activity_name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={activity.category_name} size="small" />
                          </TableCell>
                          <TableCell>{activity.day}</TableCell>
                          <TableCell>{activity.start_hour}</TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" fontWeight="bold">
                              {activity.enrollment_count}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">{activity.capacity}</TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={`${activity.occupancy_rate?.toFixed(0)}% - ${getOccupancyText(activity.occupancy_rate)}`}
                              color={getOccupancyColor(activity.occupancy_rate)}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* All Activities Statistics */}
        {stats.activities.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <FitnessCenter sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h6">Todas las Actividades</Typography>
                </Box>
                <TableContainer sx={{ maxHeight: 400 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Actividad</TableCell>
                        <TableCell>Categoría</TableCell>
                        <TableCell>Día</TableCell>
                        <TableCell>Hora</TableCell>
                        <TableCell align="center">Inscritos</TableCell>
                        <TableCell align="center">Capacidad</TableCell>
                        <TableCell align="center">Disponibles</TableCell>
                        <TableCell align="center">Ocupación</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats.activities.map((activity) => (
                        <TableRow key={activity.activity_id}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {activity.activity_name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={activity.category_name} size="small" />
                          </TableCell>
                          <TableCell>{activity.day}</TableCell>
                          <TableCell>{activity.start_hour}</TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" fontWeight="bold">
                              {activity.current_enrolled}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">{activity.capacity}</TableCell>
                          <TableCell align="center">
                            <Typography 
                              variant="body2" 
                              color={activity.available_spots > 0 ? "success.main" : "error.main"}
                              fontWeight="bold"
                            >
                              {activity.available_spots}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ minWidth: 120 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={activity.occupancy_rate || 0}
                                color={getOccupancyColor(activity.occupancy_rate)}
                                sx={{ mb: 0.5 }}
                              />
                              <Typography variant="caption">
                                {activity.occupancy_rate?.toFixed(1)}%
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  )
} 