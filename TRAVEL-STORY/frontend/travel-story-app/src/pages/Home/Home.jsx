import React, { useState, useEffect } from "react";
import Navbar from "../../components/input/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddEditTravelStory from "./AddEditTravelStory";

const Home = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [isGuest, setIsGuest] = useState(false);
  const [guestStories, setGuestStories] = useState([]);

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  //get user info*********************************************
  const getUserInfo = async () => {
    try {
      // Check if user is guest first
      const storedUserInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      if (storedUserInfo.isGuest) {
        setUserInfo(storedUserInfo);
        setIsGuest(true);
        return; // Skip API call for guest users
      }

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

  //Get all travel stories**********************************************
  const getAllTravelStories = async () => {
    try {
      // For guest users, only fetch public stories
      const endpoint = isGuest ? "/get-public-stories" : "/get-all-stories";
      const response = await axiosInstance.get(endpoint);

      if (response.data && response.data.stories) {
        // Combine server stories with any guest stories
        const serverStories = response.data.stories;
        setAllStories(isGuest ? [...guestStories, ...serverStories] : serverStories);
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
      // If guest user and API fails, at least show their temporary stories
      if (isGuest) {
        setAllStories([...guestStories]);
      }
    }
  };

  const handleEdit = (data) => {};

  const handleViewStory = (data) => {};
  
  const updateIsFavourite = async (storyData) => {
    // For guest stories (temporary ones)
    if (isGuest && storyData.isGuestStory) {
      // Update in local state only
      const updatedGuestStories = guestStories.map(story => {
        if (story.id === storyData.id) {
          return { ...story, isFavourite: !story.isFavourite };
        }
        return story;
      });
      
      setGuestStories(updatedGuestStories);
      toast.success("Story Updated Successfully");
      getAllTravelStories();
      return;
    }
    
    // For regular stories
    const storyId = storyData._id || storyData.id;
    try {
      const response = await axiosInstance.put(
        "/update-is-favourite/" + storyId,
        {
          isFavourite: !storyData.isFavourite,
        }
      );
      if (response.data && response.data.story) {
        toast.success("Story Updated Successfully");
        getAllTravelStories();
      }
    } catch (error) {
      console.log("An unexpected error occured. Please try again.");
    }
  };

  // Handle creating a story as a guest
  const createGuestStory = (storyData) => {
    // Create a temporary story with a unique ID
    const tempStory = {
      id: `guest-story-${Date.now()}`,
      _id: `guest-story-${Date.now()}`,
      ...storyData,
      createdAt: new Date().toISOString(),
      userId: userInfo.id,
      username: "Guest User",
      isGuestStory: true,
      isFavourite: false
    };
    
    // Add to local guest stories array
    const updatedGuestStories = [tempStory, ...guestStories];
    setGuestStories(updatedGuestStories);
    
    // Update all stories to include this new one
    setAllStories([tempStory, ...allStories]);
    
    return tempStory;
  };

  // Function to handle story submission from AddEditTravelStory
  const handleStorySubmit = (storyData) => {
    if (isGuest) {
      // For guest users, create a temporary story
      const tempStory = createGuestStory(storyData);
      toast.success("Story created temporarily (guest mode)");
      return { success: true, story: tempStory };
    }
    
    // For regular users, the existing API call in AddEditTravelStory will handle it
    return null;
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    // Only fetch stories after we know if user is guest or not
    if (userInfo) {
      getAllTravelStories();
    }
  }, [userInfo, guestStories]);

  return (
    <>
      <Navbar userInfo={userInfo} />

      {/* Guest Banner - only shown for guest users */}
      {isGuest && (
        <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 mx-auto container mt-4 rounded">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold">You're browsing as a guest</p>
              <p className="text-sm">Your stories won't be saved permanently. Create an account to save your travel memories.</p>
            </div>
            <button 
              onClick={() => navigate("/signup")}
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded"
            >
              Create Account
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto py-10">
        <div className="flex gap-7">
          <div className="flex-1">
            {allStories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {allStories.map((item) => {
                  return (
                    <TravelStoryCard
                      key={item._id || item.id}
                      imgUrl={item.imageUrl}
                      title={item.title}
                      story={item.story}
                      date={item.visitedDate}
                      visitedLocation={item.visitedLocation}
                      isFavourite={item.isFavourite}
                      isGuestStory={item.isGuestStory}
                      onEdit={() => handleEdit(item)}
                      onClick={() => handleViewStory(item)}
                      onFavouriteClick={() => updateIsFavourite(item)}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center p-10 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No stories found. {isGuest ? "Create your first temporary story!" : "Add your first travel story!"}</p>
              </div>
            )}
          </div>
          <div className="w-[320px]"></div>
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
            zindex: 999,
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
          isGuest={isGuest}
          onGuestSubmit={handleStorySubmit}
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
