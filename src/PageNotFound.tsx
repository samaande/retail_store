import React from "react";
import page from "./components/Images/page.jpg";
import {
  Container,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

export const PageNotFound = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column", // Change to column direction
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <img
        src={page}
        alt="Page Not Found"
        style={{
          maxWidth: "50%",
          maxHeight: "50%",
          borderRadius: "4px",
        }}
      />
      <br />
      <div>
        <Button variant="contained" color="primary">
          <Link
            to="/dashboard"
            style={{ color: "white", textDecoration: "none" }}
          >
            GO TO HOME
          </Link>
        </Button>
      </div>
    </div>
  );
};
