import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AuthRegister = ({ ...others }) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState();
  const [openSnackbar, setOpenSnackbar] = useState(false); // Control de Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Mensaje de Snackbar
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para deshabilitar el botón
  const navigate = useNavigate(); // Para redireccionar

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('123456');
  }, []);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false); // Cerrar la notificación
  };

  return (
    <>
      <Formik
        initialValues={{
          fname: '',
          lname: '',
          email: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Debe ser un correo válido').max(255).required('El correo es obligatorio'),
          password: Yup.string().max(255).required('La contraseña es obligatoria')
        })}
        onSubmit={async (values, { setSubmitting }) => {
          setIsSubmitting(true); // Deshabilitar el botón

          try {
            // Enviar datos a la API con Axios
            const response = await axios.post('https://tu-api.com/registro', {
              email: values.email,
              password: values.password,
              firstName: values.fname,
              lastName: values.lname
            });

            // Si la respuesta es exitosa, redirigir inmediatamente
            if (response.status === 200 || response.status === 201) {
              navigate('/Serman/pages/login/login3'); // Redirigir sin notificación
            }
          } catch (error) {
            // Si hay un error, mostrar notificación
            setSnackbarMessage('Error: Usuario no guardado');
            setOpenSnackbar(true);
          } finally {
            setIsSubmitting(false); // Habilitar el botón nuevamente
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <Grid container spacing={matchDownSM ? 0 : 2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                  <InputLabel htmlFor="floating-name">Nombre</InputLabel>
                  <OutlinedInput
                    id="floating-name"
                    type="text"
                    value={values.fname}
                    name="fname"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Nombre"
                    size="small"
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                  <InputLabel htmlFor="floating-lname">Apellidos</InputLabel>
                  <OutlinedInput
                    id="floating-lname"
                    type="text"
                    value={values.lname}
                    name="lname"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Apellidos"
                    size="small"
                  />
                </FormControl>
              </Grid>
            </Grid>

            <FormControl fullWidth variant="outlined" error={Boolean(touched.email && errors.email)} sx={{ mb: 2 }}>
              <InputLabel htmlFor="floating-email">Correo electrónico</InputLabel>
              <OutlinedInput
                id="floating-email"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Correo electrónico"
                size="small"
              />
              {touched.email && errors.email && (
                <FormHelperText error>{errors.email}</FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth variant="outlined" error={Boolean(touched.password && errors.password)} sx={{ mb: 2 }}>
              <InputLabel htmlFor="floating-password">Contraseña</InputLabel>
              <OutlinedInput
                id="floating-password"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                  changePassword(e.target.value);
                }}
                label="Contraseña"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                size="small"
              />
              {touched.password && errors.password && (
                <FormHelperText error>{errors.password}</FormHelperText>
              )}
            </FormControl>

            {strength !== 0 && (
              <FormControl fullWidth>
                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box style={{ backgroundColor: level?.color }} sx={{ width: 85, height: 8, borderRadius: '7px' }} />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level?.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </FormControl>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button
                  fullWidth
                  size="medium"
                  type="submit"
                  variant="contained"
                  style={{ backgroundColor: '#060336', color: 'white' }}
                  disabled={isSubmitting} // Deshabilitar el botón mientras se procesa
                >
                  <Box display="flex" alignItems="center" justifyContent="center">
                    {isSubmitting ? (
                      <>
                        <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                        Cargando...
                      </>
                    ) : (
                      'Aceptar'
                    )}
                  </Box>
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>

      {/* Notificación de error */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AuthRegister;