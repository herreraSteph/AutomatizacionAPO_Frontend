import { useState, useEffect } from 'react'; 
import { useSelector } from 'react-redux';
// Registro
// material-ui
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

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const AuthRegister = ({ ...others }) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState();

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

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <Grid container spacing={matchDownSM ? 0 : 2}> 
              {/* Nombre Input */}
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
              
              {/* Apellidos Input */}
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

            {/* Email Input */}
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

            {/* Password Input */}
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
                <Button    fullWidth size="medium" type="submit" variant="contained" style={{ backgroundColor: '#060336', color: 'white' }}>
                  Aceptar
                </Button>
              </AnimateButton>
            </Box>
           
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthRegister;

