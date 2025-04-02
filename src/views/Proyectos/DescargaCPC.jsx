import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  IconButton,
  Popover,
  Typography,
  CircularProgress,
  Skeleton,
  Box,
  Alert,
  AlertTitle,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArchiveIcon from "@mui/icons-material/Archive";
import EditIcon from "@mui/icons-material/Edit";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { ObtenerCPC } from "../../api/Construccion";
import { DescargarCPC } from "../../api/Construccion";

const DescargaCPC = () => {
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    nombreActividad: "",
    nombre: "",
    fechaCreacion: "",
    cliente: "",
    fechaInicio: "",
    representante: "",
    prioridad: "",
  });
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [currentFilter, setCurrentFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  useEffect(() => {
    const obtenerDatosCPC = async () => {
      try {
        setDataLoading(true);
        const datosCPC = await ObtenerCPC(true);

        const datosTransformados = datosCPC.map((item) => ({
          id: item.id,
          nombreActividad: item.nombre || "N/A",
          nombre: item.nombre_proyecto || "N/A",
          fechaCreacion: formatDate(item.fecha_creacion),
          cliente: item.cliente || "N/A",
          fechaInicio: formatDate(item.fecha_inicio),
          representante: item.representante || "N/A",
          prioridad: item.prioridad || "N/A",
        }));

        setTableData(datosTransformados);
      } catch (error) {
        console.error("Error al obtener los datos de CPC:", error);
      } finally {
        setDataLoading(false);
      }
    };

    obtenerDatosCPC();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDescargar = async (id) => {
    if (!isOnline) {
      alert("No estás conectado a Internet. No se puede descargar.");
      return;
    }

    setLoading(true);
    try {
      const response = await DescargarCPC(id);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      const contentDisposition = response.headers["content-disposition"] || response.headers["Content-Disposition"];
      let fileName = "documento.pdf";

      if (contentDisposition && contentDisposition.includes("filename=")) {
        fileName = contentDisposition
          .split("filename=")[1]
          .split(";")[0]
          .trim()
          .replace(/['"]/g, "");
      }

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      alert("Error al descargar el archivo. Por favor intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (id) => {
    // Implementa tu lógica de edición aquí
    console.log("Editar elemento con ID:", id);
    alert(`Modo edición para el ID: ${id}`);
  };

  const handleFilterClick = (event, filterName) => {
    setFilterAnchorEl(event.currentTarget);
    setCurrentFilter(filterName);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterChange = (event) => {
    const { value } = event.target;
    setFilters({
      ...filters,
      [currentFilter]: value,
    });
  };

  const filteredData = tableData.filter((row) => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      const rowValue = String(row[key] || "").toLowerCase();
      return rowValue.includes(value.toLowerCase());
    });
  });

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "alta":
        return "#ff0000";
      case "media":
        return "#ff9900";
      case "baja":
        return "#00cc00";
      default:
        return "#000000";
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      {!isOnline && (
        <Alert severity="warning" sx={{ marginBottom: 2 }}>
          <AlertTitle>Advertencia</AlertTitle>
          Parece que no estás conectado a Internet. Algunas funciones pueden no estar disponibles.
        </Alert>
      )}

      <Paper sx={{ padding: 2, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ marginBottom: 3, textAlign: "center", fontWeight: "bold", fontSize: '2rem' }}>
          Lista de CPC Generados
        </Typography>

        {dataLoading ? (
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#060336" }}>
                <TableRow>
                  {["Nombre Actividad", "Nombre Proyecto", "Fecha Creación", "Cliente", "Fecha Inicio", "Representante", "Prioridad", "Editar", "Descargar"].map((header, index) => (
                    <TableCell key={index} sx={{ color: "white", fontWeight: "bold" }}>
                      <Skeleton variant="text" width={100} />
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from({ length: rowsPerPage }).map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {Array.from({ length: 9 }).map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : filteredData.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 4,
              backgroundColor: "#f5f5f5",
              borderRadius: 2,
              boxShadow: 1,
              textAlign: "center",
            }}
          >
            <SearchOffIcon sx={{ fontSize: 60, color: "gray", mb: 2 }} />
            <Typography variant="h6" sx={{ color: "gray" }}>
              No se encontraron datos coincidentes
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
              <Table>
                <TableHead sx={{ backgroundColor: "#060336" }}>
                  <TableRow>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        Nom.Act.O.Pry
                        <IconButton
                          size="small"
                          onClick={(e) => handleFilterClick(e, "nombreActividad")}
                          sx={{ color: "white", marginLeft: 1 }}
                        >
                          <FilterListIcon fontSize="small" />
                        </IconButton>
                      </div>
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        Nombre Proyecto
                        <IconButton
                          size="small"
                          onClick={(e) => handleFilterClick(e, "nombre")}
                          sx={{ color: "white", marginLeft: 1 }}
                        >
                          <FilterListIcon fontSize="small" />
                        </IconButton>
                      </div>
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Fecha Creación
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Cliente
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Fecha Inicio
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Representante
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Prioridad
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Editar
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Descargar
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <TableRow key={row.id} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }}>
                      <TableCell>{row.nombreActividad}</TableCell>
                      <TableCell>{row.nombre}</TableCell>
                      <TableCell>{row.fechaCreacion}</TableCell>
                      <TableCell>{row.cliente}</TableCell>
                      <TableCell>{row.fechaInicio}</TableCell>
                      <TableCell>{row.representante}</TableCell>
                      <TableCell sx={{ color: getPriorityColor(row.prioridad), fontWeight: "bold" }}>
                        {row.prioridad}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleEditar(row.id)}
                          sx={{ color: "#060336" }}
                          aria-label="Editar"
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleDescargar(row.id)}
                          sx={{ color: "#060336" }}
                          disabled={loading || !isOnline}
                          aria-label="Descargar"
                        >
                          {loading ? <CircularProgress size={24} /> : <ArchiveIcon />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={filteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Filas por página:"
              />
            </TableContainer>
          </>
        )}

        <Popover
          open={Boolean(filterAnchorEl)}
          anchorEl={filterAnchorEl}
          onClose={handleFilterClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <Box sx={{ p: 2 }}>
            <TextField
              label={`Filtrar por ${currentFilter}`}
              variant="outlined"
              value={filters[currentFilter] || ""}
              onChange={handleFilterChange}
              size="small"
              autoFocus
            />
          </Box>
        </Popover>
      </Paper>
    </div>
  );
};

export default DescargaCPC;