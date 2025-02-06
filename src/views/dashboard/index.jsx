import { Box, Typography, useMediaQuery, useTheme } from "@mui/material"; 
import React from "react";
import fondo from "../../assets/images/Registro/fondo.png";

const Banner = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        backgroundColor: "#FFFFFF", // Fondo blanco
      }}
    >
      {/* Sección de texto */}
      <Box
        sx={{
          width: isMobile ? "100%" : "50%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start", // Mueve el contenido más arriba
          alignItems: "center",
          padding: isMobile ? "40px 20px" : "60px 40px", // Ajuste de padding
          textAlign: "center",
          marginTop: isMobile ? "30px" : "100px", // Ajusta el margen superior para mover el contenido hacia abajo
          maxWidth: isMobile ? "100%" : "90%", // Limita el ancho del contenedor de texto en pantallas grandes
          overflow: "hidden", // Asegura que el texto no se desborde
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontFamily: "'Merriweather', serif", // Cambiado a Merriweather
            fontWeight: "bold",
            fontSize: isMobile ? "2.5rem" : "4rem", // Aumento el tamaño del título en pantallas grandes
            color: "#1E3A3A",
            marginBottom: "10px",
            lineHeight: 1.2, // Ajusta la altura de línea para más espacio
            overflowWrap: "break-word", // Permite que el texto se ajuste y no se desborde
            wordBreak: "break-word", // Divide las palabras largas que puedan desbordarse
            width: "100%", // Asegura que el título ocupe todo el espacio disponible
            paddingLeft: isMobile ? "20px" : "40px", // Asegura que haya espacio al costado izquierdo
            paddingRight: isMobile ? "20px" : "40px", // Asegura que haya espacio al costado derecho
          }}
        >
          Bienvenido Serman
        </Typography>

        <Typography
          variant="h6"
          sx={{
            fontStyle: "italic",
            fontSize: isMobile ? "0.7rem" : "1rem", // Reduce el tamaño de la frase
            color: "#4A7C7C",
            marginTop: "10px", // Añade un poco de espacio entre el título y la frase
          }}
        >
          "Tu trabajo va a llenar gran parte de tu vida, la única forma de estar realmente satisfecho es
          hacer lo que crees que es un gran trabajo." – Steve Jobs
        </Typography>
      </Box>

      {/* Sección de imagen */}
      <Box
        sx={{
          width: isMobile ? "100%" : "50%",
          height: isMobile ? "50vh" : "100vh",
          backgroundImage: `url(${fondo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
        }}
      />
    </Box>
  );
};

export default Banner;
