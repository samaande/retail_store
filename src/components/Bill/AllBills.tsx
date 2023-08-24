
import React, { useState, useEffect } from "react";
import axios from "axios";
import {Button,Card,CardContent,TablePagination,Table,TableBody,TableCell,TableContainer,Divider,TableHead,TableRow,Typography,} from "@mui/material";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import { BillData } from "../Interfaces/BillData";
import { Customer } from "../Interfaces/Customer";
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
 
export const AllBills = () => {
 
  const [billData, setBillData] = useState<BillData[] | null>(null);
  const [customerData, setCustomerData] = useState<Customer[] | null>(null);
  const [filteredBills, setFilteredBills] = useState<BillData[] | []>([]);
  const [selectedCustomerBill, setSelectedCustomerBill] =useState<BillData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
 
  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };
 
  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
 
  const cashierName = sessionStorage.getItem("emailId");
  const gstRate = 18;
  const totalCost =selectedCustomerBill?.cartDetails.reduce((total, item) => total + item.quantity * item.costPerItem,0 ) || 0;
  const gstAmount = (totalCost * gstRate) / 100;
  const price = Math.round(totalCost + gstAmount);
  const changes = (price - (gstAmount + totalCost)).toFixed(2);
  useEffect(() => {
    // Fetch bill data
    axios.get("http://localhost:8095/bill").then((response) => {
      setBillData(response.data);
    });
 
    // Fetch customer data
    axios.get("http://localhost:8082/customer").then((response) => {
      setCustomerData(response.data);
    });
    if (customerData && billData) {
      const customerBills = billData.filter((bill) =>
        bill.cartDetails.some((cartItem) =>
          customerData.some(
            (customer) =>
              customer.cashier === cashierName &&
              parseInt(cartItem.custId, 10) === customer.id
          )
        )
      );
      setFilteredBills(customerBills);
    }
  }, [billData, customerData, cashierName]);
 
  console.log(filteredBills);
  console.log("customer data...", customerData);
  const handleCustomerNameClick = (customerId: number) => {
    const selectedBill = filteredBills.find((bill) =>
      bill.cartDetails.some(
        (cartItem) => parseInt(cartItem.custId, 10) === customerId
      )
    );
    console.log("Selected Bill:", selectedBill);
    setSelectedCustomerBill(selectedBill || null);
    setIsModalOpen(true);
  };
 
 
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
 
  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: "400px", marginTop: "45px" }}>
        <TableContainer>
          <Table sx={{ maxWidth: 1050 }}>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell align="center">Customer Name</StyledTableCell>
                <StyledTableCell align="center">Price</StyledTableCell>
                <StyledTableCell align="center">Payment</StyledTableCell>
                <StyledTableCell align="center">Date</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {filteredBills
                ? filteredBills
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((bill) => (
                      <StyledTableRow key={bill.id}>
                        <StyledTableCell align="center">
                          {customerData &&
                            bill.cartDetails.length > 0 &&
                            (() => {
                              const customerId = parseInt(
                                bill.cartDetails[0].custId,
                                10
                              );
                              const customer = customerData.find(
                                (customer) => customer.id === customerId
                              );
                              const customerName = customer
                                ? customer.name.split(" ")[0]
                                : "Unknown Customer";
                              const formattedCustomerName =
                                customerName.charAt(0).toUpperCase() +
                                customerName.slice(1); // Capitalize first letter
                              return (
                                <span
                                  style={{
                                    cursor: "pointer",
                                    textDecoration: "none",
                                  }}
                                  onClick={() =>
                                    handleCustomerNameClick(customerId)
                                  }
                                >
                                  {formattedCustomerName}
                                </span>
                              );
                            })()}
                        </StyledTableCell>
 
                        <StyledTableCell align="center">
                          {bill.cartDetails[0].totalCost}
                        </StyledTableCell>
                        <StyledTableCell align="center">Done</StyledTableCell>
                        <StyledTableCell align="center">
                          {customerData &&
                            bill.cartDetails.length > 0 &&
                            (() => {
                              const customerId = parseInt(
                                bill.cartDetails[0].custId,
                                10
                              ); // Assuming the custId is the same for all cart items in a bill
                              const customer = customerData.find(
                                (customer) => customer.id === customerId
                              );
                              const customerDate = customer
                                ? customer.date // Replace 'date' with the actual property name that holds the date in the customer object
                                : "Unknown Date";
                              return customerDate instanceof Date
                                ? customerDate.toLocaleDateString() // Format the date as a string
                                : customerDate;
                            })()}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                : null}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[
              5,
              10,
              25,
              { label: "All", value: billData?.length || 0 },
            ]}
            component="div"
            style={{ marginRight: "450px" }}
            count={billData ? billData.length : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </div>
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: 900,
            }}
          >
            <Paper>
              <Box p={2}>
                <Typography
                  variant="h6"
                  gutterBottom
                  style={{ color: "olive" }}
                >
                  Bill Details
                </Typography>
                <Divider
                  style={{ marginBottom: "10px", backgroundColor: "black" }}
                />
 
                {selectedCustomerBill && customerData && (
                  <div className="customer-details">
                    {customerData && (
                      <div style={{ display: "flex" }}>
                        <div style={{ display: "flex", marginBottom: "10px" }}>
                          <div style={{ width: "250px", marginRight: "20px" }}>
                            <Typography
                              variant="body1"
                              style={{ fontWeight: "bold" }}
                            >
                              Name:
                            </Typography>
                          </div>
                        </div>
                        <div style={{ width: "200px", marginRight: "20px" }}>
                          <Typography variant="body1">
                            {selectedCustomerBill &&
                              customerData &&
                              selectedCustomerBill.cartDetails[0] && // Assuming there's at least one cart item
                              (() => {
                                const customerId = parseInt(
                                  selectedCustomerBill.cartDetails[0].custId,
                                  10
                                );
                                const customer = customerData.find(
                                  (customer) => customer.id === customerId
                                );
                                const customerName = customer
                                  ? customer.name
                                  : "Unknown Customer";
                                const formattedCustomerName =
                                  customerName.charAt(0).toUpperCase() +
                                  customerName.slice(1); // Capitalize first letter
                                return formattedCustomerName;
                              })()}
                          </Typography>
                        </div>
                      </div>
                    )}
                  </div>
                )}
 
                <TableContainer>
                  <Table>
                    <TableHead>
                      <StyledTableRow>
                        <StyledTableCell align="center">
                          Product Name
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Quantity
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Cost Per Item
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Total Cost
                        </StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      {selectedCustomerBill?.cartDetails.map((item, index) => {
                        const totalCost = item.quantity * item.costPerItem;
 
                        return (
                          <React.Fragment key={index}>
                            <StyledTableRow>
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
                                {totalCost}
                              </StyledTableCell>
                            </StyledTableRow>
                           
 
                           
                           
                          </React.Fragment>
                        );
                      })}
                      <StyledTableRow>
                              <StyledTableCell colSpan={2} />
                              <StyledTableCell align="center">
                                GST 18%
                              </StyledTableCell>
                              <StyledTableCell align="center">
                              {(totalCost * gstRate) / 100}
                              </StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                              <StyledTableCell colSpan={2} />
                              <StyledTableCell align="center">
                                Changes
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {(
                                  price -
                                  ((totalCost * gstRate) / 100 + totalCost)
                                ).toFixed(2)}
                              </StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                              <StyledTableCell colSpan={2} />
                              <StyledTableCell
                                align="center"
                                style={{ fontWeight: "bold" }}
                              >
                                Total Cost
                              </StyledTableCell>
                              <StyledTableCell
                                align="center"
                                style={{ fontWeight: "bold" }}
                              >
                                {Math.round(
                                  totalCost + (totalCost * gstRate) / 100
                                )}
                              </StyledTableCell>
                            </StyledTableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Paper>
          </Box>
        </div>
      </Modal>
    </div>
  );
};
 

