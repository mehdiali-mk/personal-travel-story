import React, { useEffect, useState } from "react";
import { getInitials } from "../../utils/helper";

export default function ProfileInfo({ userInfo, onLogout }) {
  const [userName, setUserName] = useState("");
  const [initialName, setInitialName] = useState("");

  useEffect(() => {
    async function setUsernameInitialName() {
      await setUserName(userInfo?.fullName);
      await setInitialName(getInitials(userName));
    }
    setUsernameInitialName();
  }, [userInfo]);

  return (
    userInfo && (
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
          {initialName || ""}
        </div>
        <div>
          <p className="text-sm font-medium">{userName || ""}</p>
          <button
            onClick={onLogout}
            className="text-sm text-slate-700 underline cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    )
  );
}
