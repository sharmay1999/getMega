import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, signInWithEmailAndPassword, signInWithFacebook, signInWithGoogle } from "../../firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import './Login.css';
import monitor from './monitor.png';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const history = useNavigate();
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) history("/dashboard");
  }, [user, loading]);
  return (
    <div style={{display: "inline-flex"}}>
      <div style={{width: "80%", backgroundColor: "black", color: "white", paddingTop: "300px", textAlign: "center"}}>
        <img src={monitor} style={{width: "150px"}}></img>
        <h1>Welcome to Analytica</h1>
        </div>
      <div className="login">
        <div className="login__container">
          <div><h2>Sign In</h2></div>
          <input
            type="text"
            className="login__textBox"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail Address"
          />
          <input
            type="password"
            className="login__textBox"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button
            className="login__btn"
            style={{ background: "#166dfc", color: "white" }}
            onClick={() => signInWithEmailAndPassword(email, password)}
          >
            Login
          </button>
          <button className="login__btn login__google" onClick={signInWithGoogle}>
            <div style={{ display: "inline-flex" }}>
              <div><img src="https://www.washingtonpost.com/wp-stat/paywall/USW/images/google-icon.png" style={{ width: "16px", marginTop: "1px" }}></img></div>
              <span className="button_custom">Continue with Google</span>
            </div>
          </button>
          <button className="login__btn login__fb" onClick={signInWithFacebook}>
            <div style={{ display: "inline-flex" }}>
              <object data="../../fb.svg" width="20" height="20"></object>
              <span className="button_custom">Continue with Facebook</span>
            </div>
          </button>
          <div>
            <Link to="/reset">Forgot Password</Link>
          </div>
          <div>
            Don't have an account? <Link to="/register">Register</Link> now.
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;