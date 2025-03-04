import React, { useState, useEffect, useImperativeHandle } from "react";
import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/dist/style.css";
import moment from "moment";
import { Grid, TextField, Button } from "@mui/material";

const CronogramaEquipo = React.forwardRef((props, ref) => {
  const [groups, setGroups] = useState([
    {
      id: 0, // ID único para el grupo por defecto
      title: "Encabezado", // Título del grupo por defecto
      isHeader: true, // Propiedad para identificar el grupo de encabezado
    },
  ]); // Grupo por defecto como encabezado
  const [items, setItems] = useState([]); // Sin ítems iniciales

  const defaultTimeStart = moment().startOf("day").subtract(7, "days");
  const defaultTimeEnd = moment().startOf("day").add(30, "days");

  const [selectedItemId, setSelectedItemId] = useState(null);

  const [inputValue, setInputValue] = useState(""); // Valor del input de texto
  const [itemTitle, setItemTitle] = useState(1); // Valor inicial del input numérico

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Delete") {
        handleDeleteItem();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedItemId]);

  const esFinDeSemana = (fecha) => {
    const dia = moment(fecha).day(); // 0 (domingo) o 6 (sábado)
    return dia === 0 || dia === 6;
  };

  const calcularJornadasYHoras = (titulo, startTime, endTime, groupId) => {
    const duracionDias = moment(endTime).diff(moment(startTime), "days"); // Duración en días
    const numeroJornadas = titulo * duracionDias; // Jornadas = título * duración en días

    // Calcular jornadas y horas extras (fines de semana)
    let jornadasExtras = 0;
    let horasExtras = 0;

    for (let i = 0; i < duracionDias; i++) {
      const fecha = moment(startTime).add(i, "days");
      if (esFinDeSemana(fecha)) {
        jornadasExtras += titulo;
        horasExtras += titulo * groups.find((group) => group.id === groupId).hrsXJor;
      }
    }

    return {
      jornadasNormales: numeroJornadas - jornadasExtras,
      horasNormales: (numeroJornadas - jornadasExtras) * groups.find((group) => group.id === groupId).hrsXJor,
      jornadasExtras,
      horasExtras,
    };
  };

  const actualizarHorasEnGrupo = (groupId, titulo, startTime, endTime, operacion = "sumar") => {
    const grupo = groups.find((group) => group.id === groupId);
    if (!grupo) return;

    const { jornadasNormales, horasNormales, jornadasExtras, horasExtras } = calcularJornadasYHoras(
      titulo,
      startTime,
      endTime,
      groupId
    );

    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              jor: operacion === "sumar" ? group.jor + jornadasNormales : group.jor - jornadasNormales,
              hrsNor: operacion === "sumar" ? group.hrsNor + horasNormales : group.hrsNor - horasNormales,
              jorExt: operacion === "sumar" ? group.jorExt + jornadasExtras : group.jorExt - jornadasExtras,
              hrsExt: operacion === "sumar" ? group.hrsExt + horasExtras : group.hrsExt - horasExtras,
            }
          : group
      )
    );
  };

  const handleItemMove = (itemId, dragTime, newGroupOrder) => {
    const startOfDay = moment(dragTime).startOf("day").valueOf();
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              group: groups[newGroupOrder].id,
              start_time: startOfDay,
              end_time: startOfDay + (item.end_time - item.start_time),
            }
          : item
      )
    );
  };

  const handleItemResize = (itemId, time, edge) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          const oldStartTime = item.start_time;
          const oldEndTime = item.end_time;

          let newStartTime = item.start_time;
          let newEndTime = item.end_time;

          if (edge === "left") {
            newStartTime = moment(time).startOf("day").valueOf();
          } else {
            newEndTime = moment(time).startOf("day").add(1, "days").valueOf();
          }

          // Restar las horas y jornadas anteriores
          actualizarHorasEnGrupo(item.group, parseInt(item.title), oldStartTime, oldEndTime, "restar");

          // Sumar las horas y jornadas nuevas
          actualizarHorasEnGrupo(item.group, parseInt(item.title), newStartTime, newEndTime, "sumar");

          return {
            ...item,
            start_time: newStartTime,
            end_time: newEndTime,
          };
        }
        return item;
      })
    );
  };

  const handleDeleteItem = () => {
    if (selectedItemId !== null) {
      const itemToDelete = items.find((item) => item.id === selectedItemId);
      if (!itemToDelete) return;

      // Calcular la duración en días del ítem
      const duracionDias = moment(itemToDelete.end_time).diff(moment(itemToDelete.start_time), "days");

      // Calcular las jornadas y horas totales a restar
      const { jornadasNormales, horasNormales, jornadasExtras, horasExtras } = calcularJornadasYHoras(
        parseInt(itemToDelete.title),
        itemToDelete.start_time,
        itemToDelete.end_time,
        itemToDelete.group
      );

      // Restar las horas y jornadas del ítem eliminado
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.id === itemToDelete.group
            ? {
                ...group,
                jor: group.jor - jornadasNormales,
                hrsNor: group.hrsNor - horasNormales,
                jorExt: group.jorExt - jornadasExtras,
                hrsExt: group.hrsExt - horasExtras,
              }
            : group
        )
      );

      // Eliminar el ítem
      setItems((prevItems) => prevItems.filter((item) => item.id !== selectedItemId));
      setSelectedItemId(null);
    }
  };

  const handleCanvasClick = (groupId, time) => {
    const startOfDay = moment(time).startOf("day").valueOf();
    const endOfDay = startOfDay + 24 * 60 * 60 * 1000; // Duración de 1 día

    const newItem = {
      id: items.length + 1,
      group: groupId,
      title: itemTitle.toString(), // Usa el valor del input numérico como título
      start_time: startOfDay,
      end_time: endOfDay, // Duración de 1 día
    };
    setItems((prevItems) => [...prevItems, newItem]);

    // Sumar las horas y jornadas del nuevo ítem
    actualizarHorasEnGrupo(groupId, itemTitle, startOfDay, endOfDay, "sumar");
  };

  const handleDeleteGroup = (groupId) => {
    // Eliminar el grupo
    setGroups((prevGroups) => prevGroups.filter((group) => group.id !== groupId));

    // Eliminar los ítems asociados al grupo
    setItems((prevItems) => prevItems.filter((item) => item.group !== groupId));
  };

  const handleAddGroup = () => {
    if (inputValue.trim() === "") return;

    // Verifica si el grupo ya existe
    const groupExists = groups.some((group) => group.title === inputValue);

    if (!groupExists) {
      // Agrega un nuevo grupo con un ID único y las nuevas propiedades
      const newGroup = {
        id: groups.length, // Usamos el length para evitar conflictos con el grupo por defecto
        title: inputValue,
        hrsXJor: 8, // Valor inicial por defecto
        jor: 0, // Valor inicial
        hrsNor: 0, // Valor inicial
        jorExt: 0, // Valor inicial
        hrsExt: 0, // Valor inicial
      };
      setGroups((prevGroups) => [...prevGroups, newGroup]);
      setInputValue(""); // Limpiar el input después de agregar
    }
  };

  const groupRenderer = ({ group }) => {
    const truncateText = (text, maxLength) => {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + "..."; // Trunca y agrega puntos suspensivos
      }
      return text;
    };

    if (group.isHeader) {
      return (
        <div style={{ display: "flex", alignItems: "center", fontWeight: "bold", backgroundColor: "#f0f0f0", fontSize: "9px" }}>
          <div style={{ width: "70px", padding: "0 8px" }}>Título</div>
          <div style={{ width: "50px", padding: "0 8px" }}>HRS X JOR</div>
          <div style={{ width: "30px", padding: "0 8px" }}>JOR</div>
          <div style={{ width: "50px", padding: "0 8px" }}>HRS NOR</div>
          <div style={{ width: "50px", padding: "0 8px" }}>JOR EXT</div>
          <div style={{ width: "50px", padding: "0 8px" }}>HRS EXT</div>
        </div>
      );
    }

    return (
      <div style={{ display: "flex", alignItems: "center", fontSize: "9px" }}>
        <div style={{ width: "100px", padding: "0 8px" }}>{truncateText(group.title, 15)}</div>
        <div style={{ width: "50px", padding: "0 8px" }}>{group.hrsXJor}</div>
        <div style={{ width: "50px", padding: "0 8px" }}>{group.jor}</div>
        <div style={{ width: "50px", padding: "0 8px" }}>{group.hrsNor}</div>
        <div style={{ width: "50px", padding: "0 8px" }}>{group.jorExt}</div>
        <div style={{ width: "50px", padding: "0 8px" }}>{group.hrsExt}</div>
        <button
          onClick={() => handleDeleteGroup(group.id)}
          style={{ marginLeft: "8px", fontSize: "9px", padding: "2px 4px", backgroundColor: "#ff4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Eliminar
        </button>
      </div>
    );
  };

  const exportData = () => {
    const groupsToExport = groups
      .filter((group) => !group.isHeader) // Excluir el grupo de encabezado
      .map((group) => ({
        id: group.id,
        title: group.title,
        hrsXJor: group.hrsXJor,
        jor: group.jor,
        hrsNor: group.hrsNor,
        jorExt: group.jorExt,
        hrsExt: group.hrsExt,
      }));

    const itemsToExport = items.map((item) => ({
      group: item.group,
      title: item.title,
      start_time: item.start_time,
      end_time: item.end_time,
    }));

    return {
      groups: groupsToExport,
      items: itemsToExport,
    };
  };

  useImperativeHandle(ref, () => ({
    exportData,
  }));

  return (
    <div className="p-4">
      <br />
      <Grid container spacing={2} alignItems="center" marginBottom={2}>
        <Grid item xs={2}>
          <TextField
            type="number"
            label="Número de jornada"
            value={itemTitle}
            onChange={(e) => setItemTitle(Number(e.target.value))}
            fullWidth
            variant="outlined"
            inputProps={{ min: 1 }} // Asegura que el valor sea mayor o igual a 1
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="Nombre del equipo o material"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddGroup}
            fullWidth
          >
            Agregar Grupo
          </Button>
        </Grid>
      </Grid>

      <Timeline
        groups={groups}
        items={items}
        defaultTimeStart={defaultTimeStart}
        defaultTimeEnd={defaultTimeEnd}
        timeSteps={{ day: 1, hour: 0, minute: 0, second: 0 }}
        lineHeight={30}
        traditionalZoom={false}
        sidebarWidth={350} // Reducido a 350 para hacer la tabla más corta
        headerLabelFormats={{
          day: { long: "dddd D MMMM", medium: "ddd D MMM", short: "ddd D" },
        }}
        onItemMove={handleItemMove}
        onItemResize={handleItemResize}
        onCanvasClick={handleCanvasClick}
        groupRenderer={groupRenderer} // Personaliza el renderizado de los grupos
        itemRenderer={({ item, getItemProps }) => (
          <div
            {...getItemProps()}
            onClick={() => setSelectedItemId(item.id)}
            className={`cursor-pointer text-center ${item.id === selectedItemId ? "bg-blue-100" : ""}`}
          >
            {item.title} {/* Muestra el título del ítem sin edición */}
          </div>
        )}
      />
    </div>
  );
});

export default CronogramaEquipo;