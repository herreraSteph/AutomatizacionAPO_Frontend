import React from "react";
import { TextField, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const DescripcionMaterial = () => {
  return (
    <div style={{ padding: "20px" }}>
      {/* Campo de búsqueda */}


      {/* Contenedor principal */}
      <Paper sx={{ padding: 2, borderRadius: 2 }}>
        {/* Selectores */}
        <div style={{ display: "flex", justifyContent: "center", gap: "30px", marginBottom: "30px" }}>
          {[1, 2, 3].map((_, index) => (
            <Select key={index} displayEmpty variant="outlined" sx={{ width: "350px", height: "50px" }}>
              <MenuItem value="" disabled>Seleccionar</MenuItem>
              <MenuItem value={1}>Opción 1</MenuItem>
              <MenuItem value={2}>Opción 2</MenuItem>
            </Select>
          ))}
        </div>

        {/* Tabla */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Descripción del Material</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Unidad</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(4)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>Material {index + 1}</TableCell>
                  <TableCell>{Math.floor(Math.random() * 10) + 1}</TableCell>
                  <TableCell>kg</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Botón Guardar */}
       {/* Botón Guardar y Descargar */}
<div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "40px" }}>
  {/* Botón Guardar */}
  <Button
    variant="contained"
    sx={{
      backgroundColor: "#060336", // Color azul marino
      color: "white",
      padding: "8px 20px", // Haciendo el botón más delgado
      fontSize: "0.9rem", // Reducir el tamaño de la fuente
      borderRadius: "20px", // Bordes redondeados
      width: "auto", // Ajuste automático del ancho
    }}
  >
    Guardar
  </Button>

  {/* Botón Descargar */}
  <Button
    variant="outlined"
    sx={{
      borderColor: "#060336", // Borde azul marino
      color: "#060336", // Texto azul marino
      padding: "8px 20px", // Haciendo el botón más delgado
      fontSize: "0.9rem", // Reducir el tamaño de la fuente
      borderRadius: "20px", // Bordes redondeados
      width: "auto", // Ajuste automático del ancho
    }}
  >
    Descargar
  </Button>
</div>

      </Paper>
    </div>
  );
};

export default DescripcionMaterial;
