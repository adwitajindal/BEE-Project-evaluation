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

  const [openAddEditModal, setOpenAddEditModal] = useState({
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
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  //Get all travel stories**********************************************
  const getAllTravelStories = async () => {
    try {
      // console.log("setStories 1");
      const response = await axiosInstance.get("/get-all-stories");

      // const response = await axiosInstance.get("http://localhost:8000/get-all-stories");
      // const response = await axiosInstance.get("https://jsonplaceholder.typicode.com/posts");
      //  const response = await axiosInstance.get("https://picsum.photos/v2/list");

      //  console.log(response);
      //  console.log("SetStories 2");

      if (response.data && response.data.stories) {
        // console.log("SetStories 3");

        setAllStories(response.data.stories);
        //  console.log("stories data " + response.data.stories);
        // console.log("SetStories 4");
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
      // console.log("SetStories 5");
    }
  };

  // const temp = () =>{
  //   console.log("hello");
  // }

  const handleEdit = (data) => {};

  const handleViewStory = (data) => {};
  const updateIsFavourite = async (storyData) => {
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

  useEffect(() => {
    // console.log("get all stories");
    // temp();
    getAllTravelStories();
    getUserInfo();
    return () => {};
  }, []);
  return (
    <>
      <Navbar userInfo={userInfo} />

      <div className="container mx-auto py-10">
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
                      onEdit={() => handleEdit(item)}
                      onClick={() => handleViewStory(item)}
                      onFavouriteClick={() => updateIsFavourite(item)}
                    />
                  );
                })}
              </div>
            ) : (
              <> Empty Card Here</>
            )}
          </div>
          <div className="w-[320px]"></div>
        </div>
      </div>
      {/* ADD AND EDIT TRAVEL STORY MODEL */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
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
        onClose={()=>{
          setOpenAddEditModal({isShown:false,type:"add", data:null});
        }}
        getAllTravelStories={getAllTravelStories}
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
