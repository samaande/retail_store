import React, { useEffect, useState } from "react";
import { Product } from "../Interfaces/Products";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import axios from "axios";
import Sidebar from "../Sidebar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { tableCellClasses } from "@mui/material/TableCell";
import { Button, TablePagination } from "@mui/material";
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
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const ViewProdcuts = () => {
  const [products, setProducts] = useState<Product[] | null>();
  const [page, setPage] = useState(0);
  const [searchCodeTerm, setSearchCodeTerm] = useState("");
  const [searchTypeTerm, setSearchTypeTerm] = useState("");
  const [searchNameTerm, setSearchNameTerm] = useState("");
  const [searchCostTerm, setSearchCostTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState<number | null>(
    null
  );
  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const filteredProducts = products?.filter(
    (pro) =>
      pro.productType.toLowerCase().startsWith(searchTypeTerm.toLowerCase()) &&
      pro.productCode.toString().startsWith(searchCodeTerm) &&
      pro.productName.toLowerCase().startsWith(searchNameTerm.toLowerCase()) &&
      pro.cost.toString().startsWith(searchCostTerm)
  );

  useEffect(() => {
    axios
      .get(`http://localhost:7000/products`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
  const handleDelete = (id: number) => {
    console.log(id);
    axios
      .delete(`http://localhost:7000/products/` + id)
      .then((res) => {
        setOpen(true);
      })
      .catch((err) => console.log(err));
  };
  const handleOKClick = () => {
    setOpen(false);
    window.location.href = "/view";
  };
  const handleCancelButtonClick = (id: number) => {
    setProductIdToDelete(id);
    setShowConfirmDialog(true);
  };

  const handleYesButtonClick = () => {
    setShowConfirmDialog(false);
    if (productIdToDelete !== null) {
      handleDelete(productIdToDelete);
      setProductIdToDelete(null);
    }
  };

  const handleNoButtonClick = () => {
    setShowConfirmDialog(false);
  };
  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: "400px", marginTop: "45px" }}>
        <TableContainer>
          <Table sx={{ maxWidth: 1050 }} align="center">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell align="center">
                  TYPE
                  <br />
                  <input
                    style={{
                      backgroundColor: "balck",
                      color: "black",
                      border: "white",
                      maxWidth: "80px",
                    }}
                    type="text"
                    value={searchTypeTerm}
                    onChange={(e) => setSearchTypeTerm(e.target.value)}
                    placeholder="Search Type"
                  />
                </StyledTableCell>
                <StyledTableCell align="center">
                  CODE
                  <br />
                  <input
                    style={{
                      backgroundColor: "balck",
                      color: "black",
                      border: "white",
                      maxWidth: "80px",
                    }}
                    type="text"
                    value={searchCodeTerm}
                    onChange={(e) => setSearchCodeTerm(e.target.value)}
                    placeholder="Search Code"
                  />
                </StyledTableCell>
                <StyledTableCell align="center">
                  NAME
                  <br />
                  <input
                    style={{
                      backgroundColor: "balck",
                      color: "black",
                      border: "white",
                      maxWidth: "80px",
                    }}
                    type="text"
                    value={searchNameTerm}
                    onChange={(e) => setSearchNameTerm(e.target.value)}
                    placeholder="Search Name"
                  />
                </StyledTableCell>
                <StyledTableCell align="center">
                  COST
                  <br />
                  <input
                    style={{
                      backgroundColor: "balck",
                      color: "black",
                      border: "white",
                      maxWidth: "80px",
                    }}
                    type="text"
                    value={searchCostTerm}
                    onChange={(e) => setSearchCostTerm(e.target.value)}
                    placeholder="Search Code"
                  />
                </StyledTableCell>
                <StyledTableCell align="center">ACTION</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            {filteredProducts && filteredProducts.length > 0 ? (
              <TableBody>
                {filteredProducts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((p) => (
                    <StyledTableRow key={p.id}>
                      <StyledTableCell align="center">
                        {p.productType}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {p.productCode}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {p.productName}
                      </StyledTableCell>
                      <StyledTableCell align="center">{p.cost}</StyledTableCell>
                      <StyledTableCell align="center">
                        <Button>
                          <Link to={`/editproduct/${p.id}`}>
                            <EditIcon />
                          </Link>
                        </Button>
                        <Button>
                          <Link
                            to="#"
                            onClick={() => handleCancelButtonClick(p.id)}
                          >
                            <DeleteIcon style={{ color: "red" }} />
                          </Link>
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            ) : (
              <Typography
                align="center"
                variant="subtitle1"
                style={{ margin: "20px" }}
              >
                No data available
              </Typography>
            )}
          </Table>
          <TablePagination
            rowsPerPageOptions={[
              5,
              10,
              25,
              { label: "All", value: products?.length || 0 },
            ]}
            component="div"
            style={{ marginRight: "450px" }}
            count={products ? products.length : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
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
            <Button onClick={handleYesButtonClick}>        Yes       </Button> 
             {" "}
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
      </div>
    </div>
  );
};
