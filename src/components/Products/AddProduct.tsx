import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  Card,
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  FormHelperText,
} from "@mui/material";
import Sidebar from "../Sidebar";
import axios from "axios";
import { Category } from "../Interfaces/Category";
const AddProductForm = () => {
  const [productType, setProductType] = useState("");
  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [cost, setCost] = useState("");
  const [manufactureDate, setManufactureDate] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);
  const [description, setDescription] = useState("");
  const [productTypeError, setProductTypeError] = useState("");
  const [productCodeError, setProductCodeError] = useState("");
  const [productNameError, setProductNameError] = useState("");
  const [costError, setCostError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [manufactureDateError, setManufactureDateError] = useState("");
  const [expiryDateError, setExpiryDateError] = useState("");
  const [productTypes, setProductTypes] = useState<Category[] | null>();
  const [open, setOpen] = useState(false);
  const handleOKClick = () => {
    setOpen(false);
    window.location.href = "/view";
  };
  useEffect(() => {
    axios
      .get(`http://localhost:8000/category`)
      .then((res) => {
        setProductTypes(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
  const handleSubmit = async (data: any) => {
    let isFormValid = true;
    if (!productType) {
      setProductTypeError("Product Type is required");
      isFormValid = false;
    } else {
      setProductTypeError("");
    }
    if (!productCode) {
      setProductCodeError("Product code required");
      isFormValid = false;
    } else {
      setProductCodeError("");
    }
    if (!productName) {
      setProductNameError("Name required");
      isFormValid = false;
    } else {
      setProductNameError("");
    }
    if (!cost) {
      setCostError("cost required");
      isFormValid = false;
    } else {
      setCostError("");
    }
    if (!description) {
      setDescriptionError("Description is required");
      isFormValid = false;
    } else {
      setDescriptionError("");
    }
    if (!isFormValid) {
      return;
    }
    axios
      .post(`http://localhost:7000/products`, data)
      .then((res) => {
        console.log(res.data);
        setOpen(true);
      })
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
          style={{ padding: "20px", maxWidth: "600px", margin: "60px auto" }}
        >
          <Typography variant="h5" gutterBottom style={{ marginLeft: "210px" }}>
            Add Product
          </Typography>
          <form>
            <FormControl fullWidth error={Boolean(productTypeError)}>
              <InputLabel id="type">Product Type</InputLabel>
              <Select
                labelId="type"
                id="type"
                value={productType}
                label="Product Type"
                onChange={(e) =>
                  handleInput(e, setProductType, setProductTypeError)
                }
                error={Boolean(productTypeError)}
              >
                <MenuItem disabled value="">
                  Select a Product Type
                </MenuItem>
                {productTypes?.map((type) => (
                  <MenuItem key={type.id} value={type.productType}>
                    {type.productType}
                  </MenuItem>
                ))}
              </Select>

              {productTypeError && (
                <FormHelperText>{productTypeError}</FormHelperText>
              )}
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              label="Product Name"
              value={productName}
              onChange={(e) =>
                handleInput(e, setProductName, setProductNameError)
              }
              error={Boolean(productNameError)}
              helperText={productNameError}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
              <TextField
                  fullWidth
                  margin="normal"
                  label="Product Code"
                  type="string"
                  value={productCode}
                  onChange={(e) => handleInput(e, setProductCode, setProductCodeError)}
                  error={Boolean(productCodeError)}
                  helperText={productCodeError}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Cost"
                  type="number"
                  value={cost}
                  onChange={(e) => handleInput(e, setCost, setCostError)}
                  error={Boolean(costError)}
                  helperText={costError}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Manufacture Date"
                  type="date"
                  value={manufactureDate || ""}
                  onChange={(e) =>
                    handleInput(
                      e,
                      (value: any) => setManufactureDate(value || null),
                      setManufactureDateError
                    )
                  }
                  error={Boolean(manufactureDateError)}
                  helperText={manufactureDateError}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    max: new Date().toISOString().split("T")[0],
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Expiry Date"
                  type="date"
                  value={expiryDate || ""}
                  onChange={(e) =>
                    handleInput(
                      e,
                      (value: any) => setExpiryDate(value || null),
                      setExpiryDateError
                    )
                  }
                  error={Boolean(expiryDateError)}
                  helperText={expiryDateError}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: new Date().toISOString().split("T")[0],
                  }}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              margin="normal"
              label="Description"
              multiline
              rows={4}
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
              onClick={() =>
                handleSubmit({
                  productType,
                  productCode,
                  productName,
                  cost,
                  manufactureDate,
                  expiryDate,
                  description,
                })
              }
            >
              Submit
            </Button>
          </form>
        </Card>
      </div>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Product Added Successfully</DialogTitle>
        <DialogContent>
          <p>Your product has been successfully added.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOKClick}>OK</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddProductForm;
