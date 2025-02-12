import React, { useState, useEffect } from "react";
import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/dist/style.css";
import moment from "moment";
import indirecto from "../../data/Indirecto-items";
import horas from "../../data/Taller-Cargill";
import { Grid, TextField, MenuItem } from "@mui/material";

const TimelineComponent = () => {
  const groups = [
    { id: 1, title: "Indirecto" },
    { id: 2, title: "Horas Taller" },
    { id: 3, title: "Horas Cargill" },
  ];

  const [items, setItems] = useState([
    {
      id: 1,
      group: 1,
      title: "1",
      start_time: moment().startOf("day").subtract(2, "days").valueOf(),
      end_time: moment().startOf("day").subtract(1, "days").valueOf(),
    },
    {
      id: 2,
      group: 2,
      title: "2",
      start_time: moment().startOf("day").add(1, "days").valueOf(),
      end_time: moment().startOf("day").add(2, "days").valueOf(),
    },
  ]);

  const defaultTimeStart = moment().startOf("day").subtract(7, "days");
  const defaultTimeEnd = moment().startOf("day").add(30, "days");

  const [editingItemId, setEditingItemId] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const [comboBox1, setComboBox1] = useState("");
  const [comboBox2, setComboBox2] = useState("");
  const [dataForComboBox2, setDataForComboBox2] = useState([]);

  useEffect(() => {
    // Cambiar los datos según la opción seleccionada en comboBox1
    if (comboBox1 === "indirecto") {
      setDataForComboBox2(indirecto);
    } else if (comboBox1 === "taller" || comboBox1 === "cargill") {
      setDataForComboBox2(horas);
    } else {
      setDataForComboBox2([]);
    }
  }, [comboBox1]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        handleDeleteItem();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedItemId]);

  const handleItemDoubleClick = (itemId) => {
    setEditingItemId(itemId);
    setTimeout(() => {
      const input = document.getElementById(`input-${itemId}`);
      if (input) {
        input.focus();
        input.select();
      }
    }, 0);
    setSelectedItemId(itemId);
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
          if (edge === "left") {
            return { ...item, start_time: moment(time).startOf("day").valueOf() };
          } else {
            return { ...item, end_time: moment(time).startOf("day").add(1, "days").valueOf() };
          }
        }
        return item;
      })
    );
  };

  const handleTitleChange = (itemId, newTitle) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, title: newTitle } : item))
    );
  };

  const handleDeleteItem = () => {
    if (selectedItemId !== null) {
      setItems((prevItems) => prevItems.filter((item) => item.id !== selectedItemId));
      setSelectedItemId(null);
    }
  };

  const handleCanvasClick = (groupId, time) => {
    const startOfDay = moment(time).startOf("day").valueOf();
    const newItem = {
      id: items.length + 1,
      group: groupId,
      title: "1",
      start_time: startOfDay,
      end_time: startOfDay + 24 * 60 * 60 * 1000, // Duración de 1 día
    };
    setItems((prevItems) => [...prevItems, newItem]);
  };

  const handleBlur = () => {
    setEditingItemId(null); // Cierra el input al perder el foco
  };

  const handleKeyDown = (e, itemId) => {
    if (e.key === "Enter") {
      setEditingItemId(null); // Cierra el input al presionar Enter
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Cronograma con Jornada</h2>
      {/* Grid para los ComboBox alineados al principio */}
      <Grid container spacing={2} alignItems="center" marginBottom={2}>
        <Grid item xs={3}>
          <TextField
            select
            label="Opción 1"
            value={comboBox1}
            onChange={(e) => setComboBox1(e.target.value)}
            fullWidth
            variant="outlined"
          >
            <MenuItem value="indirecto">Indirecto</MenuItem>
            <MenuItem value="taller">Horas Taller</MenuItem>
            <MenuItem value="cargill">Horas Cargill</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={3}>
          <TextField
            select
            label="Opción 2"
            value={comboBox2}
            onChange={(e) => setComboBox2(e.target.value)}
            fullWidth
            variant="outlined"
          >
            {dataForComboBox2.map((item) => (
              <MenuItem key={item.key} value={item.key}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
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
        headerLabelFormats={{
          day: { long: "dddd D MMMM", medium: "ddd D MMM", short: "ddd D" },
        }}
        onItemMove={handleItemMove}
        onItemResize={handleItemResize}
        onCanvasClick={handleCanvasClick}
        itemRenderer={({ item, getItemProps }) => (
          <div
            {...getItemProps()}
            onClick={() => setSelectedItemId(item.id)}
            className={`cursor-pointer text-center ${item.id === selectedItemId ? "bg-blue-100" : ""}`}
          >
            {editingItemId === item.id ? (
              <input
                id={`input-${item.id}`}
                type="text"
                value={item.title}
                onChange={(e) => handleTitleChange(item.id, e.target.value)}
                onBlur={handleBlur}
                onKeyDown={(e) => handleKeyDown(e, item.id)}
                autoFocus
                className="border p-1 w-full text-center"
                style={{
                  width: "30px",
                  height: "20px",
                  fontSize: "12px",
                  padding: "2px",
                }}
              />
            ) : (
              <div onDoubleClick={() => handleItemDoubleClick(item.id)}>{item.title}</div>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default TimelineComponent;