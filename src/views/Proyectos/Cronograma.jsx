import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate para la redirección
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import gantt from "dhtmlx-gantt";
import MainCard from "ui-component/cards/MainCard";
import { Button, CircularProgress, Modal, Box, Typography, Alert, AlertTitle } from "@mui/material"; // Importar componentes de Material-UI
import "../../assets/css/cronograma.css"; // Archivo CSS para colores
import { agregarActividades } from "../../api/Construccion"; // Importar la función de la API

const Cronograma = () => {
  const ganttContainer = useRef(null);
  const navigate = useNavigate(); // Inicializar useNavigate
  const [loading, setLoading] = useState(false); // Estado para controlar el spinner
  const [modalOpen, setModalOpen] = useState(false); // Estado para controlar el modal
  const [modalMessage, setModalMessage] = useState(""); // Mensaje del modal
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

  useEffect(() => {
    // Configurar idioma español
    gantt.locale = {
      date: {
        month_full: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        month_short: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        day_full: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
        day_short: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
      },
      labels: {
        new_task: "Nueva tarea",
        icon_save: "Guardar",
        icon_cancel: "Cancelar",
        icon_details: "Detalles",
        icon_edit: "Editar",
        icon_delete: "Eliminar",
        confirm_closing: "Se perderán los cambios, ¿desea continuar?",
        confirm_deleting: "La tarea se eliminará permanentemente, ¿continuar?",
        section_description: "Descripción",
        section_time: "Duración",
        section_quantity: "Cantidad",
        section_unit: "Unidad",
        section_type: "Tipo",
        day: "Día",
        week: "Semana",
        month: "Mes",
        year: "Año",
      }
    };

    // Configurar columnas con el botón de agregar tarea
    gantt.config.columns = [
      { name: "text", label: "Nom. Act.", width: 125, tree: true },
      { name: "start_date", label: "Inicio", align: "center", width: 100 },
      { name: "end_date", label: "Termino", align: "center", width: 100 },
      { name: "duration", label: "Días", align: "center", width: 50 },
      { name: "cantidad", label: "Cant", align: "center", width: 50 },
      { name: "unidad", label: "Unidad", align: "center", width: 50 },
      { name: "add", label: "", width: 44 }
    ];

    // Configurar el formulario de la tarea
    gantt.config.lightbox.sections = [
      { name: "description", height: 70, map_to: "text", type: "textarea", focus: true },
      { name: "time", height: 72, map_to: "auto", type: "duration" },
      { name: "quantity", label: "Cantidad", height: 40, map_to: "cantidad", type: "textarea" },
      { 
        name: "unit", label: "Unidad", height: 40, map_to: "unidad", type: "select",
        options: [
          { key: "pzas", label: "Pzas" },
          { key: "lote", label: "Lote" },
          { key: "act", label: "Act" },
          { key: "jts", label: "Jts" }
        ]
      }
    ];

    // Calcular la fecha de fin automáticamente si es necesario
    gantt.attachEvent("onTaskUpdated", function (id, task) {
      if (task.start_date && task.duration) {
        const startDate = new Date(task.start_date);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + task.duration);
        task.end_date = gantt.date.date_to_str("%d-%m-%Y %H:%i")(endDate); // Formatear la fecha
        gantt.updateTask(id);
      }
    });

    // Definir colores según el nivel de la tarea
    gantt.templates.task_class = function (start, end, task) {
      const level = gantt.getTask(task.id).$level; // Obtener nivel jerárquico
      if (level === 0) return "nivel-0"; // Tarea principal
      if (level === 1) return "nivel-1"; // Subtarea
      if (level === 2) return "nivel-2"; // Sub-subtarea
      return "nivel-otros"; // Niveles más profundos
    };

    // Configurar la escala de tiempo
    gantt.config.scale_unit = "day"; // Mostrar días
    gantt.config.step = 1; // Un paso por día
    gantt.config.date_scale = "%d %M"; // Formato de la escala de tiempo

    // Configurar el formato de fecha para que use YYYY-MM-DD HH:mm
    gantt.config.date_format = "%Y-%m-%d %H:%i";

    // Resaltar los fines de semana
    gantt.templates.scale_cell_class = function (date) {
      if (date.getDay() === 0 || date.getDay() === 6) {
        return "weekend";
      }
      return "";
    };

    // Definir el rango de tiempo inicial
    const startDate = new Date(); // Fecha de inicio hoy
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 100); // Fecha de fin en 100 días

    gantt.config.start_date = startDate;
    gantt.config.end_date = endDate;

    // Inicializar el Gantt
    gantt.init(ganttContainer.current);

    return () => {
      gantt.clearAll();
    };
  }, []);

  // Función para exportar los datos del Gantt como JSON y descargarlos
  const exportGanttData = async () => {
    setLoading(true); // Activar el spinner
    const tasks = gantt.getTaskByTime(); // Obtener todas las tareas

    // Formatear los datos según el esquema proporcionado
    const data = tasks.map(task => ({
      id: task.id,
      start_date: gantt.date.date_to_str("%d-%m-%Y %H:%i")(new Date(task.start_date)),
      text: task.text,
      duration: task.duration,
      parent: task.parent || "0",
      end_date: gantt.date.date_to_str("%d-%m-%Y %H:%i")(new Date(task.end_date)),
      progress: task.progress || 0,
      cantidad: task.cantidad || "",
      unidad: task.unidad || ""
    }));

    try {
      const response = await agregarActividades(data); // Llamar a la función de la API
      console.log(response); // Mostrar la respuesta en la consola

      if (response.tipoError === 0) {
        navigate("/proyectos/AsignacionManoObra"); // Redirigir si no hay error
      } else {
        setModalMessage("Algo ocurrió mal. Por favor, inténtelo de nuevo."); // Mensaje de error
        setModalOpen(true); // Mostrar el modal
      }
    } catch (error) {
      setModalMessage("Ocurrió un error inesperado. Por favor, inténtelo de nuevo."); // Mensaje de error
      setModalOpen(true); // Mostrar el modal
    } finally {
      setLoading(false); // Desactivar el spinner
    }
  };

  return (
    <MainCard
      title={
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>Cronograma</span>
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              variant="contained"
              sx={{
                borderRadius: "5px", // Bordes redondeados
                padding: "10px 20px",
                backgroundColor: "#060336",
                color: "white"
              }}
              onClick={exportGanttData} // Llamar a la función de exportación
              disabled={loading} // Deshabilitar el botón mientras se carga
            >
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Siguiente"}
            </Button>
          </div>
        </div>
      }
    >
      {/* Alerta de conexión a Internet */}
      {!isOnline && (
        <Alert severity="warning" sx={{ marginBottom: 2 }}>
          <AlertTitle>Advertencia</AlertTitle>
          Parece que no estás conectado a Internet.
        </Alert>
      )}

      <div ref={ganttContainer} style={{ width: "100%", height: "400px" }} />

      {/* Modal para mostrar mensajes de error */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px"
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Error
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {modalMessage}
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2, backgroundColor: "#060336", color: "white" }}
            onClick={() => setModalOpen(false)}
          >
            Cerrar
          </Button>
        </Box>
      </Modal>
    </MainCard>
  );
};

export default Cronograma;