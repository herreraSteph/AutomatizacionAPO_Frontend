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
  Alert, // Importar Alert
  AlertTitle, // Importar AlertTitle
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArchiveIcon from "@mui/icons-material/Archive";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { ObtenerNumeros } from "../../api/PreciosUnitarios";
import { DescargarCOTZ } from "../../api/PreciosUnitarios";

const PreciosUnitarios = () => {
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    nombreActividad: "",
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
  const [isOnline, setIsOnline] = useState(navigator.onLine); // Estado para verificar la conexión a Internet

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

  // Función para formatear fechas en formato día/mes/año
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Llamar a la API para obtener los datos cuando el componente se monta
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ObtenerNumeros();
        // Mapear los datos de la API al formato que espera la tabla
        const mappedData = response.map((item) => ({
          id: item.id,
          nombreActividad: item.nombre,
          fechaCreacion: formatDate(item.fecha_creacion), // Formatear fecha
          cliente: item.cliente,
          fechaInicio: formatDate(item.fecha_inicio), // Formatear fecha
          representante: item.representante,
          prioridad: item.prioridad,
        }));
        setTableData(mappedData);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      } finally {
        setDataLoading(false); // Desactivar el estado de carga de datos
      }
    };

    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDescargar = async (id) => {
    // Simulación de descarga
    setLoading(true);
    try {
      const response = await DescargarCOTZ(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Extraer el nombre del archivo de los encabezados
      const contentDisposition = response.headers["content-disposition"] || response.headers["Content-Disposition"];

      let fileName = ``;

      if (contentDisposition && contentDisposition.includes("filename=")) {
        // Extraer el nombre del archivo del encabezado content-disposition
        fileName = contentDisposition
          .split("filename=")[1] // Obtener la parte después de "filename="
          .split(";")[0] // Eliminar cualquier parámetro adicional (como "utf-8")
          .trim() // Eliminar espacios en blanco
          .replace(/['"]/g, ""); // Eliminar comillas simples o dobles
      }

      // Asignar el nombre del archivo al enlace de descarga
      link.setAttribute("download", fileName);

      // Simular clic en el enlace para iniciar la descarga
      document.body.appendChild(link);
      link.click();

      // Limpiar y liberar el objeto URL
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
    } finally {
      setLoading(false); // Desactivar el spinner
    }
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
    return (
      row.nombreActividad.toLowerCase().includes(filters.nombreActividad.toLowerCase()) &&
      row.fechaCreacion.includes(filters.fechaCreacion) &&
      row.cliente.toLowerCase().includes(filters.cliente.toLowerCase()) &&
      row.fechaInicio.includes(filters.fechaInicio) &&
      row.representante.toLowerCase().includes(filters.representante.toLowerCase()) &&
      row.prioridad.toLowerCase().includes(filters.prioridad.toLowerCase())
    );
  });

  // Función para obtener el color del texto según la prioridad
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Alta":
        return "#ff0000"; // Rojo
      case "Media":
        return "#ff9900"; // Naranja
      case "Baja":
        return "#00cc00"; // Verde
      default:
        return "#000000"; // Negro por defecto
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      {/* Alerta de conexión a Internet */}
      {!isOnline && (
        <Alert severity="warning" sx={{ marginBottom: 2 }}>
          <AlertTitle>Advertencia</AlertTitle>
          Parece que no estás conectado a Internet.
        </Alert>
      )}

      <Paper sx={{ padding: 2, borderRadius: 2 }}>
        {/* Título "Lista de Números Generados" */}
        <Typography variant="h5" sx={{ marginBottom: 3, textAlign: "center", fontWeight: "bold" }}>
          Lista de Números Generados
        </Typography>

        {dataLoading ? (
          // Skeleton Loading
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#060336" }}>
                <TableRow>
                  {Array.from({ length: 7 }).map((_, index) => (
                    <TableCell key={index} sx={{ color: "white", fontWeight: "bold" }}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from({ length: rowsPerPage }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 7 }).map((_, cellIndex) => (
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
          // Mensaje cuando no hay datos
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
              No se Encontraron Datos
            </Typography>
          </Box>
        ) : (
          // Tabla con datos
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#060336" }}>
                <TableRow>
                  {/* Nom.Act.O.Pry con ícono de filtro */}
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
                  {/* Fecha de Creación con ícono de filtro */}
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      Fecha de Creación
                      <IconButton
                        size="small"
                        onClick={(e) => handleFilterClick(e, "fechaCreacion")}
                        sx={{ color: "white", marginLeft: 1 }}
                      >
                        <FilterListIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </TableCell>
                  {/* Cliente con ícono de filtro */}
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      Cliente
                      <IconButton
                        size="small"
                        onClick={(e) => handleFilterClick(e, "cliente")}
                        sx={{ color: "white", marginLeft: 1 }}
                      >
                        <FilterListIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </TableCell>
                  {/* Fecha de Inicio con ícono de filtro */}
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      Fecha de Inicio
                      <IconButton
                        size="small"
                        onClick={(e) => handleFilterClick(e, "fechaInicio")}
                        sx={{ color: "white", marginLeft: 1 }}
                      >
                        <FilterListIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </TableCell>
                  {/* Representante con ícono de filtro */}
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      Representante
                      <IconButton
                        size="small"
                        onClick={(e) => handleFilterClick(e, "representante")}
                        sx={{ color: "white", marginLeft: 1 }}
                      >
                        <FilterListIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </TableCell>
                  {/* Prioridad con ícono de filtro */}
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      Prioridad
                      <IconButton
                        size="small"
                        onClick={(e) => handleFilterClick(e, "prioridad")}
                        sx={{ color: "white", marginLeft: 1 }}
                      >
                        <FilterListIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Descargar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow key={row.id} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }}>
                    <TableCell>{row.nombreActividad}</TableCell>
                    <TableCell>{row.fechaCreacion}</TableCell>
                    <TableCell>{row.cliente}</TableCell>
                    <TableCell>{row.fechaInicio}</TableCell>
                    <TableCell>{row.representante}</TableCell>
                    <TableCell
                      sx={{
                        color: getPriorityColor(row.prioridad), // Color del texto
                        fontWeight: "bold",
                      }}
                    >
                      {row.prioridad}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleDescargar(row.id)}
                        sx={{ color: "#060336" }} // Color del ícono
                        disabled={loading}
                      >
                        {loading ? <CircularProgress size={24} /> : <ArchiveIcon />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 50, 60]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        )}

        {/* Popover para filtros */}
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
          <div style={{ padding: "10px" }}>
            <TextField
              label={`Filtrar por ${currentFilter}`}
              variant="outlined"
              value={filters[currentFilter] || ""}
              onChange={handleFilterChange}
              size="small"
            />
          </div>
        </Popover>
      </Paper>
    </div>
  );
};

export default PreciosUnitarios;