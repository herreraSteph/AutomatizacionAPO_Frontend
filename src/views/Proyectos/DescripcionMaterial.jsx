import React, { useState, useEffect } from "react"; // Añadir useEffect
import {
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Snackbar,
  Alert, // Importar Alert
  AlertTitle, // Importar AlertTitle
  TablePagination,
  TextField,
} from "@mui/material";
import { agregarMaterial } from "../../api/Construccion";
import { useNavigate, useLocation } from "react-router-dom";

const DescripcionMaterial = () => {
  const [selectedOption1, setSelectedOption1] = useState("");
  const [selectedOption2, setSelectedOption2] = useState("");
  const [selectedOption3, setSelectedOption3] = useState("");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isOnline, setIsOnline] = useState(navigator.onLine); // Estado para verificar la conexión a Internet
  const navigate = useNavigate();
  const location = useLocation();
  const { id_proyecto, Status } = location.state || {};
  // Verificar la conexión a Internet
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

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

  const handleSave = async () => {
    setLoading(true);
    try {
      const materiales = tableData.map((row) => ({
        descripcion: row.descripcion,
        cantidad: row.cantidad,
        unidad: row.unidad,
      }));

      const response = await agregarMaterial(materiales, id_proyecto);

      if (response.tipoError === 0) {
        setSnackbarMessage("Los materiales se guardaron correctamente.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setSnackbarMessage("Hubo un error al guardar los materiales.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Hubo un error al guardar los materiales.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCantidadChange = (event, id) => {
    const newCantidad = event.target.value;
    const updatedTableData = tableData.map((row) =>
      row.id === id ? { ...row, cantidad: newCantidad } : row
    );
    setTableData(updatedTableData);
  };

  const handleUnidadChange = (event, id) => {
    const newUnidad = event.target.value;
    const updatedTableData = tableData.map((row) =>
      row.id === id ? { ...row, unidad: newUnidad } : row
    );
    setTableData(updatedTableData);
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Alerta de conexión a Internet */}
      {!isOnline && (
        <Alert severity="warning" sx={{ marginBottom: 2 }}>
          <AlertTitle>Advertencia</AlertTitle>
          Parece que no estás conectado a Internet.
        </Alert>
      )}

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
            Agregar a la Tabla
          </Button>
        </div>

        {/* Tabla */}
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#060336" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Id</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Descripción del Material</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Cantidad</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Unidad</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow key={row.id} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.descripcion}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={row.cantidad}
                      onChange={(event) => handleCantidadChange(event, row.id)}
                      variant="outlined"
                      size="small"
                      sx={{ width: "100px" }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={row.unidad}
                      onChange={(event) => handleUnidadChange(event, row.id)}
                      variant="outlined"
                      size="small"
                      sx={{ width: "100px" }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 50, 60]}
            component="div"
            count={tableData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>

        {/* Botón Guardar y Descargar */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "40px" }}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading || tableData.length === 0}
            sx={{
              backgroundColor: "#060336",
              color: "white",
              padding: "8px 20px",
              fontSize: "0.9rem",
              borderRadius: "20px",
              minWidth: "120px",
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Guardar"}
          </Button>

        
        </div>
      </Paper>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DescripcionMaterial;