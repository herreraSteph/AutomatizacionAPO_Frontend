import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
  TextField,
  IconButton,
  Popover,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList"; // Ícono de filtro
import { ObtenerCPC } from "../../api/Construccion";///

const TablaCompleta = () => {
  // Estado para almacenar los datos de la tabla
  const [tableData, setTableData] = useState([]); // Inicializa con un array vacío

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

  useEffect(() => {
    const obtenerDatosCPC = async () => {
      try {
        const datosCPC = await ObtenerCPC(false); // Obtener datos de la API
        console.log("Datos obtenidos de ObtenerCPC:", datosCPC);

        // Transformar y formatear los datos
        const datosTransformados = datosCPC.map((item) => ({
          id: item.id_numero,
          nombreActividad: item.nombre,
          fechaCreacion: formatDate(item.fecha_creacion), // Formatear fecha_creacion
          cliente: item.cliente,
          fechaInicio: formatDate(item.fecha_inicio), // Formatear fecha_inicio
          representante: item.representante,
          prioridad: item.prioridad,
        }));

        setTableData(datosTransformados); // Actualizar el estado con los datos transformados
      } catch (error) {
        console.error("Error al obtener los datos de CPC:", error);
      }
    };

    obtenerDatosCPC();
  }, []);

  // Función para formatear fechas (debes implementarla)
  const formatDate = (dateString) => {
    // Implementa la lógica para formatear la fecha
    return dateString; // Cambia esto según tu formato deseado
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleVisualizar = () => {
    // Redirigir a la URL especificada
    window.location.href = "http://localhost:3000/Serman/proyectos/CPC";
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
    <div style={{ padding: "20px" }}>
      <Paper sx={{ padding: 2, borderRadius: 2 }}>
        {/* Título "Lista de Números Existentes" */}
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Numeros Creados</h1>

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
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Crear CPC</TableCell>
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
                    <Button
                      variant="outlined"
                      onClick={handleVisualizar}
                      sx={{
                        borderColor: "#060336",
                        color: "#060336",
                        padding: "5px 10px",
                        fontSize: "0.8rem",
                        borderRadius: "20px",
                      }}
                    >
                      CPC
                    </Button>
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

export default TablaCompleta;