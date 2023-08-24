import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Divider,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { Delete } from "@mui/icons-material";
import axios from "axios";
import { Product } from "../Interfaces/Products";
import { Cart } from "../Interfaces/CartIn";
import GetBill from "../Bill/GetBill";
import { styled } from "@mui/material/styles";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "gray",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: "6px 16px",
  },
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));
function Cartt() {
  const [cartItems, setCartItems] = useState<Cart[] | null>();
  const [productData, setProductData] = useState<Product[] | null>();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [open, setOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const navigate = useNavigate()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState<number | null>(
    null
  );
  const gstRate = 18; // 18% GST
  const handleOKClick = () => {
    setOpen(false);
    setCartItems(cartItems?.filter((item) => item.id !== productIdToDelete));
  };

  const handleYesButtonClick = () => {
    setShowConfirmDialog(false);
    if (productIdToDelete !== null) {
      handleSubmit(productIdToDelete);

      setProductIdToDelete(null);
    }
  };

  const handleCancelButtonClick = (id: number) => {
    setProductIdToDelete(id);
    setShowConfirmDialog(true);
  };
  const handleNoButtonClick = () => {
    setShowConfirmDialog(false);
  };
  useEffect(() => {
    axios
      .get(`http://localhost:8092/cart`)
      .then((res) => {
        const filteredCartItems = res.data.filter(
          (item: Cart) => item.custId === sessionStorage.getItem("custId")
        );
        setCartItems(filteredCartItems);
      })
      .catch((err) => console.log(err));

    axios
      .get(`http://localhost:7000/products`)
      .then((res) => {
        setProductData(res.data);
      })
      .catch((err) => console.log(err));
  }, [cartItems]);
  const getCostPerItem = (productName: string) => {
    const product = productData?.find(
      (product) => product.productName === productName
    );
    return product?.cost || 0;
  };

  const handleSubmit = (id: number) => {
    axios
      .delete(`http://localhost:8092/cart/` + id)
      .then((res) => {
        setOpen(true);
        console.log(res.data)
      })
      .catch((err) => console.log(err));
  };

  // Calculate total cart cost
  const totalCartCost =
    cartItems?.reduce(
      (total, item) => total + item.quantity * getCostPerItem(item.productName),
      0
    ) || 0;
    console.log(totalCartCost)
    sessionStorage.setItem('totalCartCost',totalCartCost.toString())
  const gstAmount = (totalCartCost * gstRate) / 100;
  const price = Math.round(totalCartCost + gstAmount);
  sessionStorage.setItem('price',price.toString())
  const saveDetails = () => {
    if (cartItems) {
      const detailsToSave = cartItems.map((item) => ({
        custId: item.custId,
        productId: item.id,
        productName: item.productName,
        costPerItem: getCostPerItem(item.productName),
        quantity: item.quantity,
        totalCost: price,
      }));

      // Include the total cart cost in the detailsToSave array
      const totalCartCost = detailsToSave.reduce(
        (total, item) => total + item.totalCost,
        0
      );
      console.log("...................",detailsToSave);
      console.log(totalCartCost);
      axios.post('http://localhost:8095/Bill', {
      cartDetails: detailsToSave,
    })
      .then(res => {
        console.log(res.data)
        console.log('Cart details saved successfully');
        setSuccessDialogOpen(true)
        
        sessionStorage.setItem('BillId',res.data)
         setFormSubmitted(true)
      })
      .catch(error => {
        console.error('Error saving cart details:', error);
      });
    }
  };
const handleSuccessClick = () =>{
  setSuccessDialogOpen(false)
  navigate("/billdata")
}
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
        <Typography variant="h6" gutterBottom style={{ color: "olive" }}>
          Cart Details
        </Typography>
        <Divider style={{ marginBottom: "10px", backgroundColor: "black" }} />
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell align="center">Product Name</StyledTableCell>
                  <StyledTableCell align="center">Quantity</StyledTableCell>
                  <StyledTableCell align="center">
                    Cost Per Item
                  </StyledTableCell>
                  <StyledTableCell align="center">Total Cost</StyledTableCell>
                  <StyledTableCell align="center">Delete</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {cartItems?.map((product) => (
                  <StyledTableRow key={product.id}>
                    <StyledTableCell align="center">
                      {product.productName}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {product.quantity}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {getCostPerItem(product.productName)}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {product.quantity * getCostPerItem(product.productName)}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        color="error"
                        onClick={() => handleCancelButtonClick(product.id)}
                      >
                        <Delete />
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
                <StyledTableRow>
                  <StyledTableCell align="center" colSpan={2}></StyledTableCell>
                  <StyledTableCell align="center">
                    <Typography
                      variant="h6"
                      gutterBottom
                      style={{ fontSize: "14px" }}
                    >
                      Total Cart Cost:
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Typography variant="h6" style={{ fontSize: "14px" }}>
                      {totalCartCost}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell align="center"></StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell align="center" colSpan={4}></StyledTableCell>
                  <StyledTableCell align="center">
                    <Button
                      variant="contained"
                      color="success"
                      onClick={saveDetails}
                    >
                      Save Details
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* {formSubmitted && (
            <GetBill gstRate={gstRate} totalCartCostWithGST={price} />
          )} */}
        </CardContent>
      </Card>
      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
      >
                <DialogTitle>Confirmation</DialogTitle>       {" "}
        <DialogContent>Are you sure you want to Delete?</DialogContent>       {" "}
        <DialogActions>
                   {" "}
          <Button onClick={handleNoButtonClick}>
                        No          {" "}
          </Button>
                   {" "}
          <Button onClick={handleYesButtonClick}>        Yes       </Button>   {" "}
        </DialogActions>
         {" "}
      </Dialog>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Product Deleted Successfully</DialogTitle>
        <DialogContent>
          <p>Your product has been successfully deleted.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOKClick}>OK</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={successDialogOpen} onClose={() => setSuccessDialogOpen(false)}>
  <DialogTitle>Order Placed Successfully</DialogTitle>
  <DialogContent>
    <p>Your order has been placed successfully.</p>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleSuccessClick}>OK</Button>
  </DialogActions>
</Dialog>

    </div>
  );
}

export default Cartt;