import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Grid,
  Divider,
} from "@mui/material";
import { Product } from "../Interfaces/Products";
import { createEmitAndSemanticDiagnosticsBuilderProgram } from "typescript";
import { Category } from "../Interfaces/Category";
import { Cart } from "../Interfaces/CartIn";
import CartDetails from "../Cart/CartDetails";
function Order() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();
  const [productTypes, setProductTypes] = useState<Category[] | null>();
  const [productName, setProductName] = useState<Product[] | null>();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [cartItems, setCartItems] = useState<Cart[] | null>();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/category`)
      .then((res) => {
        setProductTypes(res.data);
        setProductName(null);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleFormSubmit = (data: any) => {
    const orderData = {
      custId: sessionStorage.getItem("custId"),
      productType: data.productType,
      productName: data.productName,
      quantity: data.quantity,
    };

    axios
      .post(`http://localhost:8092/cart`, orderData)
      .then((res) => {
        console.log(res.data);
        setFormSubmitted(true);
        reset();
      })
      .catch((error) => console.log(error));
  };

  const handleProductTypeChange = async (event: any) => {
    const val = event.target.value;
    try {
      const response = await axios.get(`http://localhost:7000/products`);
      const vale: Product[] = response.data;
      const modvale = vale.filter((n) => n.productType === val);
      setProductName(modvale);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Card
          elevation={3}
          style={{
            padding: "20px",
            marginLeft: "400px",
            marginRight: "20px",
            marginTop: "20px",
            flex: 1,
            backgroundColor: "#e9e5da",
          }}
        >
        <Typography variant="h6" gutterBottom style={{color: "olive" }}>
            Place Order
          </Typography>
        <Divider style={{ marginBottom: "10px", backgroundColor: "black" }} />
        <form onSubmit={handleSubmit(handleFormSubmit)} style={{marginBottom:'10px'}}>
          <div className="mb-3 d-flex align-items-center">
            <FormControl fullWidth style={{marginRight:'5px'}}>
              <InputLabel id="type">Product Type</InputLabel>
              <Select
                labelId="type"
                id="type"
                label="Product Type"
                onChange={handleProductTypeChange}
                error={Boolean(errors.productType)}
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
            </FormControl>
            <FormControl fullWidth style={{marginRight:'5px'}}>
              <InputLabel id="type">Product Name</InputLabel>
              <Select
                labelId="type"
                id="type"
                label="Product Name"
                error={Boolean(errors.productName)}
                {...register("productName", { required: true })}
              >
                <MenuItem disabled value="">
                  Select a Product Type
                </MenuItem>
                {productName?.map((type) => (
                  <MenuItem key={type.id} value={type.productName}>
                    {type.productName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Quantity"
              type="number"
              fullWidth
              error={Boolean(errors.quantity)}
              {...register("quantity", { required: true })}
            />
            <div className="mb-3" style={{marginLeft:'5px',marginTop:'25px'}}>
              <Button type="submit" variant="contained" color="success">
                Save 
              </Button>
            </div>
          </div>
        </form>
      </Card>

      <div>
        {formSubmitted ? (
          <div>
            <div>
              <Grid item xs={12} sm={6}>
                <CartDetails />
              </Grid>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
export default Order;
