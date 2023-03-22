import React from 'react'
import {Link, useNavigate} from "react-router-dom"
import { useState, useEffect  } from "react";
import logo from '../logos/Light-Version.png'

export default function Navbar({data}) {

  const [topRightNav, setTopRightNave] = useState('Login')
  const navigate = useNavigate();

  useEffect(() => {
    console.log("changed to: " + data.currentPoint)

    if (data.currentPoint === 'Login')
    {
      setTopRightNave("Sign up")
    }
    else 
    {
      setTopRightNave("Login")
    }
  }, [data.currentPoint])

  const goToSignUp =(e)=> {
    e.preventDefault()

    data.currentPoint = ''
    navigate("/" + data.currentPoint)
  }

  const swapName =(e)=> {
    e.preventDefault()

    if (data.currentPoint === 'Login')
    {
      data.currentPoint = ''
      // setTopRightNave("Login")
    }
    else 
    {
      data.currentPoint = "Login"
      // setTopRightNave("Sign up")
    }
    console.log(data.currentPoint)

    navigate("/" + data.currentPoint)
  }

  return (
    <div className="navbar">
        
            <Link id="logo-link" to={"/"} onClick={goToSignUp}>
                <img src={logo} className='logo' alt="" />
            </Link>
            
            {/* intentially empty */}
            <div></div>

            {/* this depends on current route */}
            <Link id='login' to = {"/" + data.currentPoint} onClick={swapName} className="top-right-nav">{
              topRightNav
            }</Link>
        
        
    </div>
  )
}
