import React, { useState, useEffect, useImperativeHandle } from "react";
import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/dist/style.css";
import moment from "moment";
import { Grid, TextField, Button, Modal, Box, Typography } from "@mui/material";

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

const CronogramaEquipo = React.forwardRef((props, ref) => {
  const [groups, setGroups] = useState([
    {
      id: generateRandomId(),
      title: "Encabezado",
      isHeader: true,
    },
  ]);
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [itemTitle, setItemTitle] = useState("1");
  
  const [openModal, setOpenModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [tempHrsXJor, setTempHrsXJor] = useState("");

  const defaultTimeStart = moment().startOf("day").subtract(7, "days");
  const defaultTimeEnd = moment().startOf("day").add(30, "days");

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Delete") {
        handleDeleteItem();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedItemId]);

  const esFinDeSemana = (fecha) => {
    const dia = moment(fecha).day();
    return dia === 0 || dia === 6;
  };

  const calcularJornadasYHoras = (titulo, startTime, endTime, hrsXJor) => {
    const tituloNum = parseFloat(titulo) || 0;
    const duracionDias = moment(endTime).diff(moment(startTime), "days");
    const numeroJornadas = tituloNum * duracionDias;

    let jornadasExtras = 0;
    let horasExtras = 0;

    for (let i = 0; i < duracionDias; i++) {
      const fecha = moment(startTime).add(i, "days");
      if (esFinDeSemana(fecha)) {
        jornadasExtras += tituloNum;
        horasExtras += tituloNum * hrsXJor;
      }
    }

    return {
      jornadasNormales: numeroJornadas - jornadasExtras,
      horasNormales: (numeroJornadas - jornadasExtras) * hrsXJor,
      jornadasExtras,
      horasExtras,
    };
  };

  const recalcularGrupoCompleto = (groupId, nuevoHrsXJor) => {
    const grupoItems = items.filter(item => item.group === groupId);
    
    let totalJornadasNormales = 0;
    let totalHorasNormales = 0;
    let totalJornadasExtras = 0;
    let totalHorasExtras = 0;

    grupoItems.forEach(item => {
      const calculo = calcularJornadasYHoras(
        item.title,
        item.start_time,
        item.end_time,
        nuevoHrsXJor
      );
      
      totalJornadasNormales += calculo.jornadasNormales;
      totalHorasNormales += calculo.horasNormales;
      totalJornadasExtras += calculo.jornadasExtras;
      totalHorasExtras += calculo.horasExtras;
    });

    return {
      jor: totalJornadasNormales,
      hrsNor: parseFloat(totalHorasNormales.toFixed(2)),
      jorExt: totalJornadasExtras,
      hrsExt: parseFloat(totalHorasExtras.toFixed(2)),
    };
  };

  const actualizarHorasEnGrupo = (groupId, titulo, startTime, endTime, operacion = "sumar") => {
    setGroups(prevGroups => {
      const grupo = prevGroups.find(g => g.id === groupId);
      if (!grupo) return prevGroups;

      const calculo = calcularJornadasYHoras(
        titulo,
        startTime,
        endTime,
        grupo.hrsXJor
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

  const handleAddGroup = () => {
    if (inputValue.trim() === "") return;

    const groupExists = groups.some(group => group.title === inputValue);
    if (!groupExists) {
      const newGroup = {
        id: generateRandomId(),
        title: inputValue,
        hrsXJor: 8,
        jor: 0,
        hrsNor: 0,
        jorExt: 0,
        hrsExt: 0,
      };
      setGroups(prevGroups => [...prevGroups, newGroup]);
      setInputValue("");
    }
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

    const nuevosCalculos = recalcularGrupoCompleto(selectedGroup.id, hrsXJorValue);

    setGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === selectedGroup.id 
          ? { 
              ...group, 
              hrsXJor: hrsXJorValue,
              ...nuevosCalculos
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
          <div style={{ width: "100px", padding: "0 8px" }}>Equipo/Material</div>
          <div style={{ width: "50px", padding: "0 8px" }}>Hrs/Jor</div>
          <div style={{ width: "40px", padding: "0 8px" }}>Jorn</div>
          <div style={{ width: "50px", padding: "0 8px" }}>Hrs Nor</div>
          <div style={{ width: "50px", padding: "0 8px" }}>Jorn Ext</div>
          <div style={{ width: "50px", padding: "0 8px" }}>Hrs Ext</div>
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
        title: group.title,
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
            Equipo/Material: {selectedGroup?.title}
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

export default CronogramaEquipo;