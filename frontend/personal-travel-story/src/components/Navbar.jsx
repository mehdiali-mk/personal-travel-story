import React from "react";
import ProfileInfo from "./Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";

export default function Navbar({ userInfo }) {
  const isToken = localStorage.getItem("token");
  const navigate = useNavigate();

  function onLogout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
      <h2 className="logo-font-family text-3xl text-primary font-bold">
        Travel Story
      </h2>

      {isToken && <ProfileInfo userInfo={userInfo} onLogout={onLogout} />}
    </div>
  );
}
