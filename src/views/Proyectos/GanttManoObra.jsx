import React, { useState, useEffect } from "react";
import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/dist/style.css";
import moment from "moment";
import indirecto from "../../data/Indirecto-items";

const TimelineComponent = () => {
  // Definir más grupos (columnas)
  const groups = [
    ...indirecto.map((item, index) => ({
      id: index + 1, // Asigna un id único para cada grupo
      title: item.label, // Usamos el label como el título del grupo
    }))
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
    // Items en las nuevas columnas
    {
      id: 3,
      group: 4, // Asignado a la columna extra 1
      title: "3",
      start_time: moment().startOf("day").subtract(1, "days").valueOf(),
      end_time: moment().startOf("day").add(1, "days").valueOf(),
    },
    {
      id: 4,
      group: 5, // Asignado a la columna extra 2
      title: "4",
      start_time: moment().startOf("day").subtract(2, "days").valueOf(),
      end_time: moment().startOf("day").add(2, "days").valueOf(),
    },
  ]);

  const defaultTimeStart = moment().startOf("day").subtract(7, "days");
  const defaultTimeEnd = moment().startOf("day").add(30, "days");

  const [editingItemId, setEditingItemId] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);

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

  // Añadimos un useEffect para manejar la tecla Delete globalmente
  useEffect(() => {
    const handleDeleteKey = (e) => {
      if (e.key === "Delete" && selectedItemId !== null) {
        handleDeleteItem(); // Elimina el item si la tecla es "Delete"
      }
    };

    window.addEventListener("keydown", handleDeleteKey);

    return () => {
      window.removeEventListener("keydown", handleDeleteKey);
    };
  }, [selectedItemId]); // El evento se ejecuta cuando cambia el selectedItemId

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Cronograma con Jornada</h2>
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
