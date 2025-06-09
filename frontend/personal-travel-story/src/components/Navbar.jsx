import React from "react";
import ProfileInfo from "./Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "./Input/SearchBar.jsx";

export default function Navbar({
  userInfo,
  searchQuery,
  setSearchQuery,
  onSearchNote,
  handleClearSearch,
}) {
  const isToken = localStorage.getItem("token");
  const navigate = useNavigate();

  function onLogout() {
    localStorage.clear();
    navigate("/login");
  }
  function handleSearch() {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  }
  function onClearSearch() {
    handleClearSearch();
    setSearchQuery("");
  }

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
      <h2 className="logo-font-family text-3xl text-primary font-bold">
        Travel Story
      </h2>

      {isToken && (
        <>
          <SearchBar
            value={searchQuery}
            onChange={({ target }) => {
              setSearchQuery(target.value);
            }}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />
          <ProfileInfo userInfo={userInfo} onLogout={onLogout} />{" "}
        </>
      )}
    </div>
  );
}
