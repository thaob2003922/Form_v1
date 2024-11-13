import React from "react";
import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Formheader from "./components/Formheader";
import CenteredTabs from "./components/Tabs";
import UserForm from "./components/UserForm";
import Login from "./components/user/Login";
// import { useStateValue } from "./components/StateProvider";
// import { AuthContext } from './components/utils/auth-context';
// import Logout from "./components/user/Logout";
import Signup from "./components/user/Signup";
import ProtectedPage from "./components/ProtectedPage";
import Statistics from "./components/sidebar/Statistics";
import FillForm from "./components/views/FillForm";
import AccountManagement from "./components/sidebar/AccountManagement";
function App() {
  // const [ {doc_name}, dispatch] = useStateValue();
  
  return (
    <div className='app'>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/signup" element={<Signup/>}></Route>
          <Route path="/form/:id" element={<> <Formheader/> <CenteredTabs/> </>}></Route>
          <Route path="/response/:id" element={<UserForm/>}></Route>
          <Route path="/" element={
            <ProtectedPage/> 
          }> 
          </Route>
          <Route path="/statistics" element={<Statistics/>}></Route>
          <Route path="/fill-form/:documentId" element={<FillForm/>}></Route>
          <Route path="/account-management" element={<AccountManagement/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
