import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  TablePagination,
  Typography,
  Box,
  TextField
} from "@mui/material";
import { agregarMaterial } from "../../api/Construccion";
import { useNavigate, useLocation } from "react-router-dom";

const ListaMaterial = ({ selectedMaterials = [], setSelectedMaterials, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const navigate = useNavigate();
  const location = useLocation();
  const { id_proyecto } = location.state || {};

  const handleSave = async () => {
    setLoading(true);
    try {
      await agregarMaterial(selectedMaterials, id_proyecto);
      navigate("/"); // Redirige después de guardar
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (index, value) => {
    const newMaterials = [...selectedMaterials];
    newMaterials[index].cantidad = value;
    setSelectedMaterials(newMaterials);
  };

  return (
    <div>
      {/* Título */}
      <Typography variant="h7" component="h1" sx={{ mb: 3, color: "#060336", fontWeight: "bold" }}>
        Listado Materiales
      </Typography>

      {/* Tabla de materiales */}
      <TableContainer component={Paper} sx={{ 
        borderRadius: 2, 
        boxShadow: 3, 
        mb: 3,
        "& .MuiTableHead-root": {
          backgroundColor: "#060336"
        }
      }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>COD</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>DESCRIPCIÓN CORTA</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>DESCRIPCIÓN LARGA</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>UNIDAD</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>FAMILIA</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>CANTIDAD</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedMaterials.length > 0 ? (
              selectedMaterials
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={row.cod}>
                    <TableCell>{row.cod}</TableCell>
                    <TableCell>{row.corta}</TableCell>
                    <TableCell>{row.larga}</TableCell>
                    <TableCell>{row.unidad}</TableCell>
                    <TableCell>{row.familia}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={row.cantidad || ""}
                        onChange={(e) => handleQuantityChange(
                          page * rowsPerPage + index, 
                          e.target.value
                        )}
                        size="small"
                        inputProps={{ 
                          min: 0,
                          style: { 
                            width: '80px',
                            textAlign: 'center'
                          } 
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hay materiales seleccionados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {selectedMaterials.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={selectedMaterials.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        )}
      </TableContainer>

      {/* Botón de Guardar */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading || selectedMaterials.length === 0}
          sx={{
            backgroundColor: "#060336",
            color: "white",
            padding: "8px 20px",
            borderRadius: "20px",
            minWidth: "120px",
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Guardar"}
        </Button>
      </div>
    </div>
  );
};

export default ListaMaterial;