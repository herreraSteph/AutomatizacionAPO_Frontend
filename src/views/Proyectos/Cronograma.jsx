import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import gantt from "dhtmlx-gantt";
import MainCard from "ui-component/cards/MainCard";
import { Button, CircularProgress, Modal, Box, Typography, Alert, AlertTitle } from "@mui/material";
import "../../assets/css/cronograma.css";
import { agregarActividades, editarActividades, obtenerActividades } from "../../api/Construccion";

const Cronograma = () => {
  const ganttContainer = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [modalTitle, setModalTitle] = useState("Error");
  const [isDragging, setIsDragging] = useState(false);
  const location = useLocation();
  const { id_proyecto, Status } = location.state || {};

  // Función para transformar los datos al formato esperado por DHTMLX Gantt
  const transformData = async () => {
    try {
      const tasks = await obtenerActividades(id_proyecto);

      if (!tasks || tasks.length === 0) {
        console.warn("No se recibieron tareas desde la API.");
        return { data: [], links: [] };
      }

      return {
        data: tasks.map((task) => ({
          ...task,
          id: Number(task.id),
          parent: task.parent === "0" ? 0 : Number(task.parent),
          start_date: task.start_date.replace("T", " "),
          end_date: task.end_date.replace("T", " ")
        })),
        links: []
      };
    } catch (error) {
      console.error("Error al transformar los datos:", error);
      return { data: [], links: [] };
    }
  };

  useEffect(() => {
    // Configuración regional
    const today = new Date();
const endDate = new Date(today);
endDate.setDate(today.getDate() + 100); // 100 días después de hoy

gantt.config.start_date = today;
gantt.config.end_date = endDate;
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

    // Configuración optimizada para parent-child
    gantt.config.auto_types = true;
    gantt.config.order_branch = true;
    gantt.config.order_branch_free = false;
    gantt.config.drag_move = true;
    gantt.config.drag_resize = true;
    gantt.config.drag_progress = true;
    gantt.config.preserve_scroll = true;
    gantt.config.show_links = true;

    // Configuración de columnas
    gantt.config.columns = [
      { name: "text", label: "Nom. Act.", width: 125, tree: true },
      { name: "start_date", label: "Inicio", align: "center", width: 100 },
      { name: "duration", label: "Días", align: "center", width: 50 },
      { name: "cantidad", label: "Cant", align: "center", width: 50 },
      { name: "unidad", label: "Unidad", align: "center", width: 50 },
      { name: "add", label: "", width: 44 }
    ];

    // Configuración del lightbox
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

    // Función optimizada para restricciones
    const applyParentConstraints = (task) => {
      if (!task.parent) return false;
      
      const parent = gantt.getTask(task.parent);
      if (!parent) return false;

      const parentStart = new Date(parent.start_date);
      const parentEnd = new Date(parent.start_date);
      parentEnd.setDate(parentStart.getDate() + parent.duration);
      
      const taskStart = new Date(task.start_date);
      const taskEnd = new Date(taskStart);
      taskEnd.setDate(taskStart.getDate() + task.duration);
      
      let changed = false;
      
      if (taskStart < parentStart) {
        task.start_date = new Date(parentStart);
        changed = true;
      }
      
      const maxEnd = new Date(Math.min(taskEnd.getTime(), parentEnd.getTime()));
      const maxDuration = Math.floor((maxEnd - taskStart) / (1000 * 60 * 60 * 24));
      
      if (task.duration !== maxDuration) {
        task.duration = maxDuration > 0 ? maxDuration : 1;
        changed = true;
      }
      
      return changed;
    };

    // Manejo optimizado de eventos de arrastre
    gantt.attachEvent("onTaskDragStart", () => {
      setIsDragging(true);
      return true;
    });

    gantt.attachEvent("onTaskDragEnd", () => {
      setIsDragging(false);
      return true;
    });

    gantt.attachEvent("onTaskDrag", (id, mode, task) => {
      if (applyParentConstraints(task)) {
        gantt.updateTask(id);
        return false;
      }
      return true;
    });

    // Manejo de redimensionamiento
    gantt.attachEvent("onBeforeTaskChange", (id, mode, task) => {
      if (mode === "resize" && applyParentConstraints(task)) {
        return false;
      }
      return true;
    });

    // Actualización optimizada de tareas
    gantt.attachEvent("onAfterTaskUpdate", (id) => {
      if (isDragging) return true;
      
      const task = gantt.getTask(id);
      
      if (gantt.hasChild(id)) {
        const children = gantt.getChildren(id);
        children.forEach(childId => {
          const child = gantt.getTask(childId);
          if (applyParentConstraints(child)) {
            gantt.updateTask(childId);
          }
        });
      }
      
      if (task.parent && applyParentConstraints(task)) {
        gantt.updateTask(id);
      }
      
      return true;
    });

    // Actualizar fecha final al modificar
    gantt.attachEvent("onTaskUpdated", (id, task) => {
      if (task.start_date && task.duration) {
        const startDate = new Date(task.start_date);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + task.duration);
        task.end_date = gantt.date.date_to_str("%d-%m-%Y %H:%i")(endDate);
        gantt.updateTask(id);
      }
    });

    // Estilos para niveles
    gantt.templates.task_class = (start, end, task) => {
      const level = gantt.getTask(task.id).$level;
      if (level === 0) return "nivel-0";
      if (level === 1) return "nivel-1";
      if (level === 2) return "nivel-2";
      return "nivel-otros";
    };

    // Configuración de tiempo
    gantt.config.scale_unit = "day";
    gantt.config.step = 1;
    gantt.config.date_scale = "%d %M";
    gantt.config.date_format = "%Y-%m-%d %H:%i";

    // Estilos para fines de semana
    gantt.templates.scale_cell_class = (date) => {
      if (date.getDay() === 0 || date.getDay() === 6) {
        return "weekend";
      }
      return "";
    };

    // Inicializar Gantt
    gantt.init(ganttContainer.current);

    // Cargar datos existentes si Status es true
    const loadInitialData = async () => {
      if (Status && id_proyecto) {
        try {
          setLoading(true);
          const formattedData = await transformData();
          gantt.parse(formattedData);
        } catch (error) {
          setModalTitle("Error");
          setModalMessage("No se pudieron cargar las actividades existentes.");
          setModalOpen(true);
        } finally {
          setLoading(false);
        }
      }
    };

    loadInitialData();

    // Limpieza
    return () => {
      gantt.detachAllEvents();
      gantt.clearAll();
    };
  }, [Status, id_proyecto]);

  const validateData = (tasks) => {
    if (tasks.length === 0) {
      return {
        valid: false,
        message: "No hay tareas para exportar. Por favor, agregue al menos una tarea antes de continuar."
      };
    }
    for (const task of tasks) {
      if (!task.text || task.text.trim() === "") {
        return {
          valid: false,
          message: `La tarea con ID ${task.id} no tiene nombre. Por favor, ingrese un nombre válido.`
        };
      }

      if (!task.start_date) {
        return {
          valid: false,
          message: `La tarea "${task.text}" no tiene fecha de inicio. Por favor, ingrese una fecha válida.`
        };
      }

      if (isNaN(task.duration) || task.duration <= 0) {
        return {
          valid: false,
          message: `La tarea "${task.text}" tiene una duración inválida. Por favor, ingrese un número positivo.`
        };
      }

      if (task.cantidad && isNaN(task.cantidad)) {
        return {
          valid: false,
          message: `La tarea "${task.text}" tiene una cantidad inválida. Por favor, ingrese un número válido.`
        };
      }

      if ((task.cantidad && !task.unidad) || (!task.cantidad && task.unidad)) {
        return {
          valid: false,
          message: `La tarea "${task.text}" debe tener tanto cantidad como unidad, o ninguno de los dos.`
        };
      }
    }
    return { valid: true };
  };

  const exportGanttData = async () => {
    setLoading(true);
    const tasks = gantt.getTaskByTime();

    const validation = validateData(tasks);
    if (!validation.valid) {
      setModalTitle("Validación requerida");
      setModalMessage(validation.message);
      setModalOpen(true);
      setLoading(false);
      return;
    }

    const data = tasks.map(task => ({
      id: task.id,
      start_date: gantt.date.date_to_str("%d-%m-%Y %H:%i")(new Date(task.start_date)),
      text: task.text,
      duration: task.duration,
      parent: task.parent ? String(task.parent) : "0",
      end_date: gantt.date.date_to_str("%d-%m-%Y %H:%i")(new Date(task.end_date)),
      progress: task.progress || 0,
      cantidad: task.cantidad ? String(task.cantidad) : "",
      unidad: task.unidad || ""
    }));

    try {
      let response;
      
      if (Status) {
        console.log("Editando actividades:", data);
        response = await editarActividades(data, id_proyecto);
        if (response.tipoError === 0) {
          navigate(-1);
        } else {
          setModalTitle("Error");
          setModalMessage("Algo ocurrió mal al editar las actividades. Por favor, inténtelo de nuevo.");
          setModalOpen(true);
          console.error("Error al editar actividades:", response);
        }
      } else {
        console.log("Agregando actividades:", data);
        response = await agregarActividades(data, id_proyecto);
        if (response.tipoError === 0) {
          navigate("/proyectos/AsignacionManoObra", { state: { id_proyecto, Status } });
        } else {
          setModalTitle("Error");
          setModalMessage("Algo ocurrió mal al agregar las actividades. Por favor, inténtelo de nuevo.");
          setModalOpen(true);
        }
      }
    } catch (error) {
      setModalTitle("Error");
      setModalMessage("Ocurrió un error inesperado. Por favor, inténtelo de nuevo.");
      setModalOpen(true);
    } finally {
      setLoading(false);
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
                borderRadius: "5px",
                padding: "10px 20px",
                backgroundColor: "#060336",
                color: "white",
                "&:hover": {
                  backgroundColor: "#040225"
                }
              }}
              onClick={exportGanttData}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Siguiente"}
            </Button>
          </div>
        </div>
      }
    >
      {!isOnline && (
        <Alert severity="warning" sx={{ marginBottom: 2 }}>
          <AlertTitle>Advertencia</AlertTitle>
          Parece que no estás conectado a Internet.
        </Alert>
      )}

      <div ref={ganttContainer} style={{ 
        width: "100%", 
        height: "400px",
        minHeight: "400px",
        overflow: "hidden"
      }} />

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
            {modalTitle}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {modalMessage}
          </Typography>
          <Box sx={{
            display: "flex",
            justifyContent: "flex-end",
            pt: 2
          }}>
            <Button
              variant="contained"
              sx={{ 
                backgroundColor: "#060336", 
                color: "white",
                "&:hover": { backgroundColor: "#040225" }
              }}
              onClick={() => setModalOpen(false)}
            >
              Cerrar
            </Button>
          </Box>
        </Box>
      </Modal>
    </MainCard>
  );
};

export default Cronograma;