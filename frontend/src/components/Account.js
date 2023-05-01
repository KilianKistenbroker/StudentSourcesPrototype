import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Account = ({ data }) => {
  const user_regex_l = /\S{4,24}/;

  const password_regex_l = /\S{8,24}/;
  const password_regex_sl = /[a-zA-Z]/;
  const password_regex_sn = /[0-9]/;

  const email_regex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

  const userRef = useRef();

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [validFirstName, setValidFirstName] = useState(false);
  const [firstNameFocus, setFirstNameFocus] = useState(false);

  const [lastName, setLastName] = useState("");
  const [validLastName, setValidLastName] = useState(false);
  const [lastNameFocus, setLastNameFocus] = useState(false);

  // this refers to username
  const [user, setUser] = useState(data.user);
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [password, setPassword] = useState(data.password);
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [showingPassword, setShowingPassword] = useState(false);

  useEffect(() => {
    const res = user_regex_l.test(user);
    setValidName(res);
  }, [user]);

  useEffect(() => {
    const res = email_regex.test(email);
    setValidEmail(res);
  }, [email]);

  useEffect(() => {
    if (firstName.length > 0) setValidFirstName(true);
    else setValidFirstName(false);
  }, [firstName]);

  useEffect(() => {
    if (lastName.length > 0) setValidLastName(true);
    else setValidLastName(false);
  }, [lastName]);

  useEffect(() => {
    const res =
      password_regex_l.test(password) &&
      password_regex_sl.test(password) &&
      password_regex_sn.test(password);
    setValidPassword(res);
  }, [password]);

  const handleHiddenPassword = () => {
    setShowingPassword(!showingPassword);
  };

  return (
    <form>
      <label htmlFor="firstname">
        First Name
        <span className={validFirstName ? "show_valid" : "hide"}>
          <FontAwesomeIcon icon={faCheck} />
        </span>
      </label>

      <input
        style={{ height: "50px" }}
        type="text"
        id="firstname"
        ref={userRef}
        autoComplete="off"
        value={firstName.trim(" ")}
        onChange={(e) => setFirstName(e.target.value.trim(" "))}
        // required
        aria-invalid={validFirstName ? "false" : "true"}
        aria-describedby="firstnamenote"
        onFocus={() => setFirstNameFocus(true)}
        onBlur={() => setFirstNameFocus(false)}
      />

      <label htmlFor="lastname">
        Last Name
        <span className={validLastName ? "show_valid" : "hide"}>
          <FontAwesomeIcon icon={faCheck} />
        </span>
      </label>

      <input
        style={{ height: "50px" }}
        type="text"
        id="lastname"
        ref={userRef}
        autoComplete="off"
        value={lastName.trim(" ")}
        onChange={(e) => setLastName(e.target.value.trim(" "))}
        // required
        aria-invalid={validLastName ? "false" : "true"}
        aria-describedby="lastnamenote"
        onFocus={() => setLastNameFocus(true)}
        onBlur={() => setLastNameFocus(false)}
      />

      <label htmlFor="email">
        Email
        {/* USING HOTFIX */}
        <span className={validEmail ? "show_valid" : "hide"}>
          <FontAwesomeIcon icon={faCheck} />
        </span>
      </label>

      <input
        style={{ height: "50px" }}
        type="text"
        id="email"
        ref={userRef}
        autoComplete="off"
        value={email.trim(" ")}
        onChange={(e) => setEmail(e.target.value.trim(" "))}
        // required
        aria-invalid={validEmail ? "false" : "true"}
        aria-describedby="emailnote"
        onFocus={() => setEmailFocus(true)}
        onBlur={() => setEmailFocus(false)}
      />

      <label htmlFor="username">
        Username
        <span className={validName ? "show_valid" : "hide"}>
          <FontAwesomeIcon icon={faCheck} />
        </span>
      </label>

      <input
        style={{ height: "50px" }}
        type="text"
        id="username"
        ref={userRef}
        autoComplete="off"
        value={user.trim(" ")}
        onChange={(e) => setUser(e.target.value.trim(" "))}
        // required
        aria-invalid={validName ? "false" : "true"}
        aria-describedby="uidnote"
        onFocus={() => setUserFocus(true)}
        onBlur={() => setUserFocus(false)}
      />

      <label htmlFor="password">
        <div style={{ float: "left" }}>Password :</div>
        <span className={validPassword ? "show_valid" : "hide"}>
          <FontAwesomeIcon icon={faCheck} />
        </span>
        <div>
          {!showingPassword ? (
            <svg
              onClick={handleHiddenPassword}
              xmlns="http://www.w3.org/2000/svg"
              className={"display-show"}
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
              <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
            </svg>
          ) : (
            <svg
              onClick={handleHiddenPassword}
              xmlns="http://www.w3.org/2000/svg"
              className={"display-show"}
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
              <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
              <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
            </svg>
          )}
        </div>
        {/* <input
          className={showingPassword ? "display-show" : "display-hide"}
          value={"  Show  "}
          type="button"
          onClick={handleHiddenPassword}
        /> */}
      </label>

      <input
        style={{ height: "50px" }}
        type={showingPassword ? "text" : "password"}
        id="password"
        autoComplete="new-password"
        value={password.trim(" ")}
        onChange={(e) => setPassword(e.target.value.trim(" "))}
        // required
        aria-invalid={validPassword ? "false" : "true"}
        aria-describedby="pwdnote"
        onFocus={() => setPasswordFocus(true)}
        onBlur={() => setPasswordFocus(false)}
      />

      <button style={{ marginTop: "35px" }}>Update Account</button>
      <button style={{ marginTop: "35px" }}>Delete Account</button>
    </form>
  );
};

export default Account;
