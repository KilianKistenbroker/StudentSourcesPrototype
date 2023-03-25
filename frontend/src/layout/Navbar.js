import React from 'react'
import {Link, useNavigate} from "react-router-dom"
import { useState, useEffect  } from "react";
import logo from '../logos/Light-Version.png'

export default function Navbar({data}) {

  const [topRightNav, setTopRightNave] = useState('Login')
  const navigate = useNavigate();

  useEffect(() => {
    console.log("changed to: " + data.currentPoint)

    if (data.currentPoint === 'login')
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

  const testLogout =(e)=> {
    e.preventDefault()
    data.currentPoint = 'login'
    data.isLoggedIn = false
    // flush local storage
    localStorage.clear()

    navigate('/login')
  }

  const swapName =(e)=> {
    e.preventDefault()

    if (data.currentPoint === 'login')
    {
      data.currentPoint = ''
    }
    else 
    {
      data.currentPoint = "login"
    }
    console.log(data.currentPoint)

    navigate("/" + data.currentPoint)
  }

  console.log("from nav")
  console.log(data)

  if (data.isLoggedIn) {
    
  }

  return (
    <> {data.isLoggedIn ? (
        <div className="navbar">
              
              <Link id="logo-link" to={"/sources"}>
                  <img src={logo} className='logo' alt="" />
              </Link>
              
              <div></div>

              <Link 
              id='user-nav'
              to = '/' className="top-right-nav"
              onClick={testLogout}>
                {<svg xmlns="http://www.w3.org/2000/svg" id='user-nav-icon' fill="currentColor" viewBox="0 0 16 16">
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                      <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                  </svg>}
              </Link> 
          
          
      </div>
    ) : (
      <div className="navbar">
            
             <Link id="logo-link" to={"/"} onClick={goToSignUp}>
                <img src={logo} className='logo' alt="" />
            </Link>
            
            <div></div>

            <Link 
            id={topRightNav === 'Login' ? 'login' : 'signup'} 
            to = {"/" + data.currentPoint} onClick={swapName} className="top-right-nav">
              
              {topRightNav }
            
            </Link> 
        
        
    </div>
    )} </>
  )
}
