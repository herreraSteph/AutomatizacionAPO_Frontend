import { Link } from 'react-router-dom';
import { useState } from 'react';

// material-ui
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Logo from '../../../assets/images/Registro/Logo.jpeg';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthFooter from 'ui-component/cards/AuthFooter';

// ===============================|| AUTH3 - REGISTER ||=============================== //

const Register = () => {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    apellido: '',
    correo: '',
    contraseña: '',
    roles: 0  // Este campo almacenará 1 (Construcción) o 2 (Precios Unitarios)
  });

  const [openModal, setOpenModal] = useState(false); // Controla si el modal está abierto
  const [modalMessage, setModalMessage] = useState(''); // Almacena el mensaje del modal
  const [modalSeverity, setModalSeverity] = useState('success'); // Controla el tipo de modal (éxito o error)

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Si el campo es "rol", convertimos el valor a número
    const updatedValue = name === 'roles' ? (value === 'Construcción' ? 1 : 2) : value;
    setFormData({ ...formData, [name]: updatedValue });
  };

  const handleCloseModal = () => {
    setOpenModal(false); // Cierra el modal
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://automatizacionapo-backend.onrender.com/api/Login/SignUp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      // Verificar si la respuesta no es exitosa
      if (!response.ok) {
        // Si la respuesta no es exitosa, obtener el mensaje de error del servidor
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Error al registrar usuario');
      }

      // Si la respuesta es exitosa, obtener los datos
      const data = await response.json();

      // Verificar si la respuesta tiene un campo "tipoError"
      if (data.tipoError !== undefined && data.tipoError !== 0) {
        // Si tipoError es diferente de 0, lanzar un error con el mensaje del servidor
        throw new Error(data.mensaje || 'Error al registrar usuario');
      }

      // Si todo está bien, mostrar modal de éxito
      setModalMessage("¡Registro exitoso!");
      setModalSeverity("success");
      setOpenModal(true);
    } catch (error) {
      console.error(error.message); // Registrar el error en la consola para depuración
      // Mostrar modal en caso de error
      setModalMessage("Ocurrió un error. Inténtalo de nuevo más tarde");
      setModalSeverity("error");
      setOpenModal(true);
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
                        
                        {/* Campo para seleccionar el rol */}
                        <TextField
                          select
                          label="Rol"
                          name="roles"
                          value={formData.roles === 1 ? 'Construcción' : formData.roles === 2 ? 'Precios Unitarios' : ''}
                          onChange={handleChange}
                          fullWidth
                        >
                          <MenuItem value="Construcción">Construcción</MenuItem>
                          <MenuItem value="Precios Unitarios">Precios Unitarios</MenuItem>
                        </TextField>

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

      {/* Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>
          {modalSeverity === "success" ? "Éxito" : "Error"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {modalMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </AuthWrapper1>
  );
};

export default Register;