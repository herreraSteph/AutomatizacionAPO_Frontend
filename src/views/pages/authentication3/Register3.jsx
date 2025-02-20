import { Link } from 'react-router-dom';

// material-ui
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import TextField from '@mui/material/TextField';  // Importación agregada
import Button from '@mui/material/Button';  // Importación agregada
import Logo from '../../../assets/images/Registro/Logo.jpeg';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthFooter from 'ui-component/cards/AuthFooter';
import { useState } from 'react';

// ===============================|| AUTH3 - REGISTER ||=============================== //

const Register = () => {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    apellido: '',
    correo: '',
    contraseña: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://automatizacionapo-backend.onrender.com/api/Login/SignUp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error al registrar usuario');
      }

      const data = await response.json();
      console.log('Registro exitoso:', data);

      // Mostrar alerta de éxito
      alert('¡Registro exitoso!');

      // Aquí podrías redirigir al usuario o realizar alguna otra acción
    } catch (error) {
      console.error(error.message);
      // Mostrar alerta en caso de error
      alert('Error al registrar usuario');
    }
  };

  return (
    <AuthWrapper1>
      <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper elevation={8}>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                  <Grid item xs={12}>
                    <Grid container direction={{ xs: 'column-reverse', md: 'row' }} alignItems="center" justifyContent="center">
                      <Grid item>
                        <Stack alignItems="center" justifyContent="center" spacing={2}>
                          {/* Logo agregado aquí */}
                          <img src={Logo} alt="Logo" style={{ width: '150px', marginBottom: '16px' }} />
                          <Typography color="secondary.main" gutterBottom variant={downMD ? 'h3' : 'h2'}>
                            Registro
                          </Typography>
                          <Typography variant="caption" fontSize="16px" textAlign={{ xs: 'center', md: 'inherit' }}>
                            Ingresa tus Datos
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    {/* Formulario de registro */}
                    <form onSubmit={handleSubmit}>
                      <Stack spacing={2}>
                        <TextField label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} fullWidth />
                        <TextField label="Apellido" name="apellido" value={formData.apellido} onChange={handleChange} fullWidth />
                        <TextField label="Correo" name="correo" type="email" value={formData.correo} onChange={handleChange} fullWidth />
                        <TextField label="Contraseña" name="contraseña" type="password" value={formData.contraseña} onChange={handleChange} fullWidth />
                        <Button type="submit" variant="contained" color="primary">Registrarse</Button>
                      </Stack>
                    </form>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid item container direction="column" alignItems="center" xs={12}>
                      <Typography component={Link} to="/pages/login/login3" variant="subtitle1" sx={{ textDecoration: 'none' }}>
                        ¿Ya tienes cuenta? Ingresa al Login
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
          <AuthFooter />
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default Register;
