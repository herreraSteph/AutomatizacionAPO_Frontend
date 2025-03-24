import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import MainCard from "ui-component/cards/MainCard";
import Skeleton from "@mui/material/Skeleton"; // Importar Skeleton
import data from "../../data/clientes";
import { obtenerUltimoNumero, crearNumero } from "../../api/Construccion";

const CrearNumero = () => {
  const navigate = useNavigate();
  const [numero, setNumero] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // Nuevo estado para carga inicial
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    numero: "",
    cliente: "",
    fechaInicio: "",
    representante: "",
    prioridad: "",
  });
  const [representantes, setRepresentantes] = useState([]);
  const [errors, setErrors] = useState({});
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const fetchUltimoNumero = async () => {
      try {
        const ultimoNumero = await obtenerUltimoNumero();
        setNumero(ultimoNumero.nombre);
      } catch (error) {
        console.error("Error al obtener el último número:", error);
      } finally {
        setInitialLoading(false); // Finaliza la carga inicial independientemente del resultado
      }
    };

    fetchUltimoNumero();
  }, []);

  useEffect(() => {
    const fechaCreacion = new Date().toISOString().split("T")[0];
    setFormData((prevData) => ({ ...prevData, fechaCreacion }));
  }, []);

  useEffect(() => {
    setFormData((prevData) => ({ ...prevData, numero }));
  }, [numero]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "cliente") {
      const clienteSeleccionado = data.clientes.find(cliente => cliente.nombre === value);
      setRepresentantes(clienteSeleccionado ? clienteSeleccionado.representantes : []);
      setFormData(prevData => ({ ...prevData, representante: "" }));
    }
  };

  const getFechaIsoCdmx = () => {
    const now = new Date();
    const fechaCdmx = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Mexico_City",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).formatToParts(now);
  
    const getPart = (type) => fechaCdmx.find((part) => part.type === type).value;
  
    return `${getPart("year")}-${getPart("month")}-${getPart("day")}T${getPart("hour")}:${getPart("minute")}:${getPart("second")}.000Z`;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.cliente) {
      newErrors.cliente = "El cliente es requerido";
    }
    if (!formData.fechaInicio) {
      newErrors.fechaInicio = "La fecha de inicio es requerida";
    } else if (new Date(formData.fechaInicio) < new Date()) {
      newErrors.fechaInicio = "La fecha de inicio no puede ser anterior a la fecha actual";
    }
    if (!formData.representante) {
      newErrors.representante = "El representante es requerido";
    }
    if (!formData.prioridad) {
      newErrors.prioridad = "La prioridad es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    const payload = {
      nombre: formData.numero,
      fecha_creacion: getFechaIsoCdmx(),
      cliente: formData.cliente,
      fecha_inicio: formData.fechaInicio,
      representante: formData.representante,
      prioridad: formData.prioridad,
      id_usuario: "",
    };

    const response = await crearNumero(payload);
    if(response.tipoError !== 0){
      alert("Ocurrio un error al guardar numero, intentalo mas tarde");
      setLoading(false);
      return;
    }
      setDialogOpen(true);
      setLoading(false);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    navigate("/");
  };

  if (initialLoading) {
    return (
      <MainCard title="Solicitud de Número de Proyecto">
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={5}>
            <Skeleton variant="rectangular" width="100%" height={56} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Skeleton variant="rectangular" width="100%" height={56} />
          </Grid>
          <Grid item xs={12} sm={5}>
            <Skeleton variant="rectangular" width="100%" height={56} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Skeleton variant="rectangular" width="100%" height={56} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Skeleton variant="rectangular" width="100%" height={56} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Skeleton variant="rectangular" width="100%" height={56} />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Skeleton variant="rectangular" width="100%" height={36} sx={{ borderRadius: "50px" }} />
          </Grid>
        </Grid>
      </MainCard>
    );
  }

  return (
    <MainCard title="Solicitud de Número de Proyecto">
      {!isOnline && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <AlertTitle>Advertencia</AlertTitle>
          Parece que no estás conectado a Internet. Por favor, verifica tu conexión.
        </Alert>
      )}
      <Grid container spacing={4} justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={5}>
          <TextField fullWidth label="Nom.Act.O pry" variant="outlined" InputLabelProps={{ shrink: true }} InputProps={{ readOnly: true }} value={numero} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="Fecha de creación" type="date" variant="outlined" InputLabelProps={{ shrink: true }} InputProps={{ readOnly: true }} value={formData.fechaCreacion} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField 
            fullWidth 
            label="Cliente" 
            variant="outlined" 
            select 
            name="cliente" 
            value={formData.cliente} 
            onChange={handleChange}
            error={!!errors.cliente}
            helperText={errors.cliente}
          >
            {data.clientes.map((cliente, index) => (
              <MenuItem key={index} value={cliente.nombre}>{cliente.nombre}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField 
            fullWidth 
            label="Fecha de inicio" 
            type="date" 
            variant="outlined" 
            InputLabelProps={{ shrink: true }} 
            name="fechaInicio" 
            value={formData.fechaInicio} 
            onChange={handleChange}
            error={!!errors.fechaInicio}
            helperText={errors.fechaInicio}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField 
            fullWidth 
            label="Representante" 
            variant="outlined" 
            select 
            name="representante" 
            value={formData.representante} 
            onChange={handleChange} 
            disabled={!formData.cliente}
            error={!!errors.representante}
            helperText={errors.representante}
          >
            {representantes.map((representante, index) => (
              <MenuItem key={index} value={representante}>{representante}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={3}> 
          <TextField 
            fullWidth 
            label="Prioridad" 
            variant="outlined" 
            select 
            name="prioridad" 
            value={formData.prioridad} 
            onChange={handleChange}
            error={!!errors.prioridad}
            helperText={errors.prioridad}
            sx={{
              '& .MuiOutlinedInput-input': {
                color: formData.prioridad === "alta" ? "red" : 
                formData.prioridad === "media" ? "#FFA500" :
                formData.prioridad === "baja" ? "green" : "inherit",
                fontWeight: "normal",
              }
            }}
          >
            <MenuItem value="alta" sx={{ color: "red", fontWeight: "normal" }}>
              Alta 
            </MenuItem>
            <MenuItem value="media" sx={{ color: "#FFA500", fontWeight: "normal" }}>
              Media 
            </MenuItem>
            <MenuItem value="baja" sx={{ color: "green", fontWeight: "normal" }}>
              Baja 
            </MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={2}>
          <Button fullWidth variant="contained" color="primary" sx={{ borderRadius: "50px" }} onClick={handleSave} disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Aceptar"}
          </Button>
        </Grid>
      </Grid>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Éxito</DialogTitle>
        <DialogContent>El Número se ha Creado con Exito</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Aceptar</Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default CrearNumero;