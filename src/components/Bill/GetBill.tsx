import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableFooter,
  Button,
  Divider,
} from "@mui/material";
import { GetBillProps } from "../Interfaces/GetBillProps";
import { BillData } from "../Interfaces/BillData";
import { Customer } from "../Interfaces/Customer";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import Sidebar from "../Sidebar";
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
function GetBill() {
  const [billItems, setBillItems] = useState<BillData[] | null>(null);
const gstRate = 18
  const [custDetails, setCustDetails] = useState<Customer | null>(null); // State to hold customer details
  const custId = sessionStorage.getItem("custId"); // Retrieve custId from session storage

  const totalCartCostString = sessionStorage.getItem("totalCartCost");
  const totalCartCost = totalCartCostString
    ? parseFloat(totalCartCostString)
    : 0;

  const gstAmount = (totalCartCost * gstRate) / 100;
  const price = Math.round(totalCartCost + gstAmount);
  const changes = (price - (gstAmount + totalCartCost)).toFixed(2);

  useEffect(() => {
    // Fetch customer details based on custId
    if (custId) {
      axios
        .get(`http://localhost:8082/customer/${custId}`)
        .then((res) => {
          const customerData: Customer = res.data;
          setCustDetails(customerData);
          console.log(customerData);
        })
        .catch((error) => {
          console.error("Error fetching customer data:", error);
        });
    }
    //fetch bill data
    if (custId) {
      axios
        .get(`http://localhost:8095/Bill?custId=${custId}`)
        .then((res) => {
          const billData: BillData[] = res.data;
          setBillItems(billData);
        })
        .catch((error) => {
          console.error("Error fetching bill data:", error);
        });
    }
  }, [custId]);
  if (!custDetails) {
    // Handle the case when customer is null
    return <div>No customer data available.</div>;
  }

  const parseDateString = (inputDate: any) => {
    const [datePart, timePart] = inputDate.split(" ");
    const [day, month, year] = datePart.split("-");
    const [hour, minute] = timePart.split(":");
    const period = parseInt(hour) < 12 ? "AM" : "PM";
    const formattedTime = `${hour}:${minute} ${period}`;

    return `${day}-${month}-${year} ${formattedTime}`;
  };

  // ...

  const formattedDate = parseDateString(custDetails.date);

  const handleSave = () => {
    // Construct the HTML content for the table
    const tableContent = `
    <html>
      <head>
        <title>Bill Details</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            width:900px
            marginLeft : 40px
          }
          h1 {
            text-align: center;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
            border: none;
          }
          th {
            background-color: #f2f2f2;
          }
          tfoot td {
            text-align: center;
            border: none;
          }
          tfoot tr {
            border: none;
          }
          .customer-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px; /* Add margin to create space below customer details */
          }
          .customer-line {
            border-top: 1px solid #ddd; /* Create a dividing line */
            margin-top: 10px; /* Add some space above the line */
          }
        </style>
      </head>
      <body>
        <h1>Bill Details</h1>
        <div>
        <div>
        <div class="customer-info">
          <p><strong>Customer Name:</strong> ${custDetails.name}</p>
          <p><strong>Date:</strong> ${custDetails.date}</p>
        </div>
        <p><strong>Phone Number:</strong> ${custDetails.phonenumber}</p>
      </div>
      <div class="customer-line"></div>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Cost Per Item</th>
              <th>Total Cost</th>
            </tr>
          </thead>
          <tbody>
        ${billItems
          ?.map((billData) =>
            billData.cartDetails
              .filter((item) => item.custId === custId)
              .map(
                (item, index) => `
              <tr>
                <td>${item.productName}</td>
                <td>${item.quantity}</td>
                <td>${item.costPerItem}</td>
                <td>${item.quantity * item.costPerItem}</td>
              </tr>
            `
              )
              .join("")
          )
          .join("")}
      </tbody>
          <tfoot>
            <tr>
              <td colspan="2"></td>
              <td> GST ${gstRate}</td>
              <td>${gstAmount}</td>
            </tr>
            <tr>
            <td colspan="2"></td>
            <td> Changes</td>
              <td>${changes}</td>
            </tr>
            <tr>
            <td colspan="2"></td>
            <td><strong> Total price</strong></td>
              <td><strong>${price}</strong></td>
            </tr>
          </tfoot>
        </table>
      </body>
    </html>`;

    const newWindow = window.open("", "_blank");
    newWindow?.document.write(tableContent);
    newWindow?.document.close();
  
    // Add an event listener for when the new window finishes loading
    newWindow?.addEventListener("load", () => {
      // Trigger the print process
      newWindow?.print();
  
      // Close the new window
      newWindow?.close();
  
      // Navigate to another page in the original tab
      window.location.href = "/sellproduct";
    })
  };

  return (
    <div>
      <Sidebar />
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
        <CardContent>
          <Typography variant="h6" gutterBottom style={{ color: "olive" }}>
            Bill Details
          </Typography>
          <Divider style={{ marginBottom: "10px", backgroundColor: "black" }} />
          <div className="customer-details">
            {custDetails && (
              <div style={{ display: "flex", marginBottom: "10px" }}>
                <div style={{ width: "250px", marginRight: "20px" }}>
                  <Typography variant="body1" style={{ fontWeight: "bold" }}>
                    Name:
                  </Typography>
                  <Typography variant="body1" style={{ fontWeight: "bold" }}>
                    Phone Number:
                  </Typography>
                </div>
                <div style={{ width: "200px", marginRight: "20px" }}>
                  <Typography variant="body1">{custDetails.name}</Typography>
                  <Typography variant="body1">
                    {custDetails.phonenumber}
                  </Typography>
                </div>
                <div style={{ width: "250px", marginRight: "20px" }}>
                  <Typography variant="body1" style={{ fontWeight: "bold" }}>
                    Date:
                  </Typography>
                </div>
                <div>
                  <Typography variant="body1">{formattedDate}</Typography>
                </div>
              </div>
            )}
          </div>
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
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {billItems?.map((billData) => (
                  <React.Fragment key={billData.id}>
                    {billData.cartDetails
                      .filter((item) => item.custId === custId)
                      .map((item, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell align="center">
                            {item.productName}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {item.quantity}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {item.costPerItem}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                          {item.quantity * item.costPerItem}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div style={{ display: "flex", marginBottom: "10px" }}>
            <div style={{marginLeft:'630px',marginRight:'35px' }}>
              <Typography variant="body1">GST 18%</Typography>
            </div>
            <div style={{ marginLeft:'173px' }}>
              <Typography variant="body1">{gstAmount}</Typography>
            </div>
          </div>
          <div style={{ display: "flex", marginBottom: "10px" }}>
            <div style={{marginLeft:'630px',marginRight:'45px' }}>
              <Typography variant="body1">Changes</Typography>
            </div>
            <div style={{ marginLeft:'173px' }}>
              <Typography variant="body1">{changes}</Typography>
            </div>
          </div>
          <div style={{ display: "flex", marginBottom: "10px" }}>
            <div style={{marginLeft:'630px',marginRight:'45px' }}>
              <Typography variant="body1">Total Cost</Typography>
            </div>
            <div style={{ marginLeft:'165px' }}>
              <Typography variant="body1" style={{fontWeight: "bold"}}>{price}</Typography>
            </div>
          </div>
          <br/>
          <Button variant="contained" color="success" onClick={handleSave} style={{marginLeft:'900px'}}>
            Save Details
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default GetBill;
