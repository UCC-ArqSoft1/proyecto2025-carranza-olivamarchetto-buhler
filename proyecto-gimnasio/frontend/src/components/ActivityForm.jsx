import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  CircularProgress,
} from "@mui/material"
import { Save, Add } from "@mui/icons-material"
import { toast } from "react-toastify"
import API from "../services/api"

export default function ActivityForm({ activity, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    day: "",
    start_hour: "",
    capacity: "",
    category_id: "",
    duration: "",
    frequency: "",
    image_url: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  const loadCategories = async () => {
    try {
      const res = await API.get("/categories")
      setCategories(res.data || [])
    } catch (err) {
      console.error("Error loading categories:", err)
      toast.error("No se pudieron cargar las categorías")
    } finally {
      setLoadingCategories(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    if (activity) {
      setForm({
        name: String(activity.name || ""),
        day: String(activity.day || ""),
        start_hour: String(activity.start_hour || activity.hour || ""),
        capacity: String(activity.capacity || ""),
        category_id: String(activity.category_id || ""),
        duration: String(activity.duration || ""),
        frequency: String(activity.frequency || ""),
        image_url: String(activity.image_url || ""),
      })
    }
  }, [activity])

  const handleChange = (name, value) => {
    setForm({
      ...form,
      [name]:
        name === "capacity" || name === "category_id" || name === "duration"
          ? Number.parseInt(String(value)) || 0
          : String(value),
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const apiData = {
      name: form.name,
      day: form.day,
      start_hour: form.start_hour,
      capacity: Number.parseInt(form.capacity) || 0,
      category_id: Number.parseInt(form.category_id) || 0,
      duration: Number.parseInt(form.duration) || 0,
      frequency: form.frequency,
      image_url: form.image_url,
    }

    try {
      if (activity) {
        await API.put(`/admin/activities/${activity.ID}`, apiData)
        toast.success("Actividad actualizada correctamente")
      } else {
        await API.post("/admin/activities", apiData)
        toast.success("Actividad creada correctamente")
      }
      onSuccess()
      if (!activity) {
        setForm({
          name: "",
          day: "",
          start_hour: "",
          capacity: "",
          category_id: "",
          duration: "",
          frequency: "",
          image_url: "",
        })
      }
    } catch (e) {
      toast.error("No se pudo guardar la actividad")
      console.error("Error:", e.response?.data || e.message)
    } finally {
      setIsLoading(false)
    }
  }

  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
  const frequencies = ["Semanal", "Quincenal", "Mensual"]

  return (
    <Card sx={{ maxWidth: 500, mx: "auto" }}>
      <CardHeader>
        <Typography variant="h5" component="h2" gutterBottom>
          {activity ? "Editar Actividad" : "Nueva Actividad"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {activity ? "Modifica los datos de la actividad" : "Completa los datos para crear una nueva actividad"}
        </Typography>
      </CardHeader>
      <CardContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            label="Nombre"
            placeholder="Nombre de la actividad"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
            fullWidth
          />

          <FormControl fullWidth required>
            <InputLabel>Día</InputLabel>
            <Select value={form.day} label="Día" onChange={(e) => handleChange("day", e.target.value)}>
              {days.map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Hora de inicio"
            type="time"
            value={form.start_hour}
            onChange={(e) => handleChange("start_hour", e.target.value)}
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Duración (minutos)"
            type="number"
            placeholder="Duración en minutos"
            value={form.duration}
            onChange={(e) => handleChange("duration", e.target.value)}
            inputProps={{ min: 1 }}
            required
            fullWidth
          />

          <TextField
            label="Capacidad"
            type="number"
            placeholder="Número de participantes"
            value={form.capacity}
            onChange={(e) => handleChange("capacity", e.target.value)}
            inputProps={{ min: 1 }}
            required
            fullWidth
          />

          <FormControl fullWidth required>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={form.category_id}
              label="Categoría"
              onChange={(e) => handleChange("category_id", e.target.value)}
              disabled={loadingCategories}
            >
              {categories.map((category) => (
                <MenuItem key={category.ID} value={category.ID}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth required>
            <InputLabel>Frecuencia</InputLabel>
            <Select
              value={form.frequency}
              label="Frecuencia"
              onChange={(e) => handleChange("frequency", e.target.value)}
            >
              {frequencies.map((frequency) => (
                <MenuItem key={frequency} value={frequency}>
                  {frequency}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="URL de imagen"
            placeholder="https://ejemplo.com/imagen.jpg"
            value={form.image_url}
            onChange={(e) => handleChange("image_url", e.target.value)}
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : activity ? <Save /> : <Add />}
            fullWidth
          >
            {isLoading ? "Guardando..." : activity ? "Actualizar" : "Crear"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}
