import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import App from './pages/app.jsx';
import './styles/website.css';
import Register from './pages/register.jsx';
import Login from './pages/login.jsx';
import { AuthContextProvider, AuthContext } from './contexts/AuthContext';
import { useState, useEffect, useContext } from 'react';
import EmailVerification from './pages/emailverification.jsx';
import Error404 from './pages/error404.jsx';
import AddService from './pages/addService.jsx';
import Services from './pages/services.jsx';
import UserProfile from './pages/userProfile.jsx';
import Chat from './pages/chat.jsx';
import UserServices from './pages/userServices.jsx';
import ServiceInfo from './pages/serviceInfo.jsx';
import PendingRequests from './pages/pendingRequests.jsx';
import People from './pages/people.jsx';
import Talatat from './pages/whatIsTalatat.jsx';
import ServicesToEdit from './pages/servicesToEdit.jsx';
import EditService from './pages/editService.jsx';
import TalatatSettings from './pages/settings.jsx';
import ChangePassword from './pages/changePassword.jsx';
import CheckPassword from './pages/testPassword.jsx';
import ChangeUserPassword from './pages/changeUserPassword.jsx';
import ChangeUsername from './pages/changeUsername.jsx';
import ChangeImage from './pages/changeImage.jsx';

function Main() {
  const { LoggedIn, IsLoading } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ 

typeof LoggedIn !== typeof true &&

IsLoading === false && LoggedIn.verified === true ?

<App user={LoggedIn}/> :

typeof LoggedIn !== typeof true &&

IsLoading === false && LoggedIn.verified === false ?

<Navigate to={`/emailVerification/${LoggedIn._id}`} /> :

IsLoading === false && typeof LoggedIn === typeof true ? 

<Navigate to="/login"/> : 

<></>

        } />

        <Route path="/register" element={ 

typeof LoggedIn !== typeof true &&

IsLoading === false && LoggedIn.verified === true ?

<Navigate to="/"/> :

typeof LoggedIn !== typeof true &&

IsLoading === false && LoggedIn.verified === false ?

<Navigate to={`/emailVerification/${LoggedIn._id}`} /> :

<Register />

         }/>

    <Route path="/login" element={

typeof LoggedIn !== typeof true &&

IsLoading === false && LoggedIn.verified === true ?

<Navigate to="/"/> :

typeof LoggedIn !== typeof true &&

IsLoading === false && LoggedIn.verified === false ?

<Navigate to={`/emailVerification/${LoggedIn._id}`} /> :

<Login />

        }/>

      <Route path="/emailVerification/:id" element={

typeof LoggedIn !== typeof true &&

IsLoading === false && LoggedIn.verified === true ?

<Navigate to="/"/> :

typeof LoggedIn !== typeof true &&

IsLoading === false && LoggedIn.verified === false ?

<EmailVerification /> :

IsLoading === false && typeof LoggedIn === typeof true ? 

<Navigate to="/login"/> : 

<></>
      
    } />

      <Route path="/error404" element={<Error404 />} />
        
      <Route path="/addService" element={

typeof LoggedIn !== typeof true &&

IsLoading === false && LoggedIn.verified === true ?

<AddService user={LoggedIn}/> :

typeof LoggedIn !== typeof true &&

IsLoading === false && LoggedIn.verified === false ?

<Navigate to={`/emailVerification/${LoggedIn._id}`} /> :

IsLoading === false && typeof LoggedIn === typeof true ? 

<Navigate to="/login"/> : 

<></>

      } />

      <Route path="/services" element={

typeof LoggedIn !== typeof true &&

IsLoading === false && LoggedIn.verified === true ?

<Services user={LoggedIn}/> :

typeof LoggedIn !== typeof true &&

IsLoading === false && LoggedIn.verified === false ?

<Navigate to={`/emailVerification/${LoggedIn._id}`} /> :

IsLoading === false && typeof LoggedIn === typeof true ? 

<Navigate to="/login"/> : 

<></>

      } />

<Route path="/userProfile/:id" element={

typeof LoggedIn !== typeof true &&

IsLoading === false && LoggedIn.verified === true ?

<UserProfile user={LoggedIn}/> :

typeof LoggedIn !== typeof true &&

IsLoading === false && LoggedIn.verified === false ?

<Navigate to={`/emailVerification/${LoggedIn._id}`} /> :

IsLoading === false && typeof LoggedIn === typeof true ? 

<Navigate to="/login"/> : 

<></>

      } />

  <Route path="/chat/:id" element={

typeof LoggedIn !== typeof true &&

IsLoading === false && LoggedIn.verified === true ?

<Chat user={LoggedIn}/> :

typeof LoggedIn !== typeof true &&

IsLoading === false && LoggedIn.verified === false ?

<Navigate to={`/emailVerification/${LoggedIn._id}`} /> :

IsLoading === false && typeof LoggedIn === typeof true ? 

<Navigate to="/login"/> : 

<></>

  } />

     <Route path="userServices/:id" element={

typeof LoggedIn !== typeof true &&

IsLoading === false && LoggedIn.verified === true ?

<UserServices user={LoggedIn}/> :

typeof LoggedIn !== typeof true &&

IsLoading === false && LoggedIn.verified === false ?

<Navigate to={`/emailVerification/${LoggedIn._id}`} /> :

IsLoading === false && typeof LoggedIn === typeof true ? 

<Navigate to="/login"/> : 

<></>

     }/>

      <Route path="/serviceInfo/:id" element={

typeof LoggedIn !== typeof true &&

IsLoading === false && LoggedIn.verified === true ?

<ServiceInfo user={LoggedIn}/> :

typeof LoggedIn !== typeof true &&

IsLoading === false && LoggedIn.verified === false ?

<Navigate to={`/emailVerification/${LoggedIn._id}`} /> :

IsLoading === false && typeof LoggedIn === typeof true ? 

<Navigate to="/login"/> : 

<></>

      } />

<Route path="/pendingRequests" element={
        typeof LoggedIn !== typeof true &&

        IsLoading === false && LoggedIn.verified === true ?
        
        <PendingRequests user={LoggedIn}/> :
        
        typeof LoggedIn !== typeof true &&
        
        IsLoading === false && LoggedIn.verified === false ?
        
        <Navigate to={`/emailVerification/${LoggedIn._id}`} /> :
        
        IsLoading === false && typeof LoggedIn === typeof true ? 
        
        <Navigate to="/login"/> : 
        
        <></>
      }></Route>

     <Route path="/people" element={
              typeof LoggedIn !== typeof true &&

              IsLoading === false && LoggedIn.verified === true ?
              
              <People user={LoggedIn}/> :
              
              typeof LoggedIn !== typeof true &&
              
              IsLoading === false && LoggedIn.verified === false ?
              
              <Navigate to={`/emailVerification/${LoggedIn._id}`} /> :
              
              IsLoading === false && typeof LoggedIn === typeof true ? 
              
              <Navigate to="/login"/> : 
              
              <></>
     } />

      <Route path="/Talatat" element={
                typeof LoggedIn !== typeof true &&

                IsLoading === false && LoggedIn.verified === true ?
                
                <Talatat /> :
                
                typeof LoggedIn !== typeof true &&
                
                IsLoading === false && LoggedIn.verified === false ?
                
                <Navigate to={`/emailVerification/${LoggedIn._id}`} /> :
                
                IsLoading === false && typeof LoggedIn === typeof true ? 
                
                <Navigate to="/login"/> : 
                
                <></>
      } />

     <Route path="/servicesToEdit" element={
                typeof LoggedIn !== typeof true &&

                IsLoading === false && LoggedIn.verified === true ?
                
                <ServicesToEdit  user={LoggedIn}/> :
                
                typeof LoggedIn !== typeof true &&
                
                IsLoading === false && LoggedIn.verified === false ?
                
                <Navigate to={`/emailVerification/${LoggedIn._id}`} /> :
                
                IsLoading === false && typeof LoggedIn === typeof true ? 
                
                <Navigate to="/login"/> : 
                
                <></>
      } />

     <Route path="/editService/:id" element={
                typeof LoggedIn !== typeof true &&

                IsLoading === false && LoggedIn.verified === true ?
                
                <EditService  user={LoggedIn}/> :
                
                typeof LoggedIn !== typeof true &&
                
                IsLoading === false && LoggedIn.verified === false ?
                
                <Navigate to={`/emailVerification/${LoggedIn._id}`} /> :
                
                IsLoading === false && typeof LoggedIn === typeof true ? 
                
                <Navigate to="/login"/> : 
                
                <></>
      } />

      <Route path="/settings" element={
                        typeof LoggedIn !== typeof true &&

                        IsLoading === false && LoggedIn.verified === true ?
                        
                        <TalatatSettings user={LoggedIn}/> :
                        
                        typeof LoggedIn !== typeof true &&
                        
                        IsLoading === false && LoggedIn.verified === false ?
                        
                        <Navigate to={`/emailVerification/${LoggedIn._id}`} /> :
                        
                        IsLoading === false && typeof LoggedIn === typeof true ? 
                        
                        <Navigate to="/login"/> : 
                        
                        <></>
      } />

      <Route path="/changePassword" element={
                        typeof LoggedIn !== typeof true &&

                        IsLoading === false && LoggedIn.verified === true ?
                        
                        <ChangePassword user={LoggedIn}/> :
                        
                        typeof LoggedIn !== typeof true &&
                        
                        IsLoading === false && LoggedIn.verified === false ?
                        
                        <Navigate to={`/emailVerification/${LoggedIn._id}`} /> :
                        
                        IsLoading === false && typeof LoggedIn === typeof true ? 
                        
                        <Navigate to="/login"/> : 
                        
                        <></>
      }/>

      <Route path="/checkPassword" element={
                        typeof LoggedIn !== typeof true &&

                        IsLoading === false && LoggedIn.verified === true ?
                        
                        <CheckPassword user={LoggedIn}/> :
                        
                        typeof LoggedIn !== typeof true &&
                        
                        IsLoading === false && LoggedIn.verified === false ?
                        
                        <Navigate to={`/emailVerification/${LoggedIn._id}`} /> :
                        
                        IsLoading === false && typeof LoggedIn === typeof true ? 
                        
                        <Navigate to="/login"/> : 
                        
                        <></>
      }/>

<Route path="/changeUserPassword/:token" element={
                        typeof LoggedIn !== typeof true &&

                        IsLoading === false && LoggedIn.verified === true ?
                        
                        <ChangeUserPassword user={LoggedIn}/> :
                        
                        typeof LoggedIn !== typeof true &&
                        
                        IsLoading === false && LoggedIn.verified === false ?
                        
                        <Navigate to={`/emailVerification/${LoggedIn._id}`} /> :
                        
                        IsLoading === false && typeof LoggedIn === typeof true ? 
                        
                        <Navigate to="/login"/> : 
                        
                        <></>
      }/>

<Route path="/changeUsername" element={
                        typeof LoggedIn !== typeof true &&

                        IsLoading === false && LoggedIn.verified === true ?
                        
                        <ChangeUsername user={LoggedIn}/> :
                        
                        typeof LoggedIn !== typeof true &&
                        
                        IsLoading === false && LoggedIn.verified === false ?
                        
                        <Navigate to={`/emailVerification/${LoggedIn._id}`} /> :
                        
                        IsLoading === false && typeof LoggedIn === typeof true ? 
                        
                        <Navigate to="/login"/> : 
                        
                        <></>
      }/>

<Route path="/changeImage" element={
                        typeof LoggedIn !== typeof true &&

                        IsLoading === false && LoggedIn.verified === true ?
                        
                        <ChangeImage user={LoggedIn}/> :
                        
                        typeof LoggedIn !== typeof true &&
                        
                        IsLoading === false && LoggedIn.verified === false ?
                        
                        <Navigate to={`/emailVerification/${LoggedIn._id}`} /> :
                        
                        IsLoading === false && typeof LoggedIn === typeof true ? 
                        
                        <Navigate to="/login"/> : 
                        
                        <></>
      }/>

      </Routes>

    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
       <Main />
</AuthContextProvider>
);