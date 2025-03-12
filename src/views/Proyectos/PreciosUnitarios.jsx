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
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArchiveIcon from "@mui/icons-material/Archive";
import { ObtenerNumeros } from "../../api/PreciosUnitarios";

const PreciosUnitarios = () => {
  // Estado inicial de los datos de la tabla (vacío)
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
          id: item.id_numero,
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

  const handleDescargar = () => {
    // Simulación de descarga
    const link = document.createElement("a");
    link.href = "https://example.com/file.pdf"; // URL del archivo a descargar
    link.download = "archivo.pdf"; // Nombre del archivo
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <Paper sx={{ padding: 2, borderRadius: 2 }}>
        {/* Título "Lista de Números Generados" */}
        <Typography variant="h5" sx={{ marginBottom: 3, textAlign: "center", fontWeight: "bold" }}>
          Lista de Números Generados
        </Typography>

        {/* Tabla */}
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
                      onClick={handleDescargar}
                      sx={{ color: "#060336" }} // Color del ícono
                    >
                      <ArchiveIcon />
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