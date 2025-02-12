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
  const [condicionSeguridad, setCondicionSeguridad] = useState("");
  const [seguridadSeleccionada, setSeguridadSeleccionada] = useState("");
  const [file, setFile] = useState(null);
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

  const handleCondicionSeguridadChange = (event) => {
    setCondicionSeguridad(event.target.value);
  };

  const handleSeguridadChange = (event) => {
    setSeguridadSeleccionada(event.target.value);
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
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
      condicionSeguridad,
      seguridadSeleccionada,
      file,
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
              fullWidth
              label="Tipo de Acabados"
              variant="outlined"
              value={tipoAcabado}  // Valor de Tipo de Acabado
              onChange={handleTipoAcabadoChange}  // Actualizamos el estado de Tipo de Acabado
              sx={{ backgroundColor: "#fffff" }}
            />
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

      <MainCard title="Detalles Adicionales" sx={{ mt: 2 }}>
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
                <MenuItem value={1}>Area 1</MenuItem>
                <MenuItem value={2}>Area 2</MenuItem>
                <MenuItem value={3}>Area 3</MenuItem>
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
                <MenuItem value={1}>Edificio A</MenuItem>
                <MenuItem value={2}>Edificio B</MenuItem>
                <MenuItem value={3}>Edificio C</MenuItem>
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

          {/* Condición de Seguridad */}
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Condición de Seguridad</InputLabel>
              <Select
                value={condicionSeguridad}
                onChange={handleCondicionSeguridadChange}
                label="Condición de Seguridad"
                sx={{ backgroundColor: "#F2ECF5" }}
              >
                <MenuItem value={1}>Condición A</MenuItem>
                <MenuItem value={2}>Condición B</MenuItem>
                <MenuItem value={3}>Condición C</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Radio Buttons */}
          <FormControl component="fieldset" sx={{ marginTop: 2 }}>
            <RadioGroup
              aria-label="seguridad"
              name="seguridad"
              value={seguridadSeleccionada}
              onChange={handleSeguridadChange}
              row
              sx={{ justifyContent: "flex-end", width: "60%" }}
            >
              <FormControlLabel value="Interior" control={<Radio />} label="Interior" />
              <FormControlLabel value="Exterior" control={<Radio />} label="Exterior" />
            </RadioGroup>
          </FormControl>

          {/* Input File */}
          <FormControl 
            sx={{ 
              marginTop: 2, 
              width: "80%", 
              display: "flex", 
              justifyContent: "flex-end",
              alignItems: "flex-end" 
            }}
          > 
            <Button
              variant="outlined"
              component="label"
              sx={{ 
                textTransform: "none", 
                width: "100%",  
                maxWidth: "400px", 
                padding: "10px 12px", 
                fontSize: "1rem" 
              }}
            >
              Subir archivo
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
          </FormControl>

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
        </Grid>
      </MainCard>
    </Box>
  );
};

export default CPC;
