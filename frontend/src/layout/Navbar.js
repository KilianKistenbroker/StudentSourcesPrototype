import React from 'react'
import {Link} from "react-router-dom"
import { useState } from "react";
import logo from '../logos/Light-Version.png'

export default function Navbar() {

  const [topRightNav, setTopRightNave] = useState('Login')

  const swapName =()=> {
    topRightNav === 'Login' ? setTopRightNave("Sign up") : setTopRightNave("Login")
  }

  return (
    <div className="navbar">
        
            <Link id="logo-link" to={"/sign up"}>
                <img src={logo} className='logo' alt="" />
            </Link>
            
            {/* intentially empty */}
            <div></div>

            {/* this depends on current route */}
            <Link id='login' to = {"/" + topRightNav} onClick={swapName} className="top-right-nav">{topRightNav}</Link>
        
        
    </div>
  )
}
