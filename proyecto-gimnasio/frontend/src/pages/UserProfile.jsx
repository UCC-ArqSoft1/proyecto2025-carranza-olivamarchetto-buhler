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
  Avatar,
  Paper,
  Fade,
  Slide,
  CardHeader,
  LinearProgress,
  Tooltip,
  Badge,
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
  Security,
  CheckCircle,
  Info,
  FitnessCenter,
  Timeline,
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

  const getAvatarColor = (role) => {
    return role === "admin" ? "secondary.main" : "primary.main"
  }

  const getProfileCompletionPercentage = () => {
    let completion = 0
    if (profile?.id) completion += 25
    if (profile?.username) completion += 25
    if (profile?.role) completion += 25
    // Could add more fields like email, phone, etc.
    completion += 25 // Base completion for having an account
    return completion
  }

  const getInitials = (username) => {
    if (!username) return "U"
    return username.substring(0, 2).toUpperCase()
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
    <Container maxWidth="lg">
      {/* Profile Header */}
      

      <Grid container spacing={3}>
        {/* Profile Information Section */}
        <Grid item xs={12} md={8}>
          <Fade in timeout={700}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardHeader
                avatar={<AccountCircle color="primary" />}
                title="Información Personal"
                subheader="Gestiona tus datos personales"
                action={
                  !editMode && (
                    <Tooltip title="Editar información personal">
                      <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={handleEditProfile}
                        disabled={isSubmitting}
                        sx={{ borderRadius: 2 }}
                      >
                        Editar
                      </Button>
                    </Tooltip>
                  )
                }
              />
              <Divider />
              <CardContent sx={{ p: 3 }}>
                {editMode ? (
                  <Slide direction="up" in={editMode} timeout={300}>
                    <Box>
                      <Alert severity="info" sx={{ mb: 3 }}>
                        <Typography variant="body2">
                          Estás editando tu información personal. Los cambios se guardarán al hacer clic en "Guardar Cambios".
                        </Typography>
                      </Alert>
                      <TextField
                        label="Nombre de Usuario"
                        value={profileForm.username}
                        onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                        disabled={isSubmitting}
                        fullWidth
                        variant="outlined"
                        helperText="Introduce tu nuevo nombre de usuario"
                        InputProps={{
                          startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                        sx={{ mb: 3 }}
                      />
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Button
                          variant="contained"
                          startIcon={isSubmitting ? <CircularProgress size={20} /> : <Save />}
                          onClick={handleUpdateProfile}
                          disabled={isSubmitting || !profileForm.username.trim()}
                          sx={{ borderRadius: 2 }}
                        >
                          {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<Cancel />}
                          onClick={handleCancelEdit}
                          disabled={isSubmitting}
                          sx={{ borderRadius: 2 }}
                        >
                          Cancelar
                        </Button>
                      </Box>
                    </Box>
                  </Slide>
                ) : (
                  <Fade in={!editMode} timeout={300}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            NOMBRE DE USUARIO
                          </Typography>
                          <Typography variant="h6" fontWeight="bold" sx={{ mt: 0.5 }}>
                            {profile.username}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            ROL EN EL SISTEMA
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Chip
                              label={getRoleLabel(profile.role)}
                              color={getRoleColor(profile.role)}
                              icon={getRoleIcon(profile.role)}
                              variant="filled"
                            />
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            IDENTIFICADOR ÚNICO
                          </Typography>
                          <Typography variant="h6" fontWeight="bold" sx={{ mt: 0.5 }}>
                            #{profile.id}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Fade>
                )}
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        {/* Security and Quick Actions */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Security Card */}
            <Fade in timeout={900}>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardHeader
                  avatar={<Security color="secondary" />}
                  title="Seguridad"
                  subheader="Protege tu cuenta"
                />
                <Divider />
                <CardContent>
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
                    sx={{ borderRadius: 2, py: 1.5 }}
                  >
                    Cambiar Contraseña
                  </Button>
                </CardContent>
              </Card>
            </Fade>

            {/* Quick Stats Card */}
            <Fade in timeout={1100}>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardHeader
                  avatar={<Timeline color="primary" />}
                  title="Estado de la Cuenta"
                  subheader="Información general"
                />
                <Divider />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Perfil completado
                      </Typography>
                      <Chip 
                        label={`${getProfileCompletionPercentage()}%`} 
                        color="success" 
                        size="small" 
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Tipo de cuenta
                      </Typography>
                      <Chip 
                        label={getRoleLabel(profile.role)} 
                        color={getRoleColor(profile.role)} 
                        size="small" 
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Estado
                      </Typography>
                      <Chip 
                        label="Activo" 
                        color="success" 
                        size="small" 
                        icon={<CheckCircle />}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Box>
        </Grid>
      </Grid>

      {/* Enhanced Change Password Dialog */}
      <Dialog 
        open={changePasswordDialog} 
        onClose={handleClosePasswordDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, overflow: 'visible' }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
              <Lock />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Cambiar Contraseña
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Actualiza tu contraseña para mantener tu cuenta segura
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ pb: 2 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Tu nueva contraseña debe tener al menos 8 caracteres para mayor seguridad.
            </Typography>
          </Alert>
          
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Contraseña Actual"
              type={showCurrentPassword ? "text" : "password"}
              value={passwordForm.current_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
              disabled={isSubmitting}
              fullWidth
              required
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <Tooltip title={showCurrentPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
                    <IconButton
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      edge="end"
                    >
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </Tooltip>
                )
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            
            <TextField
              label="Nueva Contraseña"
              type={showNewPassword ? "text" : "password"}
              value={passwordForm.new_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
              disabled={isSubmitting}
              fullWidth
              required
              variant="outlined"
              helperText={
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  {passwordForm.new_password.length >= 8 ? (
                    <CheckCircle sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                  ) : (
                    <Info sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                  )}
                  <Typography variant="caption">
                    {passwordForm.new_password.length >= 8 
                      ? "Contraseña válida" 
                      : `Mínimo 8 caracteres (${passwordForm.new_password.length}/8)`
                    }
                  </Typography>
                </Box>
              }
              InputProps={{
                endAdornment: (
                  <Tooltip title={showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
                    <IconButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </Tooltip>
                )
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            
            <TextField
              label="Confirmar Nueva Contraseña"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              disabled={isSubmitting}
              fullWidth
              required
              variant="outlined"
              error={passwordForm.confirmPassword && passwordForm.new_password !== passwordForm.confirmPassword}
              helperText={
                passwordForm.confirmPassword ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    {passwordForm.new_password === passwordForm.confirmPassword ? (
                      <>
                        <CheckCircle sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                        <Typography variant="caption" color="success.main">
                          Las contraseñas coinciden
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Cancel sx={{ fontSize: 16, color: 'error.main', mr: 0.5 }} />
                        <Typography variant="caption" color="error.main">
                          Las contraseñas no coinciden
                        </Typography>
                      </>
                    )}
                  </Box>
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    Repite tu nueva contraseña
                  </Typography>
                )
              }
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={handleClosePasswordDialog} 
            disabled={isSubmitting}
            sx={{ borderRadius: 2 }}
          >
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
              passwordForm.new_password !== passwordForm.confirmPassword ||
              passwordForm.new_password.length < 8
            }
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <Lock />}
            sx={{ borderRadius: 2, px: 3 }}
          >
            {isSubmitting ? "Cambiando..." : "Cambiar Contraseña"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={Slide}
        TransitionProps={{ direction: "up" }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          sx={{ 
            width: "100%",
            borderRadius: 2,
            boxShadow: 3,
            '& .MuiAlert-icon': {
              fontSize: '1.5rem'
            }
          }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
} 