// material-ui
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
// project imports
import MainCard from "ui-component/cards/MainCard";

const CrearNumero = () => {
  const navigate = useNavigate();
  const [numero, setNumero] = useState("SM25-001"); // Estado para el número generado
  const [loading, setLoading] = useState(false); // Estado para el indicador de carga
  const [dialogOpen, setDialogOpen] = useState(false); // Estado para controlar el diálogo
  const [formData, setFormData] = useState({
    numero: "", // Número generado
    cliente: "", // Cliente seleccionado
    fechaInicio: "", // Fecha de inicio
    representante: "", // Representante seleccionado
    prioridad: "", // Prioridad seleccionada
  });

  // Efecto para establecer la fecha de creación al cargar el componente
  useEffect(() => {
    const fechaCreacion = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD
    setFormData((prevData) => ({ ...prevData, fechaCreacion }));
  }, []);

  // Efecto para actualizar el número en el estado formData
  useEffect(() => {
    setFormData((prevData) => ({ ...prevData, numero }));
  }, [numero]);

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Función para simular el guardado y generar un nuevo número
  const handleSave = () => {
    setLoading(true); // Activar el indicador de carga
    setTimeout(() => {
      // Generar un nuevo número incrementando el último valor
      const num = parseInt(numero.split("-")[1]) + 1;
      setNumero(`SM25-${String(num).padStart(3, "0")}`);

      setLoading(false); // Desactivar el indicador de carga
      setDialogOpen(true); // Abrir el diálogo de éxito
    }, 2000); // Simular una operación asíncrona de 2 segundos
  };

  // Función para cerrar el diálogo y redirigir al inicio
  const handleCloseDialog = () => {
    setDialogOpen(false);
    navigate("/");
  };

  return (
    <MainCard title="Solicitud de Número de Proyecto">
      <Grid container spacing={4} justifyContent="center" alignItems="center">
        {/* Campo para el número generado */}
        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth
            label="Nom.Act.O pry"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: true }}
            value={numero}
          />
        </Grid>

        {/* Campo para la fecha de creación */}
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Fecha de creación"
            type="date"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: true }}
            value={formData.fechaCreacion}
          />
        </Grid>

        {/* Campo para seleccionar el cliente */}
        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth
            label="Cliente"
            variant="outlined"
            select
            name="cliente"
            value={formData.cliente}
            onChange={handleChange}
          >
            <MenuItem value="option1">Option 1</MenuItem>
            <MenuItem value="option2">Option 2</MenuItem>
          </TextField>
        </Grid>

        {/* Campo para la fecha de inicio */}
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
          />
        </Grid>

        {/* Campo para seleccionar el representante */}
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Representante"
            variant="outlined"
            select
            name="representante"
            value={formData.representante}
            onChange={handleChange}
          >
            <MenuItem value="option1">Option 1</MenuItem>
            <MenuItem value="option2">Option 2</MenuItem>
          </TextField>
        </Grid>

        {/* Campo para seleccionar la prioridad */}
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Prioridad"
            variant="outlined"
            select
            name="prioridad"
            value={formData.prioridad}
            onChange={handleChange}
          >
            <MenuItem value="option1">Option 1</MenuItem>
            <MenuItem value="option2">Option 2</MenuItem>
          </TextField>
        </Grid>

        {/* Botón para guardar */}
        <Grid item xs={12} sm={2}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ borderRadius: "50px" }}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Aceptar"}
          </Button>
        </Grid>
      </Grid>

      {/* Diálogo de éxito */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Éxito</DialogTitle>
        <DialogContent>El número se ha creado con éxito.</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default CrearNumero;