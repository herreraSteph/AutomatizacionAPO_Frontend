import React, { useState, useEffect, useImperativeHandle } from "react";
import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/dist/style.css";
import moment from "moment";
import { Grid, TextField, MenuItem, Modal, Box, Button, Typography } from "@mui/material";
import { obtenerEmpleados } from "../../../api/Construccion";

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const generateRandomId = () => Math.floor(1000000 + Math.random() * 9000000);

const CronogramaEmpleados = React.forwardRef((props, ref) => {
  const initialGroupsState = [{
    id: generateRandomId(),
    title: "Encabezado",
    isHeader: true,
  }];

  const [groups, setGroups] = useState(initialGroupsState);
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [comboBox1, setComboBox1] = useState("");
  const [comboBox2, setComboBox2] = useState("");
  const [dataForComboBox2, setDataForComboBox2] = useState([]);
  const [itemTitle, setItemTitle] = useState("1");
  
  const [openModal, setOpenModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [tempHrsXJor, setTempHrsXJor] = useState("");

  const defaultTimeStart = moment().startOf("day").subtract(7, "days");
  const defaultTimeEnd = moment().startOf("day").add(30, "days");

  const calcularJornadasYHoras = (titulo, startTime, endTime, currentGroups, groupId) => {
    const grupo = currentGroups.find(g => g.id === groupId);
    if (!grupo || !grupo.hrsXJor) return {
      jornadasNormales: 0,
      horasNormales: 0,
      jornadasExtras: 0,
      horasExtras: 0
    };

    const tituloNum = parseFloat(titulo) || 0;
    const duracionDias = moment(endTime).diff(moment(startTime), "days");
    const numeroJornadas = tituloNum * duracionDias;

    let jornadasExtras = 0;
    let horasExtras = 0;

    for (let i = 0; i < duracionDias; i++) {
      const fecha = moment(startTime).add(i, "days");
      if (fecha.day() === 0 || fecha.day() === 6) {
        jornadasExtras += tituloNum;
        horasExtras += tituloNum * grupo.hrsXJor;
      }
    }

    return {
      jornadasNormales: numeroJornadas - jornadasExtras,
      horasNormales: (numeroJornadas - jornadasExtras) * grupo.hrsXJor,
      jornadasExtras,
      horasExtras,
    };
  };

  useEffect(() => {
    if (props.initialData) {
      const { manoObraEditDtos, itemEditDtos } = props.initialData;

      const baseGroups = manoObraEditDtos.map(g => ({
        id: g.id_group,
        title: g.nombre,
        hrsXJor: parseFloat(g.hrs_x_jor),
        jor: 0,
        hrsNor: 0,
        jorExt: 0,
        hrsExt: 0,
        id_empleado: g.id_empleado
      }));

      const mappedItems = itemEditDtos.map(i => ({
        id: i.id,
        group: i.group_id,
        title: i.title,
        start_time: i.start_time,
        end_time: i.end_time
      }));

      const groupsWithCalculations = baseGroups.map(group => {
        const groupItems = mappedItems.filter(item => item.group === group.id);
        let totals = { jor: 0, hrsNor: 0, jorExt: 0, hrsExt: 0 };

        groupItems.forEach(item => {
          const calculo = calcularJornadasYHoras(
            item.title,
            item.start_time,
            item.end_time,
            [...initialGroupsState, ...baseGroups],
            group.id
          );
          
          totals.jor += calculo.jornadasNormales;
          totals.hrsNor += parseFloat(calculo.horasNormales.toFixed(2));
          totals.jorExt += calculo.jornadasExtras;
          totals.hrsExt += parseFloat(calculo.horasExtras.toFixed(2));
        });

        return { ...group, ...totals };
      });

      setGroups([...initialGroupsState, ...groupsWithCalculations]);
      setItems(mappedItems);
    }
  }, [props.initialData]);

  useEffect(() => {
    if (comboBox1) {
      obtenerEmpleados(comboBox1)
        .then(response => setDataForComboBox2(response))
        .catch(error => {
          console.error("Error al obtener empleados:", error);
          setDataForComboBox2([]);
        });
    } else {
      setDataForComboBox2([]);
    }
  }, [comboBox1]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Delete") {
        handleDeleteItem();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedItemId]);

  const actualizarHorasEnGrupo = (groupId, titulo, startTime, endTime, operacion = "sumar") => {
    setGroups(prevGroups => {
      const grupo = prevGroups.find(g => g.id === groupId);
      if (!grupo) return prevGroups;

      const calculo = calcularJornadasYHoras(
        titulo,
        startTime,
        endTime,
        prevGroups,
        groupId
      );

      return prevGroups.map(group => 
        group.id === groupId
          ? {
              ...group,
              jor: operacion === "sumar" ? 
                group.jor + calculo.jornadasNormales : 
                group.jor - calculo.jornadasNormales,
              hrsNor: operacion === "sumar" ? 
                parseFloat((group.hrsNor + calculo.horasNormales).toFixed(2)) : 
                parseFloat((group.hrsNor - calculo.horasNormales).toFixed(2)),
              jorExt: operacion === "sumar" ? 
                group.jorExt + calculo.jornadasExtras : 
                group.jorExt - calculo.jornadasExtras,
              hrsExt: operacion === "sumar" ? 
                parseFloat((group.hrsExt + calculo.horasExtras).toFixed(2)) : 
                parseFloat((group.hrsExt - calculo.horasExtras).toFixed(2)),
            }
          : group
      );
    });
  };

  const handleItemMove = (itemId, dragTime, newGroupOrder) => {
    const startOfDay = moment(dragTime).startOf("day").valueOf();
    setItems(prevItems =>
      prevItems.map(item =>
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
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          const oldStartTime = item.start_time;
          const oldEndTime = item.end_time;

          const newTimes = {
            start_time: edge === "left" ? moment(time).startOf("day").valueOf() : item.start_time,
            end_time: edge === "right" ? moment(time).startOf("day").add(1, "days").valueOf() : item.end_time
          };

          actualizarHorasEnGrupo(item.group, item.title, oldStartTime, oldEndTime, "restar");
          actualizarHorasEnGrupo(item.group, item.title, newTimes.start_time, newTimes.end_time, "sumar");

          return { ...item, ...newTimes };
        }
        return item;
      })
    );
  };

  const handleDeleteItem = () => {
    if (selectedItemId !== null) {
      const itemToDelete = items.find(item => item.id === selectedItemId);
      if (itemToDelete) {
        actualizarHorasEnGrupo(
          itemToDelete.group,
          itemToDelete.title,
          itemToDelete.start_time,
          itemToDelete.end_time,
          "restar"
        );
        setItems(prevItems => prevItems.filter(item => item.id !== selectedItemId));
        setSelectedItemId(null);
      }
    }
  };

  const handleCanvasClick = (groupId, time) => {
    const startOfDay = moment(time).startOf("day").valueOf();
    const endOfDay = startOfDay + 86400000;

    const newItem = {
      id: Date.now(),
      group: groupId,
      title: itemTitle,
      start_time: startOfDay,
      end_time: endOfDay,
    };

    setItems(prevItems => [...prevItems, newItem]);
    actualizarHorasEnGrupo(groupId, itemTitle, startOfDay, endOfDay, "sumar");
  };

  const handleDeleteGroup = (groupId) => {
    setGroups(prevGroups => prevGroups.filter(group => group.id !== groupId));
    setItems(prevItems => prevItems.filter(item => item.group !== groupId));
  };

  const handleComboBox2Change = (e) => {
    const selectedValue = e.target.value;
    setComboBox2(selectedValue);

    const selectedEmpleado = dataForComboBox2.find(item => item.nombre === selectedValue);
    if (!selectedEmpleado) return;

    const newGroup = {
      id: generateRandomId(),
      title: selectedEmpleado.nombre,
      hrsXJor: parseFloat(selectedEmpleado.hrsxjor),
      jor: 0,
      hrsNor: 0,
      jorExt: 0,
      hrsExt: 0,
      id_empleado: selectedEmpleado.id_empleado,
    };

    setGroups(prevGroups => [...prevGroups, newGroup]);
  };

  const handleOpenGroupModal = (groupId) => {
    const group = groups.find(g => g.id === groupId && !g.isHeader);
    if (group) {
      setSelectedGroup(group);
      setTempHrsXJor(group.hrsXJor.toString());
      setOpenModal(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedGroup(null);
  };

  const handleSaveHrsXJor = () => {
    const hrsXJorValue = parseFloat(tempHrsXJor);
    if (!selectedGroup || isNaN(hrsXJorValue) || hrsXJorValue <= 0) return;

    // Crear una copia actualizada de los grupos con el nuevo hrsXJor
    const updatedGroups = groups.map(group => 
      group.id === selectedGroup.id 
        ? { ...group, hrsXJor: hrsXJorValue }
        : group
    );

    // Recalcular todas las horas para este grupo
    const groupItems = items.filter(item => item.group === selectedGroup.id);
    let newCalculations = { jor: 0, hrsNor: 0, jorExt: 0, hrsExt: 0 };

    groupItems.forEach(item => {
      const calculo = calcularJornadasYHoras(
        item.title,
        item.start_time,
        item.end_time,
        updatedGroups,
        selectedGroup.id
      );
      
      newCalculations.jor += calculo.jornadasNormales;
      newCalculations.hrsNor += parseFloat(calculo.horasNormales.toFixed(2));
      newCalculations.jorExt += calculo.jornadasExtras;
      newCalculations.hrsExt += parseFloat(calculo.horasExtras.toFixed(2));
    });

    // Actualizar el estado
    setGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === selectedGroup.id 
          ? { 
              ...group, 
              hrsXJor: hrsXJorValue,
              ...newCalculations 
            }
          : group
      )
    );

    handleCloseModal();
  };

  const groupRenderer = ({ group }) => {
    if (group.isHeader) {
      return (
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          fontWeight: "bold", 
          backgroundColor: "#f0f0f0", 
          fontSize: "9px" 
        }}>
          <div style={{ width: "80px", padding: "0 8px" }}>Empleado</div>
          <div style={{ width: "45px", padding: "0 8px" }}>Hrs/Jor</div>
          <div style={{ width: "40px", padding: "0 8px" }}>Jorn</div>
          <div style={{ width: "40px", padding: "0 8px" }}>Hrs Nor</div>
          <div style={{ width: "40px", padding: "0 8px" }}>Jorn Ext</div>
          <div style={{ width: "40px", padding: "0 8px" }}>Hrs Ext</div>
        </div>
      );
    }

    return (
      <div 
        style={{ 
          display: "flex", 
          alignItems: "center", 
          fontSize: "9px",
          cursor: "pointer",
          backgroundColor: selectedGroup?.id === group.id ? "#e3f2fd" : "transparent"
        }}
        onClick={() => handleOpenGroupModal(group.id)}
      >
        <div style={{ width: "100px", padding: "0 8px" }}>
          {group.title.length > 15 ? `${group.title.substring(0, 15)}...` : group.title}
        </div>
        <div style={{ width: "50px", padding: "0 8px" }}>{group.hrsXJor.toFixed(2)}</div>
        <div style={{ width: "40px", padding: "0 8px" }}>{group.jor}</div>
        <div style={{ width: "50px", padding: "0 8px" }}>{group.hrsNor.toFixed(2)}</div>
        <div style={{ width: "50px", padding: "0 8px" }}>{group.jorExt}</div>
        <div style={{ width: "50px", padding: "0 8px" }}>{group.hrsExt.toFixed(2)}</div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteGroup(group.id);
          }}
          style={{ 
            marginLeft: "8px", 
            fontSize: "9px", 
            padding: "2px 4px", 
            backgroundColor: "#ff4444", 
            color: "white", 
            border: "none", 
            borderRadius: "4px", 
            cursor: "pointer" 
          }}
        >
          Eliminar
        </button>
      </div>
    );
  };

  const exportData = () => ({
    groups: groups
      .filter(group => !group.isHeader)
      .map(group => ({
        id: group.id,
        title: group.id_empleado.toString(),
        hrsXJor: group.hrsXJor,
        jor: group.jor,
        hrsNor: group.hrsNor,
        jorExt: group.jorExt,
        hrsExt: group.hrsExt,
      })),
    items: items.map(item => ({
      group: item.group,
      title: item.title,
      start_time: item.start_time,
      end_time: item.end_time,
    }))
  });

  useImperativeHandle(ref, () => ({ exportData }));

  const handleNumericInputChange = (value, setter) => {
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setter(value);
    }
  };

  return (
    <div className="p-4">
      <br />
      <Grid container spacing={2} alignItems="center" marginBottom={2}>
        <Grid item xs={3}>
          <TextField
            select
            label="Tipo de empleado"
            value={comboBox1}
            onChange={(e) => setComboBox1(e.target.value)}
            fullWidth
            variant="outlined"
          >
            <MenuItem value={1}>Indirecto</MenuItem>
            <MenuItem value={2}>Horas Taller</MenuItem>
            <MenuItem value={3}>Horas Cargill</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={3}>
          <TextField
            select
            label="Seleccionar empleado"
            value={comboBox2}
            onChange={handleComboBox2Change}
            fullWidth
            variant="outlined"
            disabled={!comboBox1}
          >
            {dataForComboBox2.map((item) => (
              <MenuItem key={item.id_empleado} value={item.nombre}>
                {item.nombre}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={2}>
          <TextField
            label="Jornadas por día"
            value={itemTitle}
            onChange={(e) => handleNumericInputChange(e.target.value, setItemTitle)}
            fullWidth
            variant="outlined"
            inputProps={{
              inputMode: 'decimal',
              pattern: '[0-9]*\\.?[0-9]*'
            }}
          />
        </Grid>
      </Grid>

      <Timeline
        groups={groups}
        items={items}
        defaultTimeStart={defaultTimeStart}
        defaultTimeEnd={defaultTimeEnd}
        timeSteps={{ day: 1 }}
        lineHeight={30}
        sidebarWidth={350}
        canMove={true}
        canResize="both"
        traditionalZoom={false}
        onItemMove={handleItemMove}
        onItemResize={handleItemResize}
        onCanvasClick={handleCanvasClick}
        onItemSelect={(itemId) => setSelectedItemId(itemId)}
        onItemDeselect={() => setSelectedItemId(null)}
        groupRenderer={groupRenderer}
        itemRenderer={({ item, getItemProps }) => (
          <div
            {...getItemProps()}
            style={{
              ...getItemProps().style,
              background: item.id === selectedItemId ? "#e3f2fd" : "#64b5f6",
              borderRadius: "4px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              color: "#fff",
            }}
          >
            {item.title}
          </div>
        )}
      />

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
            Editar Horas por Jornada
          </Typography>
          <Typography id="modal-modal-description" sx={{ mb: 2 }}>
            Empleado: {selectedGroup?.title}
          </Typography>
          
          <TextField
            label="Horas por Jornada"
            value={tempHrsXJor}
            onChange={(e) => handleNumericInputChange(e.target.value, setTempHrsXJor)}
            fullWidth
            sx={{ mb: 3 }}
            inputProps={{
              inputMode: 'decimal',
              pattern: '[0-9]*\\.?[0-9]*'
            }}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSaveHrsXJor}
              disabled={!tempHrsXJor || parseFloat(tempHrsXJor) <= 0}
            >
              Guardar
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
});

export default CronogramaEmpleados;