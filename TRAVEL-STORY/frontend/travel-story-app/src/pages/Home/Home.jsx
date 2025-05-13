import React, { useState, useEffect } from "react";
import Navbar from "../../components/input/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";
import ViewTravelStory from "./ViewTravelStory";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddEditTravelStory from "./AddEditTravelStory";
import EmptyCard from "../../components/Cards/EmptyCard";
//import EmptyImg from '../../assets/images/add-story.png'
import { DayPicker } from "react-day-picker";
import FilterInfoTitle from "../../components/Cards/FilterInfoTitle";
import moment from "moment";

import { getEmptyCardImg,getEmptyCardMessage } from "../../utils/helper";

const Home = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);
 
 
  const[searchQuery,setSearchQuery]=useState('')
  const [filterType,setFilterType] = useState('');

  const [dateRange, setDateRange] = useState({form:null,to:null});

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });


const [openViewModal, setOpenViewModal] = useState({
  isShown: false,
  type: "add",
  data: null,
});

  //get user info*********************************************
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };
//commented out for now
  //Get all travel stories**********************************************
  // const getAllTravelStories = async () => {
  //   try {
  //    const endpoint ="/get-all-stories";
  //     const response = await axiosInstance.get(endpoint);

  //     if (response.data && response.data.stories) {
  //       setAllStories(response.data.stories);
  //     }
  //     else{
  //       setAllStories([])      }
  //   } catch (error) {
  //     console.error("Error fetching stories:", error);
  //     setAllStories([]);
  //   }
  // };
const [loading, setLoading] = useState(true);

const getAllTravelStories = async () => {
  setLoading(true);  // Set loading to true when fetching stories
  try {
    const response = await axiosInstance.get("/get-all-stories");

    if (response.data && response.data.stories) {
      setAllStories(response.data.stories);
    } else {
      setAllStories([]);
    }
  } catch (error) {
    console.error("Error fetching stories:", error);
    setAllStories([]);
  } finally {
    setLoading(false);  // Set loading to false after fetching
  }
};

  const handleEdit = (data) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data:data });
  };

  const handleViewStory = (data) => {
    setOpenViewModal({ isShown: true, data });
  };
  
  // const updateIsFavourite = async (storyData) => {
       
  //   // For regular stories
  //   const storyId = storyData._id;
  //   try {
  //     const response = await axiosInstance.put(
  //       "/update-is-favourite/" + storyId,
  //       {
         
  //         isFavourite: !storyData.isFavourite,
  //       }
  //     );
  //     if (response.data && response.data.story) {
  //       toast.success("Story Updated Successfully");

  //       // if(filterType === "search" && searchQuery){
  //       //   onSearchStory(searchQuery);
  //       // }else if(filterType === "date"){
  //       //   filterStoriesByDate(dateRange);
  //       // }else{
  //       getAllTravelStories();
  //       // }
  //     }
  //   } catch (error) {
  //     console.log("An unexpected error occured. Please try again.");
  //   }
  // };
const updateIsFavourite = async (storyData) => {
  const storyId = storyData._id;
  try {
    const response = await axiosInstance.put(
      "/update-is-favourite/" + storyId,
      {
        isFavourite: !storyData.isFavourite,
      }
    );
    // Check for 'stor' instead of 'story'
    if (response.data && response.data.stor) {
      toast.success("Story Updated Successfully");
      getAllTravelStories();
    }
  } catch (error) {
    console.log("An unexpected error occured. Please try again.");
  }
};






  //DELETE STORY
  const deleteTravelStory = async (data) => {
    const storyId = data._id;

    try{
      const response = await axiosInstance.delete("/delete-story/"+ storyId);

      if(response.data && !response.data.error){
        toast.error("Story deleted successfully");
        setOpenViewModal((prevState) => ({ ...prevState,isShown: false}));
        getAllTravelStories();
      }
    }
    catch (error){
     
        console.log("An unexpected error occurred. Please try again.");
      
    }
  };

  //search story
//   const onSearchStory= async (query)=>{
//      try{
//       const response = await axiosInstance.get("/search",{
//         params:{
//           query,
//         },
//       });

     
// []ser && atad.esnopser()
//     }
//     catch (error){
     
//         console.log("An unexpected error occurred. Please try again.");
      
//     }
//   }

//   const handleClearSearch = ()=>{

//   }


//commented out for now
// const onSearchStory = async (query) => {
//   try {
//     const response = await axiosInstance.get("/search", {
//       params: {
//         query,
//       },
//     });

//     if (response.data && response.data.stories) {
//       setFilterType("search");
//       setAllStories(response.data.stories);
//       // console.log(response.data);
//       // Handle the search results here (e.g., set to state)
//     }
//   } catch (error) {
//     console.log("An unexpected error occurred. Please try again.");
//   }
// };

// const handleClearSearch = () => {
//   // Clear the search input (e.g., setQuery(''))
//   // console.log("Search cleared.");

//   setFilterType("");
//   getAllTravelStories();

// };
const onSearchStory = async (query) => {
  try {
    const response = await axiosInstance.get("/search", {
      params: { query },
    });

    if (response.data && response.data.stories) {
      setFilterType("search");
      setAllStories(response.data.stories);
    }
  } catch (error) {
    console.log("An unexpected error occurred. Please try again.");
  }
};

const handleClearSearch = () => {
  getAllTravelStories();  // Fetch all stories again
  setFilterType("");  // Reset filter type
  setSearchQuery("");  // Clear the search input
  // getAllTravelStories();  // Fetch all stories again
};


//handle filter travel story by data range
// const filterStoriesByDate = async(day) =>{
//   try{
//     const startDate = day.from ? moment(day.from).valueOf(): null;
//     const endDate = day.to ? moment(day.to).valueOf() : null;

//     if(startDate && endDate){
//       const response = await axiosInstance.get("/travel-stories/filter",{
//         params: { startDate,endDate},
//       });
      
//       if(response.data && response.data.stories){
//         setFilterType("date");
//         setAllStories(response.data.stories);
//       }
//     }
//   }catch(error) {
//     console.log("An unexpected error occurred. Please try again.");
//   }
 
// };

const filterStoriesByDate = async (day) => {
  try {
    const startDate = day.from ? moment(day.from).valueOf() : null;
    const endDate = day.to ? moment(day.to).valueOf() : null;

    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    if (startDate && endDate) {
      const response = await axiosInstance.get("/travel-stories/filter", {
        params: { startDate, endDate },
      });

      console.log("API Response:", response);

      if (response.data && response.data.stories) {
        setFilterType("date");
        setAllStories(response.data.stories);
      } else {
        console.log("No stories found in the response.");
      }
    } else {
      console.log("Invalid date range.");
    }
  } catch (error) {
    console.error("Error Details:", error?.response?.data || error.message);
    console.log("An unexpected error occurred. Please try again.");
  }
};

const handleDayClick = (day) => {
  setDateRange(day);
  filterStoriesByDate(day);
};

const resetFilter =()=>{
  setDateRange({ from: null,to: null});
  setFilterType("");
  getAllTravelStories();
}

  useEffect(() => {
  getAllTravelStories();
  getUserInfo();
  return ()=>{};
  },[]);

  return (
    <>
      <Navbar 
      userInfo={userInfo} 
      searchQuery={searchQuery} 
      setSearchQuery={setSearchQuery} 
     onSearchNote = {onSearchStory}
     handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto py-10">
        <FilterInfoTitle
        filterType={filterType}
        filterDates={dateRange}
        onClear={()=>{
          resetFilter();
        }}
        />

        <div className="flex gap-7">
          <div className="flex-1">
            {allStories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {allStories.map((item) => {
                  return (
                    <TravelStoryCard
                      key={item._id}
                      imgUrl={item.imageUrl}
                      title={item.title}
                      story={item.story}
                      date={item.visitedDate}
                      visitedLocation={item.visitedLocation}
                      isFavourite={item.isFavourite}
                       onClick={() => handleViewStory(item)}
                      onFavouriteClick={() => updateIsFavourite(item)}
                    />
                  );
                })}
              </div>
            ) : (
             <EmptyCard 
             imgSrc={getEmptyCardImg(filterType)} 
             message={getEmptyCardMessage(filterType)}
              />
            )}
          </div>
          <div className="w-[350px]">
            <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
            <div className="p-3">
              <DayPicker
              captionLayout="dropdown-buttons"
                mode="range"
                selected={dateRange}
                onSelect={handleDayClick}
                pagedNavigation
              />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* ADD AND EDIT TRAVEL STORY MODEL */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {
          setOpenAddEditModal({isShown:false, type:"add", data:null});
        }}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <AddEditTravelStory
          type={openAddEditModal.type}
          storyInfo={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({isShown:false, type:"add", data:null});
          }}
          getAllTravelStories={getAllTravelStories}
          //isGuest={isGuest}
          //onGuestSubmit={handleStorySubmit}
        />
      </Modal>

      {/* VIEW TRAVEL STORY MODEL */}
      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => {
          setOpenViewModal({ isShown: false, type: "add", data: null });
    }}

        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <ViewTravelStory
        storyInfo={openViewModal.data||null}
        onClose={()=>{
          setOpenViewModal((prevState)=>({...prevState,isShown:false}));
        }}
        onEditClick={()=>{
          setOpenViewModal((prevState)=>({...prevState,isShown:false}));
          handleEdit(openViewModal.data||null);
        }}
        onDeleteClick={()=>{
          deleteTravelStory(openViewModal.data || null);
        }}
        />
        </Modal>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>
      <ToastContainer />
    </>
  );
};

export default Home;
