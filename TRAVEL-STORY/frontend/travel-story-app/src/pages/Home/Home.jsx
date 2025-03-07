import React, { useState, useEffect } from "react";
import Navbar from "../../components/input/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";
const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  
  const [allStories, setAllStories] = useState([]);

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
  }

  // const temp = () =>{
  //   console.log("hello");
  // }

  

  

  const handleEdit = (data) => {};

  const handleViewStory = (data) => {};
  const isFavourite = async (storyData) => {};

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
    </>
  );
};

export default Home;
