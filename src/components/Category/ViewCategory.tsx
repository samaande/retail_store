import React, { useEffect, useState } from "react";
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
import { Category } from "../Interfaces/Category";
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

export const ViewCategory = () => {
  const [categories, setCategories] = useState<Category[] | null>();
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
  useEffect(() => {
    axios
      .get(`http://localhost:8000/category`)
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
  const filteredCategory = categories?.filter(
    (cate) =>
      cate.productType.toLowerCase().startsWith(searchTypeTerm.toLowerCase()) &&
      cate.description.toLowerCase().startsWith(searchCodeTerm.toLowerCase())
  );
const handleDeleteCategory = (id: number) => {
    setProductIdToDelete(id);
    setShowConfirmDialog(true);
  };
 
  const handleDelete=()=>{
    if (productIdToDelete !== null) {
      axios
        .delete(`http://localhost:8000/category/${productIdToDelete}`)
        .then((res) => {
          // Remove the deleted category from the categories state
          setCategories((prevCategories) =>
            prevCategories?.filter((category) => category.id !== productIdToDelete)
          );
        })
        .catch((err) => console.log(err));
 
      setProductIdToDelete(null);
      setShowConfirmDialog(false);
    }
  }

  
  return (
    <div>
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
                    Description
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
                  <StyledTableCell align="center">ACTION</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              {filteredCategory && filteredCategory.length > 0 ? (
                <TableBody>
                  {filteredCategory
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((p) => (
                      <StyledTableRow key={p.id}>
                        <StyledTableCell align="center">
                          {p.productType}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {p.description}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <Button>
                            <Link to={`/editcategory/${p.id}`}>
                              <EditIcon />
                            </Link>
                          </Button>
                          <Button>
                            <Link to="#" onClick={()=>handleDeleteCategory(p.id)}>
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
                { label: "All", value: categories?.length || 0 },
              ]}
              component="div"
              style={{ marginRight: "450px" }}
              count={categories ? categories.length : 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </div>
      </div>
      {showConfirmDialog && (
        <Dialog open={showConfirmDialog}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
              Are you sure you want to delete this category?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowConfirmDialog(false)} color="primary">
              No
            </Button>
            <Button onClick={handleDelete} color="primary">
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};
