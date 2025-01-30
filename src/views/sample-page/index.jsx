import React, { useState } from "react";
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

const SamplePage = () => {
  const [selected, setSelected] = useState([]);
  const [placement, setPlacement] = useState("");
  const [edificio, setEdificio] = useState("");
  const [equipoReferencia, setEquipoReferencia] = useState("");
  const [seguridadSeleccionada, setSeguridadSeleccionada] = useState("");
  const [file, setFile] = useState(null); // Para manejar el archivo cargado

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

  const handleSeguridadChange = (event) => {
    setSeguridadSeleccionada(event.target.value);
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      console.log("Archivo seleccionado:", uploadedFile.name);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Primer Card: Creación de CPC */}
      <MainCard title="Creación de CPC" sx={{ textAlign: "center" }}>
        <Grid container spacing={2} alignItems="center">
          {/* Floating Label para Nom. Act.O pry */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Nom. Act.O pry"
              defaultValue="SM-001"
              variant="outlined"
              sx={{
                backgroundColor: "#F2ECF5",
                "& .MuiInputBase-input": { textAlign: "center", color: "red", fontSize: "1.2rem" },
              }}
            />
          </Grid>

          {/* Floating Label para Tipo de Acabados */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Tipo de Acabados"
              variant="outlined"
              sx={{ backgroundColor: "#F2ECF5" }}
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
              sx={{
                backgroundColor: "#F2ECF5",
                maxWidth: "650px",
                height: "100%",
                marginTop: "-115px",  // Ajusta este valor si necesitas moverlo más arriba
              }}
            />
          </Grid>
        </Grid>
      </MainCard>

      {/* Segundo Card con tres Selects */}
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
              <InputLabel>Condicion de Seguridad</InputLabel>
              <Select
                value={equipoReferencia}
                onChange={handleEquipoReferenciaChange}
                label="Condicion de Seguridad"
                sx={{ backgroundColor: "#F2ECF5" }}
              >
                <MenuItem value={1}>Equipo X</MenuItem>
                <MenuItem value={2}>Equipo Y</MenuItem>
                <MenuItem value={3}>Equipo Z</MenuItem>
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
              sx={{ justifyContent: "flex-end", width: "60%" }} // Alineación a la derecha
            >
              <FormControlLabel value="Interior" control={<Radio />} label="Interior" />
              <FormControlLabel value="Exterior" control={<Radio />} label="Exterior" />
            </RadioGroup>
          </FormControl>

          {/* Input File */}
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <Button
              variant="outlined"
              component="label"
              sx={{ textTransform: "none", width: "auto" }}
            >
              Subir archivo
              <input
                type="file"
                hidden
                onChange={handleFileChange}
              />
            </Button>
          </FormControl>
        </Grid>
      </MainCard>
    </Box>
  );
};

export default SamplePage;
