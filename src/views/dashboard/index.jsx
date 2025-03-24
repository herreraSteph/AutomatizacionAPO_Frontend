import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import fondo from "../../assets/images/Registro/fondo.png";

const Banner = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isVisible, setIsVisible] = useState(false);

  // Activar animaciones después de que el componente se monta
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        backgroundColor: "#FFFFFF",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Sección de texto */}
      <Box
        sx={{
          width: isMobile ? "100%" : "50%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: isMobile ? "40px 20px" : "60px 40px",
          textAlign: "center",
          zIndex: 2,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(50px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontFamily: "'Merriweather', serif",
            fontWeight: "bold",
            fontSize: isMobile ? "2.5rem" : "4rem",
            color: "#1E3A3A",
            marginBottom: "20px",
            lineHeight: 1.2,
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          Bienvenido Serman
        </Typography>

        <Typography
          variant="h6"
          sx={{
            fontStyle: "italic",
            fontSize: isMobile ? "0.9rem" : "1.2rem",
            color: "#4A7C7C",
            marginTop: "10px",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
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
          zIndex: 1,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateX(0)" : "translateX(50px)",
          transition: "opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.3)",
          },
        }}
      />
    </Box>
  );
};

export default Banner;