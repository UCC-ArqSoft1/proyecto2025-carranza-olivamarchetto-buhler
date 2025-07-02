import { useEffect, useState } from "react"
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  TextField,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  Grid,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material"
import {
  Person,
  Edit,
  Save,
  Cancel,
  Lock,
  Visibility,
  VisibilityOff,
  AdminPanelSettings,
  AccountCircle,
} from "@mui/icons-material"
import { useAuthStore } from "../services/auth-store"
import API from "../services/api"

export default function UserProfile() {
  const { user, setUser } = useAuthStore()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [changePasswordDialog, setChangePasswordDialog] = useState(false)
  
  // Form states
  const [profileForm, setProfileForm] = useState({ username: "" })
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirmPassword: ""
  })
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })

  const loadProfile = async () => {
    setLoading(true)
    try {
      const response = await API.get("/users/profile")
      const profileData = response.data
      setProfile(profileData)
      setProfileForm({ username: profileData.username })
    } catch (error) {
      console.error("Error loading profile:", error)
      setSnackbar({
        open: true,
        message: "Error al cargar el perfil",
        severity: "error"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const handleEditProfile = () => {
    setEditMode(true)
    setProfileForm({ username: profile.username })
  }

  const handleCancelEdit = () => {
    setEditMode(false)
    setProfileForm({ username: profile.username })
  }

  const handleUpdateProfile = async () => {
    setIsSubmitting(true)
    try {
      await API.put("/users/profile", {
        username: profileForm.username
      })

      // Update local state
      const updatedProfile = { ...profile, username: profileForm.username }
      setProfile(updatedProfile)
      
      // Update auth store if needed
      if (user) {
        setUser({ ...user, username: profileForm.username })
      }

      setSnackbar({
        open: true,
        message: "Perfil actualizado exitosamente",
        severity: "success"
      })

      setEditMode(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      setSnackbar({
        open: true,
        message: error.response?.data?.error || "Error al actualizar el perfil",
        severity: "error"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordForm.new_password !== passwordForm.confirmPassword) {
      setSnackbar({
        open: true,
        message: "Las contraseñas nuevas no coinciden",
        severity: "error"
      })
      return
    }

    setIsSubmitting(true)
    try {
      await API.put("/users/change-password", {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password
      })

      setSnackbar({
        open: true,
        message: "Contraseña cambiada exitosamente",
        severity: "success"
      })

      setChangePasswordDialog(false)
      setPasswordForm({
        current_password: "",
        new_password: "",
        confirmPassword: ""
      })
    } catch (error) {
      console.error("Error changing password:", error)
      setSnackbar({
        open: true,
        message: error.response?.data?.error || "Error al cambiar la contraseña",
        severity: "error"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClosePasswordDialog = () => {
    if (!isSubmitting) {
      setChangePasswordDialog(false)
      setPasswordForm({
        current_password: "",
        new_password: "",
        confirmPassword: ""
      })
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
      <Container maxWidth="md">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Box textAlign="center">
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Cargando perfil...
            </Typography>
          </Box>
        </Box>
      </Container>
    )
  }

  if (!profile) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">
            No se pudo cargar la información del perfil
          </Alert>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          <AccountCircle sx={{ mr: 2, fontSize: "inherit" }} />
          Mi Perfil
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Gestiona tu información personal y configuración de cuenta
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Information Card */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6">
                  Información Personal
                </Typography>
                {!editMode && (
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={handleEditProfile}
                    disabled={isSubmitting}
                  >
                    Editar
                  </Button>
                )}
              </Box>

              <Box sx={{ space: 3 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    ID de Usuario
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    #{profile.id}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Nombre de Usuario
                  </Typography>
                  {editMode ? (
                    <TextField
                      value={profileForm.username}
                      onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                      disabled={isSubmitting}
                      fullWidth
                      size="small"
                      helperText="Introduce tu nuevo nombre de usuario"
                    />
                  ) : (
                    <Typography variant="body1" fontWeight="bold">
                      {profile.username}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Rol en el Sistema
                  </Typography>
                  <Chip
                    label={getRoleLabel(profile.role)}
                    color={getRoleColor(profile.role)}
                    icon={getRoleIcon(profile.role)}
                    sx={{ mt: 0.5 }}
                  />
                </Box>

                {editMode && (
                  <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleUpdateProfile}
                      disabled={isSubmitting || !profileForm.username.trim()}
                    >
                      {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleCancelEdit}
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </Button>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Seguridad
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Mantén tu cuenta segura actualizando tu contraseña regularmente
              </Typography>
              
              <Button
                variant="contained"
                color="secondary"
                startIcon={<Lock />}
                onClick={() => setChangePasswordDialog(true)}
                fullWidth
                disabled={isSubmitting}
              >
                Cambiar Contraseña
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordDialog} onClose={handleClosePasswordDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Lock sx={{ mr: 1, color: "secondary.main" }} />
            Cambiar Contraseña
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Contraseña Actual"
              type={showCurrentPassword ? "text" : "password"}
              value={passwordForm.current_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
              disabled={isSubmitting}
              fullWidth
              required
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    edge="end"
                  >
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )
              }}
            />
            
            <TextField
              label="Nueva Contraseña"
              type={showNewPassword ? "text" : "password"}
              value={passwordForm.new_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
              disabled={isSubmitting}
              fullWidth
              required
              helperText="Mínimo 8 caracteres"
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )
              }}
            />
            
            <TextField
              label="Confirmar Nueva Contraseña"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              disabled={isSubmitting}
              fullWidth
              required
              error={passwordForm.confirmPassword && passwordForm.new_password !== passwordForm.confirmPassword}
              helperText={
                passwordForm.confirmPassword && passwordForm.new_password !== passwordForm.confirmPassword
                  ? "Las contraseñas no coinciden"
                  : "Repite tu nueva contraseña"
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordDialog} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            color="secondary"
            disabled={
              isSubmitting || 
              !passwordForm.current_password.trim() || 
              !passwordForm.new_password.trim() || 
              !passwordForm.confirmPassword.trim() ||
              passwordForm.new_password !== passwordForm.confirmPassword
            }
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <Lock />}
          >
            {isSubmitting ? "Cambiando..." : "Cambiar Contraseña"}
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