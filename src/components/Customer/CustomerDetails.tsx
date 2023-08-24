import React from "react";
import { Card, Divider, Typography } from "@mui/material";
import { CustDetailsProps } from "../Interfaces/CustomerDeatilsProps";
import { format } from "date-fns";

function CustomerDetails({ customer }: CustDetailsProps) {
  if (!customer) {
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

  const formattedDate = parseDateString(customer.date);
  return (
    <div>
      {customer && (
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
            Customer Details
          </Typography>
          <Divider style={{ marginBottom: "10px", backgroundColor: "black" }} />
          <div style={{ display: "flex", marginBottom: "10px" }}>
            <div style={{ width: "250px", marginRight: "20px" }}>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                Customer ID:
              </Typography>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                Name:
              </Typography>
            </div>
            <div style={{ width: "200px", marginRight: "20px" }}>
              <Typography variant="body1">{customer.id}</Typography>
              <Typography variant="body1">{customer.name}</Typography>
            </div>
            <div style={{ width: "250px", marginRight: "20px" }}>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                Date:
              </Typography>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                Phone Number:
              </Typography>
            </div>
            <div>
              <Typography variant="body1">{formattedDate}</Typography>
              <Typography variant="body1">{customer.phonenumber}</Typography>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default CustomerDetails;
