import { useEffect, useState } from "react"
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
  TextField,
  DialogContentText,
} from "@mui/material"
import {
  People,
  Edit,
  Delete,
  Save,
  Cancel,
  AdminPanelSettings,
  Person,
  Warning,
  PersonAdd,
} from "@mui/icons-material"
import API from "../services/api"

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editDialog, setEditDialog] = useState({ open: false, user: null })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null })
  const [createDialog, setCreateDialog] = useState({ open: false })
  const [editForm, setEditForm] = useState({ role: "", username: "" })
  const [createForm, setCreateForm] = useState({ username: "", password: "", role: "socio" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })

  const loadUsers = async () => {
    setLoading(true)
    try {
      const response = await API.get("/admin/users")
      setUsers(response.data || [])
    } catch (error) {
      console.error("Error loading users:", error)
      setSnackbar({
        open: true,
        message: "Error al cargar los usuarios",
        severity: "error"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleEditClick = (user) => {
    setEditForm({ role: user.role, username: user.username })
    setEditDialog({ open: true, user })
  }

  const handleEditSubmit = async () => {
    if (!editDialog.user) return

    setIsSubmitting(true)
    try {
      await API.put(`/admin/users/${editDialog.user.id}`, {
        role: editForm.role,
        username: editForm.username
      })

      // Update the user in the local state
      setUsers(prev => prev.map(user => 
        user.id === editDialog.user.id 
          ? { ...user, role: editForm.role, username: editForm.username }
          : user
      ))

      setSnackbar({
        open: true,
        message: `Usuario "${editForm.username}" actualizado exitosamente`,
        severity: "success"
      })

      setEditDialog({ open: false, user: null })
    } catch (error) {
      console.error("Error updating user:", error)
      setSnackbar({
        open: true,
        message: error.response?.data?.error || "Error al actualizar el usuario",
        severity: "error"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClick = (user) => {
    setDeleteDialog({ open: true, user })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.user) return

    setIsSubmitting(true)
    try {
      await API.delete(`/admin/users/${deleteDialog.user.id}`)

      // Remove the user from the local state
      setUsers(prev => prev.filter(user => user.id !== deleteDialog.user.id))

      setSnackbar({
        open: true,
        message: `Usuario "${deleteDialog.user.username}" eliminado exitosamente`,
        severity: "success"
      })

      setDeleteDialog({ open: false, user: null })
    } catch (error) {
      console.error("Error deleting user:", error)
      setSnackbar({
        open: true,
        message: error.response?.data?.error || "Error al eliminar el usuario",
        severity: "error"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreateClick = () => {
    setCreateForm({ username: "", password: "", role: "socio" })
    setCreateDialog({ open: true })
  }

  const handleCreateSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await API.post("/register", {
        username: createForm.username,
        password: createForm.password,
        role: createForm.role
      })

      // Add the new user to the local state
      const newUser = response.data || { 
        id: Date.now(), // Fallback ID if not returned
        username: createForm.username, 
        role: createForm.role 
      }
      setUsers(prev => [...prev, newUser])

      setSnackbar({
        open: true,
        message: `Usuario "${createForm.username}" creado exitosamente`,
        severity: "success"
      })

      setCreateDialog({ open: false })
      setCreateForm({ username: "", password: "", role: "socio" })
    } catch (error) {
      console.error("Error creating user:", error)
      setSnackbar({
        open: true,
        message: error.response?.data?.error || "Error al crear el usuario",
        severity: "error"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseDialogs = () => {
    if (!isSubmitting) {
      setEditDialog({ open: false, user: null })
      setDeleteDialog({ open: false, user: null })
      setCreateDialog({ open: false })
      setCreateForm({ username: "", password: "", role: "socio" })
    }
  }

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const getRoleIcon = (role) => {
    return role === "admin" ? <AdminPanelSettings /> : <Person />
  }

  const getRoleColor = (role) => {
    return role === "admin" ? "secondary" : "primary"
  }

  const getRoleLabel = (role) => {
    return role === "admin" ? "Administrador" : "Socio"
  }

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Box textAlign="center">
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Cargando usuarios...
            </Typography>
          </Box>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          <People sx={{ mr: 2, fontSize: "inherit" }} />
          Gestión de Usuarios
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Administra todos los usuarios del sistema
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h6">
              Usuarios Registrados ({users.length})
            </Typography>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={handleCreateClick}
              disabled={isSubmitting}
            >
              Crear Usuario
            </Button>
          </Box>

          {users.length === 0 ? (
            <Box textAlign="center" py={4}>
              <People sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No hay usuarios registrados
              </Typography>
              <Typography color="text.secondary">
                No se encontraron usuarios en el sistema.
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Usuario</TableCell>
                    <TableCell align="center">Rol</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          #{user.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {getRoleIcon(user.role)}
                          <Typography variant="body2" fontWeight="bold" sx={{ ml: 1 }}>
                            {user.username}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={getRoleLabel(user.role)}
                          color={getRoleColor(user.role)}
                          size="small"
                          icon={getRoleIcon(user.role)}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                          <IconButton
                            color="primary"
                            onClick={() => handleEditClick(user)}
                            disabled={isSubmitting}
                            title="Editar usuario"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteClick(user)}
                            disabled={isSubmitting}
                            title="Eliminar usuario"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={editDialog.open} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
        <DialogTitle>
          Editar Usuario: {editDialog.user?.username}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Nombre de Usuario"
              value={editForm.username}
              onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
              disabled={isSubmitting}
              fullWidth
              required
              helperText="Introduce un nombre de usuario único"
            />
            
            <FormControl fullWidth>
              <InputLabel>Rol del Usuario</InputLabel>
              <Select
                value={editForm.role}
                label="Rol del Usuario"
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                disabled={isSubmitting}
              >
                <MenuItem value="socio">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Person sx={{ mr: 1 }} />
                    Socio
                  </Box>
                </MenuItem>
                <MenuItem value="admin">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <AdminPanelSettings sx={{ mr: 1 }} />
                    Administrador
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            disabled={isSubmitting || !editForm.role || !editForm.username.trim()}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <Save />}
          >
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={deleteDialog.open} onClose={handleCloseDialogs}>
        <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
          <Warning sx={{ mr: 1, color: "error.main" }} />
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro que deseas eliminar al usuario "{deleteDialog.user?.username}"?
            <br />
            <strong>Esta acción no se puede deshacer.</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <Delete />}
          >
            {isSubmitting ? "Eliminando..." : "Eliminar Usuario"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={createDialog.open} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <PersonAdd sx={{ mr: 1, color: "primary.main" }} />
            Crear Nuevo Usuario
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Nombre de Usuario"
              value={createForm.username}
              onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
              disabled={isSubmitting}
              fullWidth
              required
              helperText="Introduce un nombre de usuario único"
            />
            
            <TextField
              label="Contraseña"
              type="password"
              value={createForm.password}
              onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
              disabled={isSubmitting}
              fullWidth
              required
              helperText="Mínimo 8 caracteres"
            />
            
            <FormControl fullWidth>
              <InputLabel>Rol del Usuario</InputLabel>
              <Select
                value={createForm.role}
                label="Rol del Usuario"
                onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                disabled={isSubmitting}
              >
                <MenuItem value="socio">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Person sx={{ mr: 1 }} />
                    Socio
                  </Box>
                </MenuItem>
                <MenuItem value="admin">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <AdminPanelSettings sx={{ mr: 1 }} />
                    Administrador
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            onClick={handleCreateSubmit}
            variant="contained"
            disabled={isSubmitting || !createForm.username.trim() || !createForm.password.trim() || !createForm.role}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <PersonAdd />}
          >
            {isSubmitting ? "Creando..." : "Crear Usuario"}
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
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
} 