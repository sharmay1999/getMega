import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router";
import "./Logout.css";
import profile from "./user.png";
import { auth, db, logout } from "../../firebase-config";
function Logout() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const history = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (!user) return history("/");
  }, [user, loading]);
  return (
    <div className="dashboard">
      <div className="dashboard__container">
        <div className="tooltip">
          <img src={profile} width='24px' style={{ cursor: 'pointer' }} onClick={logout} />
          <span className="tooltiptext">Logout</span>
        </div>
        {/* <div>{user?.email}</div> */}
      </div>
    </div>
  );
}
export default Logout;