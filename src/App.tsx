import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login  from './components/User/Login';
import { ViewProdcuts } from './components/Products/ViewProdcuts';
import  AddProduct  from './components/Products/AddProduct';
import { AdminDashboard } from './components/AdminDashboard';
import  Sidebar  from './components/Sidebar';
import { AddCategory } from './components/Category/AddCategory';
import { EditProduct } from './components/Products/EditProduct';
import { ViewCategory } from './components/Category/ViewCategory';
import { EditCategory } from './components/Category/EditCategory';
import SellProduct from './components/Cart/SellProduct';
import GetBill from './components/Bill/GetBill';
import { AllBills } from './components/Bill/AllBills';
import { PageNotFound } from './PageNotFound';
function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path='/view' element={<ViewProdcuts/>}/>
      <Route path='/add' element={<AddProduct/>}/>
      <Route path='/dashboard' element={<AdminDashboard/>}/>
      <Route path='sidebar' element={<Sidebar/>}/>
      <Route path='/addcategory' element={<AddCategory/>}/>
      <Route path='/editproduct/:id' element={<EditProduct/>}/>
      <Route path='/viewcategory' element={<ViewCategory/>}/>
      <Route path='/editcategory/:id' element={<EditCategory/>}/>
      <Route path='sellproduct' element={<SellProduct/>}/>
      <Route path='/billdata' element={<GetBill />}/>
      <Route path='/allbills' element={<AllBills/>}/>
      <Route path="/*" element={<PageNotFound/>}></Route>
    </Routes>
  </Router>
  );
}

export default App;
