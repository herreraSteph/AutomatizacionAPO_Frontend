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
  const [numero, setNumero] = useState("SM25-001");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    numero: "",
    cliente: "",
    fechaInicio: "",
    representante: "",
    prioridad: "",
    area: ""
  });

  useEffect(() => {
    const storedNumeros = JSON.parse(localStorage.getItem("numeros")) || [];
    if (storedNumeros.length > 0) {
      const lastNumero = storedNumeros[storedNumeros.length - 1];
      const num = parseInt(lastNumero.split("-")[1]) + 1;
      setNumero(`SM25-${String(num).padStart(3, "0")}`);
    }
    setFormData((prevData) => ({ ...prevData, fechaCreacion: new Date().toISOString().split("T")[0] }));
  }, []);

  useEffect(() => {
    setFormData((prevData) => ({ ...prevData, numero }));
  }, [numero]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      const storedNumeros = JSON.parse(localStorage.getItem("numeros")) || [];
      const storedData = JSON.parse(localStorage.getItem("datos")) || [];
      
      storedNumeros.push(numero);
      storedData.push(formData);
  
      localStorage.setItem("numeros", JSON.stringify(storedNumeros));
      localStorage.setItem("datos", JSON.stringify(storedData));
      
      const num = parseInt(numero.split("-")[1]) + 1;
      setNumero(`SM25-${String(num).padStart(3, "0")}`);
      
      setLoading(false);
      setDialogOpen(true);
    }, 2000);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    navigate("/");
  };

  return (
    <MainCard title="Creacion de Numero">
      <Grid container spacing={4} justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={5}>
          <TextField fullWidth label="Nom.Act.O pry" variant="outlined" InputLabelProps={{ shrink: true }} InputProps={{ readOnly: true }} value={numero} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="Fecha de creacion" type="date" variant="outlined" InputLabelProps={{ shrink: true }} InputProps={{ readOnly: true }} value={formData.fechaCreacion} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField fullWidth label="Cliente" variant="outlined" select name="cliente" onChange={handleChange}>
            <MenuItem value="option1">Option 1</MenuItem>
            <MenuItem value="option2">Option 2</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="Fecha de inicio" type="date" variant="outlined" InputLabelProps={{ shrink: true }} name="fechaInicio" onChange={handleChange} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField fullWidth label="Representante" variant="outlined" select name="representante" onChange={handleChange}>
            <MenuItem value="option1">Option 1</MenuItem>
            <MenuItem value="option2">Option 2</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="Prioridad" variant="outlined" select name="prioridad" onChange={handleChange}>
            <MenuItem value="option1">Option 1</MenuItem>
            <MenuItem value="option2">Option 2</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Area" variant="outlined" select name="area" onChange={handleChange}>
            <MenuItem value="option1">Option 1</MenuItem>
            <MenuItem value="option2">Option 2</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={3}>
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
