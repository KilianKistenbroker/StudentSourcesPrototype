import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "../api/axios";

const user_endpoint = '/users'

const Signup = () => {

    const userRef = useRef()
    const errRef = useRef()

    // this refers to username
    const [user, setUser] = useState('')                
    const [validName, setValidName] = useState(false)
    const [userFocus, setUserFocus] = useState(false)

    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [passwordFocus, setPasswordFocus] = useState(false)
    const [showingPassword, setShowingPassword] = useState(false)

    // these are used for displaying msg's
    const [errMsg, setErrMsg] = useState('')        
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (user.length > 0)
            setValidName(true)
        else
            setValidName(false)
    }, [user])

    useEffect(() => {
        if (password.length > 0)
            setValidPassword(true)
        else
            setValidPassword(false)
    }, [password])

    useEffect(() => {
        setErrMsg('')
    }, [user, password])

    const handleHiddenPassword = () => {
        setShowingPassword(!showingPassword)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setErrMsg('')

        if (!validName)
        {
            setUserFocus(true)
            return;
        }

        if (!validPassword)
        {
            setPasswordFocus(true)
            return;
        }

        try {
            const response = await axios.get(user_endpoint)

            // checking inputs here
            for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].user == user || response.data[i].email == user) {
                    if (response.data[i].password == password) {
                        setSuccess(true)
                        return
                    }
                    setErrMsg('Invalid password.')
                    return
                }
            }

                setErrMsg('Invalid username.')
                return

                // clear input fields here

        } catch (err) {
            if(!err?.response) {
                setErrMsg('No server response.')
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
                    {/* redirect to home page here here */}
                    
                </section>
            ) : (
                <div className="signup">
                    
                    <div className="messages"> 

                        <p id="uidnote" className={userFocus ? "instructions firstname_instructions" : "offscreen"}>
                            <div>
                                <span className={validName ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>

                                <span className={validName ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>
                                Required field.
                            </div>
                        </p>

                        <p id="pwdnote" className={passwordFocus ? "instructions lastname_instructions" : "offscreen"}>
                            <div>
                                <span className={validPassword ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>

                                <span className={validPassword ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>

                                Required field.
                            </div>
                        </p>

                    </div>

                    <div className="content">

                        <h1>Login</h1>

                        <form onSubmit={handleSubmit}>

                            {/* SET USERNAME */}

                            <label htmlFor="username">
                                Email | Username
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

                            <button 
                            disabled={!validName || 
                                !validPassword ? true : false}>
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
                    
                </div>
            )}
        </>
     );
}
 
export default Signup;