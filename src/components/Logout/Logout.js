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
  const fetchUserName = async () => {
    try {
      const query = await db
        .collection("users")
        .where("uid", "==", user?.uid)
        .get();
      const data = await query.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return history("/");
    fetchUserName();
  }, [user, loading]);
  return (
    <div className="dashboard">
      <div className="dashboard__container">
        <div>{name}</div>
        <div class="tooltip">
          <img src={profile} width='24px' style={{ cursor: 'pointer' }} onClick={logout} />
          <span class="tooltiptext">Logout</span>
        </div>
        {/* <div>{user?.email}</div> */}
      </div>
    </div>
  );
}
export default Logout;