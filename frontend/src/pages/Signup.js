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

const Signup = () => {

    const userRef = useRef()
    const errRef = useRef()

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
            ) : (
                <div className="signup">
                    
                    <div className="messages"> 

                        <p id="firstnamenote" className={firstNameFocus ? "instructions firstname_instructions" : "offscreen"}>
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

                        <p id="lastnamenote" className={lastNameFocus ? "instructions lastname_instructions" : "offscreen"}>
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

                        <p id="emailnote" className={emailFocus ? "instructions email_instructions" : "offscreen"}>
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

                        <p id="uidnote" className={userFocus ? "instructions user_instructions" : "offscreen"}>
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

                        <p id="pwdnote" className={passwordFocus ? "instructions password_instructions" : "offscreen"}>
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

                        <p id="checkboxnote" className={checkboxFocus ? "instructions checkbox_instructions" : "offscreen"}>
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

                    <div className="content">

                        <h1>Create an account</h1>

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
                    
                </div>
            )}
        </>
     );
}
 
export default Signup;