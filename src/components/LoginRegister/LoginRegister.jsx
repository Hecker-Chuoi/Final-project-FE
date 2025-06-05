import {useState} from "react";
import "./styles.css";

function LoginRegister({ setCurrentUser }) {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [occupation, setOccupation] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isRegister, setIsRegister] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await fetch(process.env.REACT_APP_API_PREFIX + `/auth/log-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_name: userName, password })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data);
      } else {
        alert("Login failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

const handleSignup = async () => {
    // Kiểm tra các trường bắt buộc
    if (!userName || !firstName || !password) {
      setErrorMessage("Username, First Name, and Password are required.");
      alert("Sign up failed");
      return;
    }

    try {
      const response = await fetch(process.env.REACT_APP_API_PREFIX + `/auth/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name: userName,
          first_name: firstName,
          last_name: lastName,
          password,
          location,
          description,
          occupation,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        setErrorMessage(err.message || "Signup failed.");
        alert("Sign up failed");
        return;
      }

      const user = await response.json();
      console.log("Signed up:", user);
      // TODO: redirect hoặc tự động login
    } catch (error) {
      alert("Sign up failed");
      setErrorMessage("Server error during signup.");
    }
  };

  return (
    <div className="login-register-container">
      <h2 className="form-title">{isRegister ? "Register" : "Login"}</h2>

      <div className="form-fields">
        {isRegister ? (
          <>
            <input className="form-input" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Username *" />
            <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password *" />
            <input className="form-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name *" />
            <input className="form-input" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" />
            <input className="form-input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
            <input className="form-input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
            <input className="form-input" value={occupation} onChange={(e) => setOccupation(e.target.value)} placeholder="Occupation" />
            <button className="form-button" onClick={handleSignup}>Register</button>
          </>
        ) : (
          <>
            <input className="form-input" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Login Name" />
            <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button className="form-button" onClick={handleLogin}>Login</button>
          </>
        )}
        <button className="switch-button" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
        </button>
        {errorMessage && <p className="error-text">{errorMessage}</p>}
      </div>
    </div>
  );
}

export default LoginRegister;