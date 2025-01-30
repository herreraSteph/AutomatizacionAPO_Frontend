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
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "40px" }}>
          <Button variant="contained" sx={{ backgroundColor: "#060336", color: "white", padding: "16px 40px", fontSize: "1rem", borderRadius: "30px", width: "20%" }}>Guardar</Button>
        </div>
      </Paper>
    </div>
  );
};

export default DescripcionMaterial;
