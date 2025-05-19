import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";

export default function Home() {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);

  // GET User Information.
  async function getUserInfo() {
    try {
      const response = await axiosInstance.get("/get-user");
      console.log(response.data.user);
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  }

  // GET All travel stories.
  async function getAllTravelStories() {
    try {
      const response = await axiosInstance.get("/get-all-stories");
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log(
        "Error occurred while fetching all travel stories.\n",
        error.message
      );
    }
  }

  // Handle Edit Story Click
  function handleEdit(data) {}

  // Handle Travel Story Click
  function handleViewStory(data) {}

  // Handle Update Favourite.
  function updateIsFavourite(data) {}

  useEffect(() => {
    getAllTravelStories();
    getUserInfo();
  }, []);

  return (
    <div>
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
              <>Empty Card</>
            )}
          </div>

          <div className="w-[320px]"></div>
        </div>
      </div>
    </div>
  );
}
