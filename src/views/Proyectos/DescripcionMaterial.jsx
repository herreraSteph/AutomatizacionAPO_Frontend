import React, { useState } from "react";
import { TextField, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const DescripcionMaterial = () => {
  const [selectedOption1, setSelectedOption1] = useState("");
  const [selectedOption2, setSelectedOption2] = useState("");
  const [selectedOption3, setSelectedOption3] = useState("");
  const [tableData, setTableData] = useState([]);

  const options1 = ["Opción 1", "Opción 2"];
  const options2 = {
    "Opción 1": ["Subopción 1.1", "Subopción 1.2"],
    "Opción 2": ["Subopción 2.1", "Subopción 2.2"],
  };
  const options3 = {
    "Subopción 1.1": ["Material 1.1.1", "Material 1.1.2"],
    "Subopción 1.2": ["Material 1.2.1", "Material 1.2.2"],
    "Subopción 2.1": ["Material 2.1.1", "Material 2.1.2"],
    "Subopción 2.2": ["Material 2.2.1", "Material 2.2.2"],
  };

  const handleOption1Change = (event) => {
    setSelectedOption1(event.target.value);
    setSelectedOption2("");
    setSelectedOption3("");
  };

  const handleOption2Change = (event) => {
    setSelectedOption2(event.target.value);
    setSelectedOption3("");
  };

  const handleOption3Change = (event) => {
    setSelectedOption3(event.target.value);
  };

  const handleAddToTable = () => {
    if (selectedOption3) {
      const newRow = {
        id: tableData.length + 1,
        descripcion: selectedOption3,
        cantidad: Math.floor(Math.random() * 10) + 1,
        unidad: "kg",
      };
      setTableData([...tableData, newRow]);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Paper sx={{ padding: 2, borderRadius: 2 }}>
        {/* Selectores */}
        <div style={{ display: "flex", justifyContent: "center", gap: "30px", marginBottom: "30px" }}>
          <Select
            value={selectedOption1}
            onChange={handleOption1Change}
            displayEmpty
            variant="outlined"
            sx={{ width: "350px", height: "50px" }}
          >
            <MenuItem value="" disabled>Seleccionar</MenuItem>
            {options1.map((option, index) => (
              <MenuItem key={index} value={option}>{option}</MenuItem>
            ))}
          </Select>

          <Select
            value={selectedOption2}
            onChange={handleOption2Change}
            displayEmpty
            variant="outlined"
            sx={{ width: "350px", height: "50px" }}
            disabled={!selectedOption1}
          >
            <MenuItem value="" disabled>Seleccionar</MenuItem>
            {selectedOption1 && options2[selectedOption1].map((option, index) => (
              <MenuItem key={index} value={option}>{option}</MenuItem>
            ))}
          </Select>

          <Select
            value={selectedOption3}
            onChange={handleOption3Change}
            displayEmpty
            variant="outlined"
            sx={{ width: "350px", height: "50px" }}
            disabled={!selectedOption2}
          >
            <MenuItem value="" disabled>Seleccionar</MenuItem>
            {selectedOption2 && options3[selectedOption2].map((option, index) => (
              <MenuItem key={index} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </div>

        {/* Botón para agregar a la tabla */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
          <Button
            variant="contained"
            onClick={handleAddToTable}
            disabled={!selectedOption3}
            sx={{
              backgroundColor: "#060336",
              color: "white",
              padding: "8px 20px",
              fontSize: "0.9rem",
              borderRadius: "20px",
            }}
          >
            Agregar a la tabla
          </Button>
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
              {tableData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.descripcion}</TableCell>
                  <TableCell>{row.cantidad}</TableCell>
                  <TableCell>{row.unidad}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Botón Guardar y Descargar */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "40px" }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#060336",
              color: "white",
              padding: "8px 20px",
              fontSize: "0.9rem",
              borderRadius: "20px",
            }}
          >
            Guardar
          </Button>

          <Button
            variant="outlined"
            sx={{
              borderColor: "#060336",
              color: "#060336",
              padding: "8px 20px",
              fontSize: "0.9rem",
              borderRadius: "20px",
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