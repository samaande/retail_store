import React,{useState} from "react";
import { Card,Button, List as MUIList } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import StorefrontIcon from "@mui/icons-material/Storefront";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
const Sidebar = () => {
  const [showConfirmDialog,setShowConfirmDialog]=useState(false)
  const navigate = useNavigate()
  const handleDialogue=()=>{
    setShowConfirmDialog(true)
  }
  const handleYesLogout = () =>{
    sessionStorage.clear()
    setShowConfirmDialog(false)
    navigate("/")
  }
  const handleNoLogout=()=>{
    setShowConfirmDialog(false)
  }
  return (
    <div className="parent-container">
      <div className="sidebar">
        <MUIList>
          <div
            style={{
              display: "flex",
              marginLeft: "10px",
              marginTop: "10px",
              marginBottom: "15px",
            }}
          >
            <StorefrontIcon fontSize="large" style={{ marginRight: "10px" }} />
            <Typography
              align="center"
              style={{ fontSize: "24px", fontWeight: "bold", color: "black",marginBottom:'20px' }}
            >
              Retail Store
            </Typography>
          </div>
          <div>
          <Link to="/add" className="links">
          <Card
              style={{
                cursor: "pointer",
                margin: "10px",
                backgroundColor: "gray",
                height:'75px'
              }}
            >
              <Typography
                align="center"
                style={{
                  fontSize: "14px",
                  marginTop:'30px',
                  color: "white",
                }}
              >
                Add Product
              </Typography>
            </Card>
                </Link>
            
          </div>
          <div>
          <Link to="/addcategory" className="links">
          <Card
              style={{
                cursor: "pointer",
                margin: "10px",
                backgroundColor: "gray",
                height:'75px'
              }}
            >
              <Typography
                align="center"
                style={{
                  fontSize: "14px",
                  marginTop:'30px',
                  color: "white",
                }}
              >
                Add Category
              </Typography>
            </Card>
                </Link>
            
          </div>
          <div>
          <Link to="/view" className="links">
          <Card
              style={{
                cursor: "pointer",
                margin: "10px",
                backgroundColor: "gray",
                height:'75px'
              }}
            >
              <Typography
                align="center"
                style={{
                  fontSize: "14px",
                  marginTop:'30px',
                  color: "white",
                }}
              >
                Product Report
              </Typography>
            </Card>
                </Link>
            
          </div>
          <div>
          <Link to="/viewcategory" className="links">
            <Card
              style={{
                cursor: "pointer",
                margin: "10px",
                backgroundColor: "gray",
                height:'75px'
              }}
            >
              <Typography
                align="center"
                style={{
                  fontSize: "14px",
                  marginTop:'30px',
                  color: "white",
                }}
              >
               Category Report
              </Typography>
            </Card>
                </Link>
            
          </div>
          <div>
          <Link to="/sellproduct" className="links">
          <Card
              style={{
                cursor: "pointer",
                margin: "10px",
                backgroundColor: "gray",
                height:'75px'
              }}
            >
              <Typography
                align="center"
                style={{
                  fontSize: "14px",
                  marginTop:'30px',
                  color: "white",
                }}
              >
                Sell Product
              </Typography>
            </Card>
                </Link>
            
          </div>
          <div>
          <Link to="/allbills" className="links">
          <Card
              style={{
                cursor: "pointer",
                margin: "10px",
                backgroundColor: "gray",
                height:'75px'
              }}
            >
              <Typography
                align="center"
                style={{
                  fontSize: "14px",
                  marginTop:'30px',
                  color: "white",
                }}
              >
                Bill Report
              </Typography>
            </Card>
                </Link>
            
          </div>
          <div>
          <Link to="#" className="links"
                onClick={()=>handleDialogue()}>
                   <Card
              style={{
                cursor: "pointer",
                margin: "10px",
                backgroundColor: "gray",
                height:'75px'
              }}
            >
              <Typography
                align="center"
                style={{
                  fontSize: "14px",
                  marginTop:'20px',
                  color: "white",
                  
                }}
              >
                Logout
              </Typography>
            </Card>
                </Link>
           
          </div>
          
          
        </MUIList>
      </div>
      <Dialog
          open={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
        >
                  <DialogTitle>Confirmation</DialogTitle>       {" "}
          <DialogContent>Are you sure you want to Delete?</DialogContent>       {" "}
          <DialogActions>
                     {" "}
            <Button onClick={handleNoLogout}>
                          No          {" "}
            </Button>
                     {" "}
            <Button onClick={handleYesLogout}>        Yes       </Button> 
             {" "}
          </DialogActions>
           {" "}
        </Dialog>
    </div>
  );
};

export default Sidebar;
