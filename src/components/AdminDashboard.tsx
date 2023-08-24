import login from "../components/Images/admin.png";
import '../App.css'
import  Sidebar  from "./Sidebar";
export const AdminDashboard = () => {
  return (
    <div>
       <Sidebar/>
    <div className="image">
      <img src={login} alt="Your Image" />
    </div>
    </div>
  )
}
