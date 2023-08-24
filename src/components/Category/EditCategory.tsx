import React, { useEffect, useState } from "react";
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
import { useParams } from "react-router-dom";
export const EditCategory = () => {
  const [productType, setProductType] = useState("");
  const [description, setDescription] = useState("");
  const [productTypeError, setproductTypeError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const handleOKClick = () => {
    setOpen(false);
    window.location.href = "/viewcategory";
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await axios.get(
          `http://localhost:8000/category/` + id
        );
        const oldProduct = productResponse.data;
        console.log(oldProduct);
        setProductType(oldProduct.productType);
        setDescription(oldProduct.description);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  const handleSubmit = async (data: any) => {
    if (!productType) {
      setproductTypeError("Product Type is required");
    } else {
      setproductTypeError("");
    }
    if (!description) {
      setDescriptionError("Description is required");
    } else {
      setDescriptionError("");
    }
    axios
      .put(`http://localhost:8000/category/`+id, data)
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
                handleInput(e, setProductType, setproductTypeError)
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
          <DialogTitle>Category Updated Successfully</DialogTitle>
          <DialogContent>
            <p>Your category has been successfully updated.</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleOKClick}>OK</Button>
          </DialogActions>
        </Dialog>
    </div>
  );
};
