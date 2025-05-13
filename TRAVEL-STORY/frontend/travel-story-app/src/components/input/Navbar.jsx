import React from "react";
import LOGO from "../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import ProfileInfo from "../Cards/ProfileInfo";
import SearchBar from "./SearchBar";

const Navbar = ({ userInfo, searchQuery, setSearchQuery, onSearchNote, handleClearSearch }) => {
  const navigate = useNavigate();
  const isToken = localStorage.getItem("token");

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
    else {
    onSearchNote(""); 
  }
  };

  const onClearSearch = () => {
    handleClearSearch();
    setSearchQuery("");
  };

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
      <img src={LOGO} alt="travel story" className="h-9" />

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
          <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
        </>
      )}
    </div>
  );
};

export default Navbar;



//commented code
// import React from "react";
// import LOGO from "../../assets/images/logo.png";
// import { useNavigate } from "react-router-dom";
// import ProfileInfo from "../Cards/ProfileInfo";
// import SearchBar from "./SearchBar";
// const Navbar = ({ userInfo,searchQuery,setSearchQuery,onSearchNote,handleClearSearch }) => { 
//   const navigate = useNavigate();
//   const isToken = localStorage.getItem("token");

//   const onLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   const handleSearch=()=>{
//     if (searchQuery){
//       onSearchNote(searchQuery);
//     }
//   }

//   const onClearSearch=()=>{
//     handleClearSearch();
//     setSearchQuery("")
//   }

//   return (
//     <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
//       <img src={LOGO} alt="travel story" className="h-9" />
      
//       {isToken && (
//         <>
//         <SearchBar
//         value = {searchQuery}
//         onChange = {({ target})=>{
//           setSearchQuery(target.value);
//         }}
//         handleSearch= {handleSearch}
//         onClearSearch = {onClearSearch}
//         />

//         <ProfileInfo userInfo={userInfo} onLogout={onLogout} />{" "}
//         </>
      
//       )}
//     </div>
//   );
// };

// export default Navbar;












//****************************************************************** */
// import React, { useEffect, useState } from "react";
// import LOGO from "../../assets/images/logo.png";
// import { useNavigate } from "react-router-dom";
// import ProfileInfo from "../Cards/ProfileInfo";

// const Navbar = () => {
//   const [userInfo, setUserInfo] = useState(null);
//   const navigate = useNavigate();
//   const isToken = localStorage.getItem("token");

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (user) {
//       setUserInfo(user);
//     }
//   }, []);

//   // const onLogout = () => {
//   //   localStorage.removeItem("token");
//   //   localStorage.removeItem("user");
//   //   navigate("/login");
//   // };

//   const onLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUserInfo(null); // Clear state immediately
//     navigate("/login");
//   };
  

//   return (
//     <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
//       <img src={LOGO} alt="travel story" className="h-9" />
//       {isToken && userInfo && (
//         <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
//       )}
//     </div>
//   );
// };

// export default Navbar;


































// ********************************************************************************
// import React from "react";
// import LOGO from "../../assets/images/logo.png"
// import { useNavigate } from 'react-router-dom';
// import ProfileInfo from '../Cards/ProfileInfo';

// //-------------IMAGE---------------
// const Navbar = ({userInfo}) => {
//   const isToken = localStorage.getItem("token");
// const navigate = useNavigate();
//   // const onLogout = () => {
//   //   localStorage.clear();
//   //   navigate("/login");
//   // };
//   const onLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };
  
//   return (
//     <div className= 'bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10'>
//       <img src={LOGO} alt="travel story" className="h-9" />
//       {isToken && <ProfileInfo userInfo={userInfo} onLogout={onLogout}/>}
//     </div>
//   );
// };

// export default Navbar



