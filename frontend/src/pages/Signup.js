import {Link, useNavigate} from "react-router-dom"
import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "../api/axios";

const user_regex_l = /\S{4,24}/

const password_regex_l = /\S{8,24}/
const password_regex_sl = /[a-zA-Z]/
const password_regex_sn = /[0-9]/

const email_regex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

const user_endpoint = '/users'

const Signup = ({data}) => {

    const userRef = useRef()
    const errRef = useRef()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [validEmail, setValidEmail] = useState(false)
    const [emailFocus, setEmailFocus] = useState(false)

    const [firstName, setFirstName] = useState('')
    const [validFirstName, setValidFirstName] = useState(false)
    const [firstNameFocus, setFirstNameFocus] = useState(false)

    const [lastName, setLastName] = useState('')
    const [validLastName, setValidLastName] = useState(false)
    const [lastNameFocus, setLastNameFocus] = useState(false)

    // this refers to username
    const [user, setUser] = useState('')                
    const [validName, setValidName] = useState(false)
    const [userFocus, setUserFocus] = useState(false)

    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [passwordFocus, setPasswordFocus] = useState(false)
    const [showingPassword, setShowingPassword] = useState(false)

    const [checkbox, setCheckbox] = useState(false);
    const [checkboxFocus, setCheckboxFocus] = useState(false);

    // these are used for displaying msg's
    const [errMsg, setErrMsg] = useState('')        
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        const res = user_regex_l.test(user)
        console.log(res)
        console.log(user)
        setValidName(res)
    }, [user])

    useEffect(() => {
        const res = email_regex.test(email)
        console.log(res)
        console.log(email)
        setValidEmail(res)
    }, [email])

    useEffect(() => {
        if (firstName.length > 0)
            setValidFirstName(true)
        else
            setValidFirstName(false)
    }, [firstName])

    useEffect(() => {
        if (lastName.length > 0)
            setValidLastName(true)
        else
            setValidLastName(false)
    }, [lastName])

    useEffect(() => {
        const res = password_regex_l.test(password) && 
            password_regex_sl.test(password) && 
            password_regex_sn.test(password)

        console.log(res)
        console.log(password)
        setValidPassword(res)
    }, [password])

    useEffect(() => {
        setErrMsg('')
    }, [user, password, firstName, lastName, email])

        // ***************** REUSED CODE *****************
        const [windowDimension, setWindowDimension] = useState({
            winWidth: window.innerWidth,
            winHeight: window.innerHeight
        })
    
        const detectSize =()=> {
            setWindowDimension({
                winWidth: window.innerWidth,
                winHeight: window.innerHeight
            })
        }
    
        useEffect(() => {
            // reset focus
            document.activeElement.blur()

            window.addEventListener('resize', detectSize)
    
            console.log("height: "+windowDimension.winHeight);
            console.log("width: "+windowDimension.winWidth);
    
            return () => {
                window.removeEventListener('resize', detectSize)
            }
        }, [windowDimension])
        // ****************** REUSED CODE ***************** 

    const customLink =(e)=> {
        e.preventDefault()
        if (data.currentPoint === 'login')
            data.currentPoint = ''
        else
            data.currentPoint = "login"
        console.log(data.currentPoint)
        navigate("/" + data.currentPoint)
    }

    const handleHiddenPassword = () => {
        setShowingPassword(!showingPassword)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setErrMsg('')

        if (!checkbox)
        {
            setCheckboxFocus(true)
            return;
        }

        // double check here in case they overwrote my html
        if (!validFirstName || !validLastName || !validEmail || !validName || !validPassword) {
            console.log("invalid")
            setErrMsg("Invalid entry.")
            return
        }

        try {
            const response = await axios.post(user_endpoint,
                JSON.stringify({firstName, lastName, email, user, password}),
                {
                    headers: {"Content-Type": 'application/json'},
                    withCredentials: true
                })

                console.log(response.data)
                console.log(JSON.stringify(response))
                setSuccess(true)

                // clear input fields here

        } catch (err) {
            if(!err?.response) {
                setErrMsg('No server response.')
            }
            else if (err.response?.status === 409) {
                setErrMsg('Username already taken.')
            } 
            else {
                setErrMsg('Registration failed.')
            }
            errRef.current.focus()
        }
    }

    return ( 
        
        // convert this to swap grid style and ordering when window is too thin
        
        <>
            {success ? (
                <section>
                    <h1 className="placeholder">Success</h1>
                    {/* redirect to login here */}
                    
                </section>
            ) : windowDimension.winWidth > 1050 ? (
                <div className="signup">


                    <div className="ad">

                        <h3>Study with Student Sources </h3><br />

                        <div className="body">

                            <div className="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31zM2.19 4a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4H2.19zm4.69-1.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707z"/>
                                </svg>
                            </div>
                            <div className="item">
                                <p className="header">Organinze</p> 
                                your files and notes. <br /> <br />
                            </div> 

                            <div className="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/>
                                </svg>
                            </div>
                            <div className="item">
                                <p className="header">Collaborate,</p>
                                download, and share files. <br /><br />
                            </div> 

                            <div className="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5ZM3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.58 26.58 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.933.933 0 0 1-.765.935c-.845.147-2.34.346-4.235.346-1.895 0-3.39-.2-4.235-.346A.933.933 0 0 1 3 9.219V8.062Zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a24.767 24.767 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25.286 25.286 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135Z"/>
                                    <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2V1.866ZM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5Z"/>
                                </svg>
                            </div>
                            <div className="item">
                                <p className="header">Streamline</p>
                                your workflow with advanced A.I. <br /><br />
                            </div> 
                        </div>
                    </div>

                        
                        
                    

                    <div className="content">
                        
                        <h1>
                            Create an account 
                            <span className="tiny">
                                <Link id="" to={"/login"} onClick={customLink}>or login</Link>
                            </span>
                        </h1>
                        
                        <form onSubmit={handleSubmit}>

                            
                                
                            {/* SET FIRST NAME */}
                            <label htmlFor="firstname">
                                First Name
                                <span className={validFirstName ? "show_valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>
                            </label>

                            <input type="text"
                            id="firstname"
                            ref={userRef}
                            autoComplete="off"
                            value={firstName.trim(' ')}
                            onChange={(e) => setFirstName(e.target.value.trim(' '))}
                            required
                            aria-invalid={validFirstName ? "false" : "true"}
                            aria-describedby="firstnamenote"
                            onFocus={() => setFirstNameFocus(true)}
                            onBlur={() => setFirstNameFocus(false)} />

                            
                            {/* SET LAST NAME */}
                            <label htmlFor="lastname">
                                Last Name
                                <span className={validLastName ? "show_valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>
                            </label>

                            <input type="text"
                            id="lastname"
                            ref={userRef}
                            autoComplete="off"
                            value={lastName.trim(' ')}
                            onChange={(e) => setLastName(e.target.value.trim(' '))}
                            required
                            aria-invalid={validLastName ? "false" : "true"}
                            aria-describedby="lastnamenote"
                            onFocus={() => setLastNameFocus(true)}
                            onBlur={() => setLastNameFocus(false)} />
                            
                               
                            {/* SET EMAIL */}

                            <label htmlFor="email">
                                Email
                                
                                {/* USING HOTFIX */}
                                <span className={validEmail ? "show_valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>
                            </label>

                            <input type="text"
                            id="email"
                            ref={userRef}
                            autoComplete="off"
                            value={email.trim(' ')}
                            onChange={(e) => setEmail(e.target.value.trim(' '))}
                            required
                            aria-invalid={validEmail ? "false" : "true"}
                            aria-describedby="emailnote"
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)} />

                            {/* SET USERNAME */}

                            <label htmlFor="username">
                                Username
                                <span className={validName ? "show_valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>

                            </label>

                            <input type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            value={user.trim(' ')}
                            onChange={(e) => setUser(e.target.value.trim(' '))}
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)} />

                            {/* SET PASSWORD */}
                            

                            <label htmlFor="password">
                                Password : 
                                
                                <span className={validPassword ? "show_valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>

                                <input className={showingPassword ? "display-show" : "display-hide"} value={"  Show  "} type="button" onClick={handleHiddenPassword}/>
                            </label>
                            
                            <input 
                            type={showingPassword ? "text" : "password"}
                            id="password"
                            autoComplete="new-password"
                            value={password.trim(' ')}
                            onChange={(e) => setPassword(e.target.value.trim(' '))}
                            required
                            aria-invalid={validPassword ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPasswordFocus(true)}
                            onBlur={() => setPasswordFocus(false)} />

                            {/* SUBMIT BUTTON */}

                            <label className="check" htmlFor="">
                                <span >
                                    <input 
                                        id="checkboxnote"
                                        className="checkbox" 
                                        type="checkbox" 
                                        onChange={(e) => setCheckbox(e.target.checked)}
                                        onFocus={() => setCheckboxFocus(true)}
                                        onBlur={() => setCheckboxFocus(false)}/>
                                     I agree to and acknowledge the <Link target="_blank" id="" to={"terms"}> Terms and Conditions</Link>
                                </span>
                            </label>

                            <button 
                            disabled={!validName || 
                                !validPassword || 
                                !validFirstName || 
                                !validLastName || 
                                !validEmail ? true : false}>
                                Continue
                            </button>
                        </form>

                        <p 
                        ref={errRef} 
                        className={errMsg? "errmsg" : "offscreen"} 
                        aria-live="assertive">
                            {errMsg}
                        </p>
                    </div>
                    
                    <div className="messages"> 

                        <p id="firstnamenote" className={firstNameFocus ? "instructions firstname_instructions desktop" : "offscreen"}>
                            <div>
                                <span className={validFirstName ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>

                                <span className={validFirstName ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>
                                Required field.
                            </div>
                        </p>

                        <p id="lastnamenote" className={lastNameFocus ? "instructions lastname_instructions desktop" : "offscreen"}>
                            <div>
                                <span className={validLastName ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>

                                <span className={validLastName ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>
                                Required field.
                            </div>
                        </p>

                        <p id="emailnote" className={emailFocus ? "instructions email_instructions desktop" : "offscreen"}>
                            <div>
                                <span className={validEmail ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>

                                <span className={validEmail ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>
                                Please use valid email formatting.
                            </div>
                        </p>

                        <p id="uidnote" className={userFocus ? "instructions user_instructions desktop" : "offscreen"}>
                            <div>
                                <span className={user_regex_l.test(user) ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>

                                <span className={user_regex_l.test(user) ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>
                                Must contain 4 to 24 characters. 
                            </div>
                        </p>

                        <p id="pwdnote" className={passwordFocus ? "instructions password_instructions desktop" : "offscreen"}>
                            <div className="sentence_spacing">
                                
                                <span className={password_regex_l.test(password) ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>

                                <span className={password_regex_l.test(password) ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>

                                Must contain 8 to 24 characters.
                            </div>
                            <div className="sentence_spacing">
                                
                                <span className={password_regex_sn.test(password) ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>

                                <span className={password_regex_sn.test(password) ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>
                                Must contain at least 1 number.
                            </div>
                            <div className="">
                                
                                <span className={password_regex_sl.test(password) ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>

                                <span className={password_regex_sl.test(password) ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>
                                Must contain at least 1 letter.
                            </div>
                        </p>

                        <p id="checkboxnote" className={checkboxFocus ? "instructions checkbox_instructions desktop" : "offscreen"}>
                            <div>
                                <span className={checkbox ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>

                                <span className={checkbox ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>
                                Required field.
                            </div>
                        </p>
                    </div>
                    
                </div>
            ) : (
                <div className="signup-mobile">

                    <div className="ad">

                        <h3>Study with Student Sources </h3><br />

                        <div className="body">

                            <div className="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31zM2.19 4a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4H2.19zm4.69-1.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707z"/>
                                </svg>
                            </div>
                            <div className="item">
                                <p className="header">Organinze</p> 
                                your files and notes. <br /> <br />
                            </div> 

                            <div className="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/>
                                </svg>
                            </div>
                            <div className="item">
                                <p className="header">Collaborate,</p>
                                download, and share files. <br /><br />
                            </div> 

                            <div className="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5ZM3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.58 26.58 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.933.933 0 0 1-.765.935c-.845.147-2.34.346-4.235.346-1.895 0-3.39-.2-4.235-.346A.933.933 0 0 1 3 9.219V8.062Zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a24.767 24.767 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25.286 25.286 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135Z"/>
                                    <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2V1.866ZM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5Z"/>
                                </svg>
                            </div>
                            <div className="item">
                                <p className="header">Streamline</p>
                                your workflow with advanced A.I. <br /><br />
                            </div> 
                        </div>
                    </div>

                    <div className="content-mobile">

                        <h1>
                            Create an account 
                            <span className="tiny">
                                <Link id="" to={"/login"} onClick={customLink}>or login</Link>
                            </span>
                        </h1>

                        <form onSubmit={handleSubmit}>
                                
                            {/* SET FIRST NAME */}
                            <label htmlFor="firstname">
                                First Name
                                <span className={validFirstName ? "show_valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>
                            </label>

                            <input type="text"
                            id="firstname"
                            ref={userRef}
                            autoComplete="off"
                            value={firstName.trim(' ')}
                            onChange={(e) => setFirstName(e.target.value.trim(' '))}
                            required
                            aria-invalid={validFirstName ? "false" : "true"}
                            aria-describedby="firstnamenote"
                            onFocus={() => setFirstNameFocus(true)}
                            onBlur={() => setFirstNameFocus(false)} />

                            
                            {/* SET LAST NAME */}
                            <label htmlFor="lastname">
                                Last Name
                                <span className={validLastName ? "show_valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>
                            </label>

                            <input type="text"
                            id="lastname"
                            ref={userRef}
                            autoComplete="off"
                            value={lastName.trim(' ')}
                            onChange={(e) => setLastName(e.target.value.trim(' '))}
                            required
                            aria-invalid={validLastName ? "false" : "true"}
                            aria-describedby="lastnamenote"
                            onFocus={() => setLastNameFocus(true)}
                            onBlur={() => setLastNameFocus(false)} />
                            
                               
                            {/* SET EMAIL */}

                            <label htmlFor="email">
                                Email
                                
                                {/* USING HOTFIX */}
                                <span className={validEmail ? "show_valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>
                            </label>

                            <input type="text"
                            id="email"
                            ref={userRef}
                            autoComplete="off"
                            value={email.trim(' ')}
                            onChange={(e) => setEmail(e.target.value.trim(' '))}
                            required
                            aria-invalid={validEmail ? "false" : "true"}
                            aria-describedby="emailnote"
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)} />

                            {/* SET USERNAME */}

                            <label htmlFor="username">
                                Username
                                <span className={validName ? "show_valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>

                            </label>

                            <input type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            value={user.trim(' ')}
                            onChange={(e) => setUser(e.target.value.trim(' '))}
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)} />

                            {/* SET PASSWORD */}
                            

                            <label htmlFor="password">
                                Password : 
                                
                                <span className={validPassword ? "show_valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>

                                <input className={showingPassword ? "display-show" : "display-hide"} value={"  Show  "} type="button" onClick={handleHiddenPassword}/>
                            </label>
                            
                            <input 
                            type={showingPassword ? "text" : "password"}
                            id="password"
                            autoComplete="new-password"
                            value={password.trim(' ')}
                            onChange={(e) => setPassword(e.target.value.trim(' '))}
                            required
                            aria-invalid={validPassword ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPasswordFocus(true)}
                            onBlur={() => setPasswordFocus(false)} />

                            {/* SUBMIT BUTTON */}

                            <label className="check" htmlFor="">
                                <span >
                                    <input 
                                        id="checkboxnote"
                                        className="checkbox" 
                                        type="checkbox" 
                                        onChange={(e) => setCheckbox(e.target.checked)}
                                        onFocus={() => setCheckboxFocus(true)}
                                        onBlur={() => setCheckboxFocus(false)}/>
                                     I agree to the <a href="">StudentSources Terms</a> and <a href="">Privacy Policy</a>
                                </span>
                            </label>

                            <button 
                            disabled={!validName || 
                                !validPassword || 
                                !validFirstName || 
                                !validLastName || 
                                !validEmail ? true : false}>
                                Continue
                            </button>
                        </form>

                        <p 
                        ref={errRef} 
                        className={errMsg? "errmsg" : "offscreen"} 
                        aria-live="assertive">
                            {errMsg}
                        </p>
                    </div>
                    
                    <div className="messages-mobile"> 

                        <p id="firstnamenote" className={firstNameFocus ? "instructions" : "offscreen"}>
                            <div>
                                <span className={validFirstName ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>

                                <span className={validFirstName ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>
                                Please enter your first name.
                            </div>
                        </p>

                        <p id="lastnamenote" className={lastNameFocus ? "instructions" : "offscreen"}>
                            <div>
                                <span className={validLastName ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>

                                <span className={validLastName ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>
                                Please enter your last name.
                            </div>
                        </p>

                        <p id="emailnote" className={emailFocus ? "instructions" : "offscreen"}>
                            <div>
                                <span className={validEmail ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>

                                <span className={validEmail ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>
                                Please use valid email formatting.
                            </div>
                        </p>

                        <p id="uidnote" className={userFocus ? "instructions" : "offscreen"}>
                            <div>
                                <span className={user_regex_l.test(user) ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>

                                <span className={user_regex_l.test(user) ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>
                                Username must contain 4 to 24 characters. 
                            </div>
                        </p>

                        <p id="pwdnote" className={passwordFocus ? "instructions" : "offscreen"}>
                            <div className="sentence_spacing">
                                
                                <span className={password_regex_l.test(password) ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>

                                <span className={password_regex_l.test(password) ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>

                                Password must contain 8 to 24 characters.
                            </div>
                            <div className="sentence_spacing">
                                
                                <span className={password_regex_sn.test(password) ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>

                                <span className={password_regex_sn.test(password) ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>
                                Password must contain at least 1 number.
                            </div>
                            <div className="">
                                
                                <span className={password_regex_sl.test(password) ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>

                                <span className={password_regex_sl.test(password) ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>
                                Password must contain at least 1 letter.
                            </div>
                        </p>

                        <p id="checkboxnote" className={checkboxFocus ? "instructions" : "offscreen"}>
                            <div>
                                <span className={checkbox ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>

                                <span className={checkbox ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>
                                Agreement with our terms of service is required.
                            </div>
                        </p>
                    </div>
                    
                </div>
            )}
        </>
     );
}
 
export default Signup;