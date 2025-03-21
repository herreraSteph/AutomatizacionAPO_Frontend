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
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArchiveIcon from "@mui/icons-material/Archive";
import { ObtenerCPC } from "../../api/Construccion";
import { DescargarCPC } from "../../api/Construccion";

const DescargaCPC = () => {
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
  const [loading, setLoading] = useState(false); // Estado para manejar el spinner

  const formatDate = (dateString) => {
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
        const datosCPC = await ObtenerCPC(true);
        console.log("Datos obtenidos de ObtenerCPC:", datosCPC);

        const datosTransformados = datosCPC.map((item) => ({
          id: item.id,
          nombreActividad: item.nombre,
          fechaCreacion: formatDate(item.fecha_creacion),
          cliente: item.cliente,
          fechaInicio: formatDate(item.fecha_inicio),
          representante: item.representante,
          prioridad: item.prioridad,
        }));

        setTableData(datosTransformados);
      } catch (error) {
        console.error("Error al obtener los datos de CPC:", error);
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
    setLoading(true); // Activar el spinner
    try {
      const response = await DescargarCPC(id); // Llamar a la API con el id
  
      // Crear un enlace temporal para descargar el archivo
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
    <div style={{ padding: "40px" }}>
      <Paper sx={{ padding: 2, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ marginBottom: 3, textAlign: "center", fontWeight: "bold", fontSize: '2rem' }}>
          Lista de CPC Generados
        </Typography>

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
                      color: getPriorityColor(row.prioridad),
                      fontWeight: "bold",
                    }}
                  >
                    {row.prioridad}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleDescargar(row.id)} // Pasar el id al hacer clic
                      sx={{ color: "#060336" }}
                      disabled={loading} // Deshabilitar el botón mientras se carga
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

export default DescargaCPC;