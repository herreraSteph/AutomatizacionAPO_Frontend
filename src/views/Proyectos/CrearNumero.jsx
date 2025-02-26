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
import MainCard from "ui-component/cards/MainCard";
import data from "../../data/clientes";

const CrearNumero = () => {
  const navigate = useNavigate();
  const [numero, setNumero] = useState("SM25-005");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    numero: "",
    cliente: "",
    fechaInicio: "",
    representante: "",
    prioridad: "",
  });
  const [representantes, setRepresentantes] = useState([]);

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
  

  const handleSave = async () => {
    setLoading(true);
    const idUsuario = localStorage.getItem("message");

    if (!idUsuario) {
      alert("No se encontró el ID de usuario en el localStorage. Por favor, inicia sesión nuevamente.");
      setLoading(false);
      return;
    }
    const payload = {
      nombre: formData.numero,
      fecha_creacion: getFechaIsoCdmx(),
      cliente: formData.cliente,
      fecha_inicio: formData.fechaInicio,
      representante: formData.representante,
      prioridad: formData.prioridad,
      id_usuario: idUsuario,
    };

    try {
      const response = await fetch("https://automatizacionapo-backend.onrender.com/api/Construccion/Crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Error al enviar los datos a la API");
      
      const result = await response.json();
      console.log("Respuesta de la API:", result);

      const num = parseInt(numero.split("-")[1]) + 1;
      setNumero(`SM25-${String(num).padStart(3, "0")}`);
      setDialogOpen(true);
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al enviar los datos. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    navigate("/");
  };

  return (
    <MainCard title="Solicitud de Número de Proyecto">
      <Grid container spacing={4} justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={5}>
          <TextField fullWidth label="Nom.Act.O pry" variant="outlined" InputLabelProps={{ shrink: true }} InputProps={{ readOnly: true }} value={numero} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="Fecha de creación" type="date" variant="outlined" InputLabelProps={{ shrink: true }} InputProps={{ readOnly: true }} value={formData.fechaCreacion} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField fullWidth label="Cliente" variant="outlined" select name="cliente" value={formData.cliente} onChange={handleChange}>
            {data.clientes.map((cliente, index) => (
              <MenuItem key={index} value={cliente.nombre}>{cliente.nombre}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="Fecha de inicio" type="date" variant="outlined" InputLabelProps={{ shrink: true }} name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="Representante" variant="outlined" select name="representante" value={formData.representante} onChange={handleChange} disabled={!formData.cliente}>
            {representantes.map((representante, index) => (
              <MenuItem key={index} value={representante}>{representante}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField fullWidth label="Prioridad" variant="outlined" select name="prioridad" value={formData.prioridad} onChange={handleChange}>
            <MenuItem value="alta">Alta</MenuItem>
            <MenuItem value="media">Media</MenuItem>
            <MenuItem value="baja">Baja</MenuItem>
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
        <DialogContent>El número se ha creado con éxito.</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Aceptar</Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default CrearNumero;