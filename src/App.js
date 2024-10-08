import React from "react";
import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Formheader from "./components/Formheader";
import CenteredTabs from "./components/Tabs";
import QuestionForm from "./components/QuestionForm";
import UserForm from "./components/UserForm";
import Login from "./components/user/Login";
// import { AuthContext } from './components/utils/auth-context';
// import Logout from "./components/user/Logout";
import Signup from "./components/user/Signup";
import ProtectedPage from "./components/ProtectedPage";
function App() {
  return (
    <div className='app'>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/signup" element={<Signup/>}></Route>
          <Route path="/form/:id" element={<><Formheader/> <CenteredTabs /> <QuestionForm/></>}></Route>
          <Route path="/response" element={<UserForm/>}></Route>
          <Route path="/" element={
            <ProtectedPage/> 
          }> 
          </Route>

          {/* <Route path="/" element={
            <><Header /><Template /><Mainbody /></>
          }> 
          </Route> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
