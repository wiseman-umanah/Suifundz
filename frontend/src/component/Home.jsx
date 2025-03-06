import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import Image from "../assets/Cards.svg";

const Home = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  return (
    <Box
      sx={{
        // width: "8%",
        height: "100vh",

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AppBar
        position="static"
        sx={{
          backgroundColor: "transparent", // Removes background
          boxShadow: "none", // Removes shadow
          width: "90%",
          // border: "1px solid red",
          padding: 0,
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            color="#000000"
            sx={{ flexGrow: 1, fontWeight: "bold", padding: 0, margin: 0 }}
          >
            Suifundz
          </Typography>

          {/* Desktop Links */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Button
              variant="contained"
              color="primary"
              backgroundColor="#000000"
              size="large"
              sx={{ backgroundColor: "#000000", borderRadius: "50px" }}
            >
              Get Started
            </Button>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            edge="end"
            sx={{ display: { md: "none" } }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexGrow: 1,
          width: "90%",
          padding: "20px",

          // border: "1px solid red",
        }}
      >
        <Box sx={{ width: "40%" }}>
          <Typography
            variant="h2"
            fontWeight="bold"
            gutterBottom
            color="#000000"
            position="relative"
          >
            Connecting You To The Future Of Finance
          </Typography>

          <Button
            variant="contained"
            color="primary"
            backgroundColor="#000000"
            size="large"
            sx={{
              backgroundColor: "#000000",
              borderRadius: "50px",
              marginTop: "15px",
            }}
          >
            Get Started
          </Button>
        </Box>
        <Box sx={{ width: "40%" }}>
          <img src={Image} alt="img" className="w-full" />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
