import React, { useState } from "react";
import Sidebar from "../Sidebar";
import {
  Card,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
export const AddCategory = () => {
  const [productType, setproductType] = useState("");
  const [description, setDescription] = useState("");
  const [productTypeError, setproductTypeError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [open, setOpen] = useState(false);
  const handleOKClick = () => {
    setOpen(false);
    window.location.href = "/viewcategory";
  };
  const handleSubmit = async (data: any) => {
    let isFormValid = true
    if (!productType) {
      setproductTypeError("Product Type is required");
      isFormValid=false
    } else {
      setproductTypeError("");
    }
    if (!description) {
      setDescriptionError("Description is required");
      isFormValid=false
    } else {
      setDescriptionError("");
    }
    if(!isFormValid){
      return;
    }
    axios
      .post(`http://localhost:8000/category`, data)
      .then((response) => {console.log(response.data)
      setOpen(true)})
      .catch((err) => console.log(err));
  };
  const handleInput = (e: any, setState: any, setErrorState: any) => {
    setState(e.target.value);
    setErrorState("");
  };
  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: "350px" }}>
        <Card
          style={{ padding: "20px", maxWidth: "600px", margin: "180px auto" }}
        >
          <Typography variant="h5" gutterBottom style={{ marginLeft: "210px" }}>
            Add Category
          </Typography>
          <form>
            <TextField
              fullWidth
              margin="normal"
              label="Product Type"
              value={productType}
              onChange={(e) =>
                handleInput(e, setproductType, setproductTypeError)
              }
              error={Boolean(productTypeError)}
              helperText={productTypeError}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Description"
              value={description}
              onChange={(e) =>
                handleInput(e, setDescription, setDescriptionError)
              }
              error={Boolean(descriptionError)}
              helperText={descriptionError}
            />
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={() => handleSubmit({ productType, description })}
            >
              Submit
            </Button>
          </form>
        </Card>
      </div>
      <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Category Added Successfully</DialogTitle>
          <DialogContent>
            <p>Your category has been successfully added.</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleOKClick}>OK</Button>
          </DialogActions>
        </Dialog>
    </div>
  );
};
