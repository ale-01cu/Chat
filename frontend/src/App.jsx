import { useEffect, useState } from 'react';
import {Routes, Route} from "react-router-dom";
import Chat from './pages/Chat'
import Login from './components/Login'
import Register from './components/Register'
import useVerifyToken from './hooks/verifyTokens'

// import LoginPage from './pages/LoginPage'
import './App.css'

function App() {
  useVerifyToken()
  
  return (
    <>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/chat' element={<Chat/>}/>
      </Routes>
    </>
  )
}

export default App
