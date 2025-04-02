import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Skeleton,
  Typography,
  Box,
  Alert,
  AlertTitle,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { ObtenerCPC, VerificarProyectoExistente } from "../../api/Construccion";

const TablaCompleta = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    nombreActividad: "",
    nombre: "", // Cambiado de nombreProyecto a nombre
    fechaCreacion: "",
    cliente: "",
    fechaInicio: "",
    representante: "",
    prioridad: "",
  });
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [currentFilter, setCurrentFilter] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const navigate = useNavigate();

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

  useEffect(() => {
    const obtenerDatosCPC = async () => {
      try {
        const datosCPC = await ObtenerCPC(false);
        const datosTransformados = datosCPC.map((item) => ({
          id: item.id_numero,
          nombreActividad: item.nombre,
          nombre: item.nombre_proyecto || "N/A", // Cambiado de nombreProyecto a nombre
          fechaCreacion: formatDate(item.fecha_creacion),
          cliente: item.cliente,
          fechaInicio: formatDate(item.fecha_inicio),
          representante: item.representante,
          prioridad: item.prioridad,
        }));
        setTableData(datosTransformados);
      } catch (error) {
        console.error("Error al obtener los datos de CPC:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerDatosCPC();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleVisualizar = async (id, nombreActividad) => {
    const response = await VerificarProyectoExistente(id);
    const id_proyecto = response.isFinished;
    console.log(id_proyecto);
    
    if(id_proyecto !== 0){
      navigate("/proyectos/Editar", {
        state: { idNumero: id, nombreActividad, id_proyecto},
      });
    }else{
      navigate("/proyectos/CPC", {
        state: { id, nombreActividad },
      });
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
      row.nombre.toLowerCase().includes(filters.nombre.toLowerCase()) && // Cambiado de nombreProyecto a nombre
      row.fechaCreacion.includes(filters.fechaCreacion) &&
      row.cliente.toLowerCase().includes(filters.cliente.toLowerCase()) &&
      row.fechaInicio.includes(filters.fechaInicio) &&
      row.representante.toLowerCase().includes(filters.representante.toLowerCase()) &&
      row.prioridad.toLowerCase().includes(filters.prioridad.toLowerCase())
    );
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Alta":
        return "#ff0000";
      case "Media":
        return "#ff9900";
      case "Baja":
        return "#00cc00";
      default:
        return "#000000";
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {!isOnline && (
        <Alert severity="warning" sx={{ marginBottom: 2 }}>
          <AlertTitle>Warning</AlertTitle>
          Parece que no estás conectado a Internet.
        </Alert>
      )}

      <Paper sx={{ padding: 2, borderRadius: 2 }}>
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Numeros Creados</h1>
        {loading ? (
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#060336" }}>
                <TableRow>
                  {Array.from({ length: 8 }).map((_, index) => (
                    <TableCell key={index} sx={{ color: "white", fontWeight: "bold" }}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from({ length: rowsPerPage }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 8 }).map((_, cellIndex) => (
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
              No se Encuentran Datos
            </Typography>
          </Box>
        ) : (
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
                      Nombre
                      <IconButton
                        size="small"
                        onClick={(e) => handleFilterClick(e, "nombre")} // Cambiado de nombreProyecto a nombre
                        sx={{ color: "white", marginLeft: 1 }}
                      >
                        <FilterListIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Fecha de Creación</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Cliente</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Fecha de Inicio</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Representante</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Prioridad</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Editar </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow key={row.id} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }}>
                    <TableCell>{row.nombreActividad}</TableCell>
                    <TableCell>{row.nombre}</TableCell> {/* Cambiado de nombreProyecto a nombre */}
                    <TableCell>{row.fechaCreacion}</TableCell>
                    <TableCell>{row.cliente}</TableCell>
                    <TableCell>{row.fechaInicio}</TableCell>
                    <TableCell>{row.representante}</TableCell>
                    <TableCell sx={{ color: getPriorityColor(row.prioridad), fontWeight: "bold" }}>
                      {row.prioridad}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        onClick={() => handleVisualizar(row.id, row.nombreActividad)}
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