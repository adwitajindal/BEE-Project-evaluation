import React from "react";
import LOGO from "../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import ProfileInfo from "../Cards/ProfileInfo";

const Navbar = ({ userInfo }) => { // ✅ Receive userInfo as prop
  const navigate = useNavigate();
  const isToken = localStorage.getItem("token");

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
      <img src={LOGO} alt="travel story" className="h-9" />
      
      {isToken && userInfo ? ( // ✅ Now userInfo is always available
        <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
      ) : (
        <button 
          onClick={() => navigate("/login")} 
          className="bg-blue-500 text-white px-4 py-1 rounded-md"
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default Navbar;












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



