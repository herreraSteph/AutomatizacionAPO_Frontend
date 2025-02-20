import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GradingIcon from '@mui/icons-material/Grading';
import {
  Typography,
  TextField,
  Grid,
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
  Button,
} from "@mui/material";
import {
  Engineering,
  Build,
  PrecisionManufacturing,
  Handyman,
  LocalAtm,
  Support,
} from "@mui/icons-material";
import MainCard from "ui-component/cards/MainCard";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";

const options = [
  { label: "Ingeniería", icon: <Engineering /> },
  { label: "Fabricación", icon: <Build /> },
  { label: "Suministro", icon: <PrecisionManufacturing /> },
  { label: "Instalación", icon: <Handyman /> },
  { label: "Libranza", icon: <LocalAtm /> },
  { label: "Soportería", icon: <Support /> },
];

const CPC = () => {
  const [selected, setSelected] = useState([]);
  const [placement, setPlacement] = useState("");
  const [edificio, setEdificio] = useState("");
  const [equipoReferencia, setEquipoReferencia] = useState("");
  const [ubicacion, setUbicacion] = useState(""); // Estado para Interior/Exterior
  const [seguridadSeleccionada, setSeguridadSeleccionada] = useState(""); // Estado para Condición de Seguridad
  const [numeros, setNumeros] = useState([]);
  const [selectedNumero, setSelectedNumero] = useState("");
  const [tipoAcabado, setTipoAcabado] = useState("");  // Estado para Tipo de Acabado
  const [descripcion, setDescripcion] = useState("");  // Estado para Descripción

  const navigate = useNavigate();

  useEffect(() => {
    const storedNumeros = JSON.parse(localStorage.getItem("numeros")) || [];
    setNumeros(storedNumeros);
  }, []);

  const handleSelection = (event, newSelection) => {
    setSelected(newSelection);
  };

  const handlePlacementChange = (event) => {
    setPlacement(event.target.value);
  };

  const handleEdificioChange = (event) => {
    setEdificio(event.target.value);
  };

  const handleEquipoReferenciaChange = (event) => {
    setEquipoReferencia(event.target.value);
  };

  const handleUbicacionChange = (event) => {
    setUbicacion(event.target.value);
  };

  const handleSeguridadChange = (event) => {
    setSeguridadSeleccionada(event.target.value);
  };

  const handleTipoAcabadoChange = (event) => {
    setTipoAcabado(event.target.value);
  };

  const handleDescripcionChange = (event) => {
    setDescripcion(event.target.value);
  };

  const handleSave = () => {
    const formData = {
      selectedNumero,
      placement,
      edificio,
      equipoReferencia,
      ubicacion,
      seguridadSeleccionada,
      selected,
      tipoAcabado,  // Incluimos el Tipo de Acabado
      descripcion,   // Incluimos la Descripción
    };

    // Guardamos el objeto en localStorage
    localStorage.setItem("cpcData", JSON.stringify(formData));

    // Navegar a la página de Cronograma
    navigate('/proyectos/cronograma');
  };

  return (
    <Box sx={{ p: 2 }}>
      <MainCard title="Creación de CPC" sx={{ textAlign: "center" }}>
        <Grid container spacing={2} alignItems="center">
          {/* Select para Nom. Act.O pry */}
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Nom. Act.O pry</InputLabel>
              <Select
                value={selectedNumero}
                onChange={(event) => setSelectedNumero(event.target.value)}
                label="Nom. Act.O pry"
                sx={{ backgroundColor: "#fffff" }}
              >
                {numeros.map((num, index) => (
                  <MenuItem key={index} value={num}>{num}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Floating Label para Tipo de Acabados */}
          <Grid item xs={6}>
  <TextField
    select
    fullWidth
    label="Tipo de Acabados"
    variant="outlined"
    value={tipoAcabado}  // Valor de Tipo de Acabado
    onChange={handleTipoAcabadoChange}  // Actualizamos el estado de Tipo de Acabado
    sx={{ backgroundColor: "#fffff" }}
  >
    <MenuItem value="ALQUIDALICO">ALQUIDALICO</MenuItem>
    <MenuItem value="AISLAMIENTO">AISLAMIENTO</MenuItem>
    <MenuItem value="EPOXICO">EPOXICO</MenuItem>
    <MenuItem value="GALVANIZADO EN FRIO">GALVANIZADO EN FRIO</MenuItem>
    <MenuItem value="GALVANIZADO POR INMERSION EN CALIENTE">GALVANIZADO POR INMERSION EN CALIENTE</MenuItem>
    <MenuItem value="NA">NA</MenuItem>
  </TextField>
</Grid>

          {/* Detalles de Diseño y materiales en Anexo */}
          <Grid item xs={12} display="flex" justifyContent="flex-end">
            <FormControl>
              <Typography variant="subtitle1" sx={{ textAlign: "center", mb: 1 }}>
                Detalles de Diseño y materiales en Anexo
              </Typography>
              <ToggleButtonGroup
                value={selected}
                onChange={handleSelection}
                sx={{ display: "flex", flexWrap: "wrap" }}
              >
                {options.map((item) => (
                  <ToggleButton
                    key={item.label}
                    value={item.label}
                    sx={{
                      borderRadius: "50%",
                      padding: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: "20px",
                      marginLeft: "40px",
                      color: "black",
                      "&.Mui-selected": {
                        backgroundColor: "#060336",
                        color: "#fff",
                      },
                    }}
                  >
                    {item.icon}
                    <Typography variant="caption">{item.label}</Typography>
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} display="flex" justifyContent="flex-start">
            <TextField
              fullWidth
              label="Descripción"
              variant="outlined"
              multiline
              rows={4}
              value={descripcion}  // Valor de Descripción
              onChange={handleDescripcionChange}  // Actualizamos el estado de Descripción
              sx={{
                backgroundColor: "#fffff",
                maxWidth: "400px",
                height: "100%",
                marginTop: "-115px",  // Ajusta este valor si necesitas moverlo más arriba
              }}
            />
          </Grid>
        </Grid>
      </MainCard>

      {/* Sección de Ubicación */}
      <MainCard title="Ubicación" sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {/* Placement Area */}
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Area</InputLabel>
              <Select
                value={placement}
                onChange={handlePlacementChange}
                label="Area"
                sx={{ backgroundColor: "#F2ECF5" }}
              >
                <MenuItem value="CRUSH">CRUSH</MenuItem>
<MenuItem value="CORN MILLING">CORN MILLING</MenuItem>
<MenuItem value="REFINERIA">REFINERIA</MenuItem>
<MenuItem value="EMPAQUE">EMPAQUE</MenuItem>
<MenuItem value="CONTRATISTAS">CONTRATISTAS</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Edificio */}
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Edificio</InputLabel>
              <Select
                value={edificio}
                onChange={handleEdificioChange}
                label="Edificio"
                sx={{ backgroundColor: "#F2ECF5" }}
              >
                <MenuItem value="PREPARACION">PREPARACION</MenuItem>
<MenuItem value="PRELIMPIA">PRELIMPIA</MenuItem>
<MenuItem value="REFINERIA">REFINERIA</MenuItem>
<MenuItem value="EXTRACCION">EXTRACCION</MenuItem>
<MenuItem value="CALDERAS">CALDERAS</MenuItem>
<MenuItem value="EMPAQUE">EMPAQUE</MenuItem>
<MenuItem value="HARINAS">HARINAS</MenuItem>
<MenuItem value="CARRO TOLVAS">CARRO TOLVAS</MenuItem>
<MenuItem value="LAVADO DE PIPAS">LAVADO DE PIPAS</MenuItem>
<MenuItem value="CARGA DE PIPAS">CARGA DE PIPAS</MenuItem>
<MenuItem value="DESCARGA DE PIPAS">DESCARGA DE PIPAS</MenuItem>
<MenuItem value="BLANQUEO REFINERIA">BLANQUEO REFINERIA</MenuItem>
<MenuItem value="MEZZANINE REFINERIA">MEZZANINE REFINERIA</MenuItem>
<MenuItem value="PLANTA BAJA REFINERIA">PLANTA BAJA REFINERIA</MenuItem>
<MenuItem value="EDIF. DESMET">EDIF. DESMET</MenuItem>
<MenuItem value="EDIF. DEODO VOTATOR">EDIF. DEODO VOTATOR</MenuItem>
<MenuItem value="DIQUE PRODUCTO TERMINADO">DIQUE PRODUCTO TERMINADO</MenuItem>
<MenuItem value="DIQUE DE CRUDO">DIQUE DE CRUDO</MenuItem>
<MenuItem value="HIDROGENACION">HIDROGENACION</MenuItem>
<MenuItem value="INTERESTERIFICADO">INTERESTERIFICADO</MenuItem>
<MenuItem value="PTAR HARINAS">PTAR HARINAS</MenuItem>
<MenuItem value="PTAR CORN MILLING">PTAR CORN MILLING</MenuItem>
<MenuItem value="OFICINAS GENERALES">OFICINAS GENERALES</MenuItem>
<MenuItem value="VELARIA">VELARIA</MenuItem>
<MenuItem value="DAF">DAF</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Equipo de Referencia */}
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Equipo de Referencia</InputLabel>
              <Select
                value={equipoReferencia}
                onChange={handleEquipoReferenciaChange}
                label="Equipo de Referencia"
                sx={{ backgroundColor: "#F2ECF5" }}
              >
                <MenuItem value={1}>Equipo X</MenuItem>
                <MenuItem value={2}>Equipo Y</MenuItem>
                <MenuItem value={3}>Equipo Z</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* RadioGroup para Interior/Exterior */}
          <Grid item xs={6}>
            <FormControl component="fieldset">
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Ubicación
              </Typography>
              <RadioGroup
                aria-label="ubicacion"
                name="ubicacion"
                value={ubicacion}
                onChange={handleUbicacionChange}
              >
                <FormControlLabel value="Interior" control={<Radio />} label="Interior" />
                <FormControlLabel value="Exterior" control={<Radio />} label="Exterior" />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      </MainCard>

      {/* Sección de Condición de Seguridad */}
      <MainCard title="Condición de Seguridad" sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {/* RadioGroup para Condición de Seguridad */}
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="seguridad"
                name="seguridad"
                value={seguridadSeleccionada}
                onChange={handleSeguridadChange}
              >
                <FormControlLabel value="Trabajo en altura" control={<Radio />} label="Trabajo en altura" />
                <FormControlLabel value="Espacio confinado" control={<Radio />} label="Espacio confinado" />
                <FormControlLabel value="Medidores atmosf." control={<Radio />} label="Medidores atmosf." />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      </MainCard>

      {/* Botón Guardar */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", width: "100%" }}>
        <Button 
          variant="contained" 
          onClick={handleSave} 
          sx={{ backgroundColor: "#060336", width: "15%" }}
        >
          Guardar
        </Button>
      </div>
    </Box>
  );
};

export default CPC;