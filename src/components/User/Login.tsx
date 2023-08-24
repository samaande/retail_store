
import React, { useState } from "react";
import {
  Container,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import login from "../Images/login.jpg";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Admin } from "../Interfaces/AdminData";
const LoginForm = () => {
  const {
    handleSubmit
  } = useForm();
  const [user, setUser] = useState({ username: "", password: "" });
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [open,setOpen] = useState(false)
  const [invalidCredentialsError, setInvalidCredentialsError] = useState("");
 
  const handleOKClick = () => {
    setOpen(false);
    window.location.href = "/dashboard";
  };
  const handleFormSubmit = async () => {
    if (!user.username) {
      setUsernameError("Email is required");
    }
    if (!user.password) {
      setPasswordError("Password is required");
    }
 
    // Inside the handleFormSubmit function
try {
  const response = await axios.get("http://localhost:5050/admin");
  const adminData: Admin[] = response.data;
 
  const validAdmin = adminData.find(
    (a) => a.username === user.username && a.password === user.password
  );
 
  if (validAdmin) {
    sessionStorage.setItem("emailId", user.username);
    console.log("Login Successful");
    setOpen(true);
    setInvalidCredentialsError(""); // Reset the error message
  } else {
    // Check if the entered username exists in adminData
    const validUsername = adminData.some((a) => a.username === user.username);
    const validPassword = adminData.some((a)=>a.password===user.password)
    if (!validUsername && !validPassword) {
      setInvalidCredentialsError("Invalid username and password"); // Both are invalid
    } else if (validUsername) {
      setInvalidCredentialsError("Invalid password"); // Invalid password
    } else {
      setInvalidCredentialsError("Invalid username"); // Invalid username
    }
  }
} catch (err) {
  console.log(err);
}
 
  };  
  const handleEmailChange = (e: any) => {
    setUser((prevValues) => ({
      ...prevValues,
      username: e.target.value,
    }));
    validateEmail(e.target.value);
  };
  const validateEmail = (email: any) => {
    const re = /\S+@\S+\.\S+/;
    if (!email) {
      setUsernameError("email is required");
    } else if (!re.test(email)) {
      setUsernameError("Invalid email format");
    } else {
      setUsernameError("");
    }
  };
  const validatePassword = (password: any) => {
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,20}$/;
    if (!password) {
      setPasswordError("Password is required");
    } else if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be 6-20 characters long, contain at least one number, one letter, and one special character."
      );
    } else {
      setPasswordError("");
    }
  };
  const handlePasswordChange = (e: any) => {
    setUser((prevValues) => ({
      ...prevValues,
      password: e.target.value,
    }));  
    validatePassword(e.target.value);
  };
  return (
    <div>
    <Container
      maxWidth="xl"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Grid container spacing={3}>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src={login}
              alt="Login"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                borderRadius: "4px",
              }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{ textAlign: "center", mt: 2 }}
            >
              Welcome Back!
            </Typography>
            <AccountCircle sx={{ fontSize: 80, color: "primary.main" }} />
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ textAlign: "center", mt: 2 }}
            >
              Log in to your account
            </Typography>
            <form style={{ width: "100%" }}  onSubmit={handleSubmit(handleFormSubmit)}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="username"
                value={user.username}
                onChange={handleEmailChange}
                error={Boolean(usernameError)}
                helperText={usernameError}
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                value={user.password}
                onChange={handlePasswordChange}
                error={Boolean(passwordError)}
                helperText={passwordError}
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3 }}
                color="primary"
              >
                Log In
              </Button>
            </form>
            {invalidCredentialsError && (
          <Typography color="error" sx={{ textAlign: "center", mt: 2 }}>
            {invalidCredentialsError}
          </Typography>
        )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
    <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>You are logged in Successfully</DialogTitle>
        <DialogActions>
          <Button onClick={handleOKClick} >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
 
export default LoginForm;

