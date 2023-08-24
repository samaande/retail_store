import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import {
  Card,
  Typography,
  List ,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  FormHelperText,
} from "@mui/material";
import { Dialog, DialogActions, DialogTitle } from "@mui/material";
import axios from "axios";
import { Category } from "../Interfaces/Category";
import { useParams } from "react-router-dom";
export const EditProduct = () => {
  const [productType, setProductType] = useState("");
  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [cost, setCost] = useState("");
  const [manufactureDate, setManufactureDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [description, setDescription] = useState("");
  const [productTypeError, setProductTypeError] = useState("");
  const [productCodeError, setProductCodeError] = useState("");
  const [nameError, setNameError] = useState("");
  const [costError, setCostError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [manufactureDateError, setManufactureDateError] = useState("");
  const [expiryDateError, setExpiryDateError] = useState("");
  const [productTypes, setProductTypes] = useState<Category[] | null>();
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const handleOKClick = () => {
    setOpen(false);
    window.location.href = "/view";
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await axios.get(
          `http://localhost:8000/category`
        );
        setProductTypes(categoryResponse.data);

        const productResponse = await axios.get(
          `http://localhost:7000/products/` + id
        );
        const oldProduct = productResponse.data;
        console.log(oldProduct);
        setProductType(oldProduct.productType);
        setProductCode(oldProduct.productCode);
        setProductName(oldProduct.productName);
        setCost(oldProduct.cost);
        setManufactureDate(oldProduct.manufactureDate);
        setExpiryDate(oldProduct.expiryDate);
        setDescription(oldProduct.description);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
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
      setProductCode("");
    }
    if (!productName) {
      setNameError("Name required");
      isFormValid = false;
    } else {
      setNameError("");
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
    if (!manufactureDate) {
      setManufactureDateError("Manufacture date is required");
      isFormValid = false;
    } else {
      setManufactureDateError("");
    }
    if (!expiryDate) {
      setExpiryDateError("Expiry date is required");
      isFormValid = false;
    } else {
      setExpiryDateError("");
    }
    if (!isFormValid) {
      return;
    }
    axios
      .put(`http://localhost:7000/products/` + id, data)
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
            Edit Product
          </Typography>
          <form>
            <FormControl fullWidth error={Boolean(productTypeError)}>
              <InputLabel id="type">Product Type</InputLabel>
              <Select
                labelId="type"
                id="type"
                value={productType}
                label="Product Type"
                name="productType"
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
              name="name"
              onChange={(e) => handleInput(e, setProductName, setNameError)}
              error={Boolean(nameError)}
              helperText={nameError}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Product Code"
                  name="productCode"
                  value={productCode}
                  onChange={(e) =>
                    handleInput(e, setProductCode, setProductCodeError)
                  }
                  error={Boolean(productCodeError)}
                  helperText={productCodeError}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Cost"
                  name="cost"
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
                  name="manufatureDate"
                  type="date"
                  value={manufactureDate}
                  onChange={(e) =>
                    handleInput(e, setManufactureDate, setManufactureDateError)
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
                  name="expiryDate"
                  value={expiryDate}
                  onChange={(e) =>
                    handleInput(e, setExpiryDate, setExpiryDateError)
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
              name="description"
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
        <DialogTitle>Product updated successfully.</DialogTitle>
        <DialogActions>
          <Button onClick={handleOKClick}>OK</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
