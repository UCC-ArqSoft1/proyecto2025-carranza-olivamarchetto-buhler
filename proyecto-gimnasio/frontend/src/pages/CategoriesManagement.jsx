import { useEffect, useState } from "react"
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Grid,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material"
import { Add, Edit, Delete, Category, Close } from "@mui/icons-material"
import { toast } from "react-toastify"
import API from "../services/api"

export default function CategoriesManagement() {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({ name: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadCategories = async () => {
    try {
      const res = await API.get("/categories")
      setCategories(res.data || [])
    } catch (err) {
      toast.error("No se pudieron cargar las categorías")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleOpenForm = (category = null) => {
    setEditing(category)
    setFormData({ name: category ? category.name : "" })
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setEditing(null)
    setFormData({ name: "" })
    setShowForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error("El nombre de la categoría es requerido")
      return
    }

    setIsSubmitting(true)
    try {
      if (editing) {
        await API.put(`/categories/${editing.ID}`, formData)
        toast.success("Categoría actualizada correctamente")
      } else {
        await API.post("/categories", formData)
        toast.success("Categoría creada correctamente")
      }
      handleCloseForm()
      loadCategories()
    } catch (err) {
      toast.error("No se pudo guardar la categoría")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (category) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar la categoría "${category.name}"?`)) return

    try {
      await API.delete(`/categories/${category.ID}`)
      toast.success("Categoría eliminada correctamente")
      loadCategories()
    } catch (err) {
      toast.error("No se pudo eliminar la categoría")
      console.error(err)
    }
  }

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Box textAlign="center">
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Cargando categorías...
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
            Gestión de Categorías
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Administra las categorías de actividades del gimnasio
          </Typography>
        </Box>
      </Box>

      {categories.length === 0 ? (
        <Box textAlign="center" py={6}>
          <Category sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No hay categorías
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Comienza creando tu primera categoría.
          </Typography>
          <Button variant="contained" size="large" onClick={() => handleOpenForm()} startIcon={<Add />}>
            Crear primera categoría
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.ID}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Category sx={{ mr: 2, color: "primary.main" }} />
                    <Typography variant="h6" component="h2">
                      {category.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    ID: {category.ID}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Creada: {new Date(category.CreatedAt).toLocaleDateString()}
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => handleOpenForm(category)}
                    disabled={showForm}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => handleDelete(category)}
                    disabled={showForm}
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
        onClick={() => handleOpenForm()}
        disabled={showForm}
      >
        <Add />
      </Fab>

      <Dialog open={showForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {editing ? "Editar Categoría" : "Nueva Categoría"}
          <Button onClick={handleCloseForm} sx={{ minWidth: "auto", p: 1 }}>
            <Close />
          </Button>
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              label="Nombre de la categoría"
              placeholder="Ej: Yoga, Pilates, Fitness..."
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              required
              fullWidth
              margin="normal"
              disabled={isSubmitting}
            />
            {editing && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Al editar esta categoría, se actualizará en todas las actividades que la usen.
              </Alert>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseForm} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || !formData.name.trim()}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : editing ? <Edit /> : <Add />}
            >
              {isSubmitting ? "Guardando..." : editing ? "Actualizar" : "Crear"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Container>
  )
}
