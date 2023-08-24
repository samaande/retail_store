import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Customer } from "../Interfaces/Customer";
import CustomerDetails from "../Customer/CustomerDetails";
import Sidebar from "../Sidebar";
import { format } from "date-fns";
import Order from "../Customer/Order";
function SellProduct() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [customerDetails, setCustomerDetails] = useState<Customer | null>(null);
  const [name, setName] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nameError, setNameError] = useState("");
  useEffect(() => {
    const now = new Date();
    const formattedDateTime = format(now, "dd-MM-yyyy hh:mm a");
    setValue("date", formattedDateTime);

    const cashierName = sessionStorage.getItem("emailId")
    setValue("cashier",cashierName)
  }, [setValue]);

  const validatePhoneNumber = (phoneNumber: string) => {
    if (!phoneNumber) {
      setPhoneNumberError("Phone number is required");
    } else if (!/^[6789]\d{9}$/.test(phoneNumber)) {
      if (!/^[6789]/.test(phoneNumber)) {
        setPhoneNumberError("Phone number should start with 6, 7, 8, or 9");
      } else if (!/^\d{10}$/.test(phoneNumber)) {
        setPhoneNumberError("Phone number should contain exactly 10 digits");
      } else {
        setPhoneNumberError("Phone number should start with 6, 7, 8, or 9");
      }
    } else {
      setPhoneNumberError("");
    }
  };  
  const validateName = (name :string)=>{
    if(!name){
      setNameError("Name is required")
    }else if(!/^[A-Za-z ]+$/.test(name)){
      setNameError("Name should contain only alphabets")
    }else{
      setNameError("")
    }
  }
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneNumberValue = e.target.value;
    setPhoneNumber(phoneNumberValue);
    validatePhoneNumber(phoneNumberValue);
  };
  const handleNameChange = (e : React.ChangeEvent<HTMLInputElement>)=>{
    const nameValue = e.target.value;
    setName(nameValue)
    validateName(nameValue)
  }
  const handleInput = (e: any, setState: any, setErrorState: any) => {
    setState(e.target.value);
    setErrorState("");
  };
  const handleFormSubmit = (data: any) => {
    let isFormValid = true;
    if (!name) {
      setNameError("Name is required");
      isFormValid = false;
    }else if (!/^[A-Za-z ]+$/.test(name)) {
      setNameError("Name should contain only alphabetic characters");
      isFormValid = false;
    }  else {
      setNameError("");
    }
    if (!phoneNumber) {
      setPhoneNumberError("Phone Number is required");
      isFormValid = false;
    } else if (!/^[6789]\d{9}$/.test(phoneNumber)) {
      setPhoneNumberError("Phone number should contain 10 digits ");
      isFormValid = false;
    }else {
      setPhoneNumberError("");
    }
    if (!isFormValid) {
      return;
    }
    const formData = {
      ...data,
      name: name,
      phonenumber: phoneNumber,
    };
    axios
      .post(`http://localhost:8082/customer`, formData)
      .then((res) => {
        console.log(res.data);
        sessionStorage.setItem("custId", res.data.id);

        setFormSubmitted(true);
        setCustomerDetails(res.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <div>
        <Sidebar />
      </div>
      <div>
        <h2
          style={{
            marginLeft: "360px",
            marginTop: "20px",
            color: "olive",
            fontFamily: "Arial, sans-serif",
            textAlign: "center",
          }}
        >
          Sells Dashboard
        </h2>
        <Divider style={{ marginLeft: "360px", backgroundColor: "black" }} />
      </div>
      {formSubmitted ? (
        <div>
          <div>
            <Grid item xs={12} sm={6}>
              <CustomerDetails customer={customerDetails} />
            </Grid>
          </div>
          <div>
            <Grid item xs={12} sm={6}>
              <Order />
            </Grid>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card
            elevation={3}
            style={{
              padding: "20px",
              width: "90%" /* Adjust the width as needed */,
              maxWidth: "1000px",
              marginBottom: "20px",
              marginLeft: "400px",
              marginTop:'20px'
            }}
          >
            <Typography variant="h6" color="grey" gutterBottom>
              Enter customer name and mobile to start sells
            </Typography>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Name"
                    value={name}
                    onChange={handleNameChange}
                    error={Boolean(nameError)}
                  />
                  {nameError && (
                    <Typography color="error">{nameError}</Typography>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <TextField
                    margin="normal"
                    fullWidth
                    name="phonenumber"
                    label="Phone Number"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    error={Boolean(phoneNumberError)}
                  />
                  {phoneNumberError && (
                    <Typography color="error">{phoneNumberError}</Typography>
                  )}
                </div>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  style={{ alignSelf: "flex-end", marginTop: "10px" }}
                >
                  Save
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

export default SellProduct;
