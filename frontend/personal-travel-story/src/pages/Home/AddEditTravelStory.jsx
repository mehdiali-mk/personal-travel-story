import React, { useState } from "react";
import { MdAdd, MdDeleteOutline, MdUpdate, MdClose } from "react-icons/md";
import DateSelector from "../../components/Input/DateSelector.jsx";
import ImageSelector from "../../components/Input/ImageSelector.jsx";
import TagInput from "../../components/Input/TagInput.jsx";
import { FaUpload } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance.js";
import moment from "moment";
import uploadImage from "../../utils/uploadImage.js";
import { ToastContainer, toast } from "react-toastify";

export default function AddEditTravelStory({
  storyInfo,
  type,
  onClose,
  getAllTravelStories,
}) {
  const [title, setTitle] = useState("");
  const [storyImg, setStoryImg] = useState(null);
  const [story, setStory] = useState("");
  const [visitedLocation, setVisitedLocation] = useState([]);
  const [visitedDate, setVisitedDate] = useState(null);

  const [error, setError] = useState("");

  async function addNewTravelStory() {
    try {
      let imageUrl = "";

      if (storyImg) {
        const imgUploadResponse = await uploadImage(storyImg);

        imageUrl = imgUploadResponse.imageUrl || "";
      }

      const response = await axiosInstance.post("/add-travel-story", {
        title,
        story,
        imageUrl: imageUrl || "",
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      });

      if (response.data && response.data.story) {
        toast.success("Story added Successfully");
        getAllTravelStories();
        onClose();
      }
    } catch (error) {}
  }

  async function updateTravelStory() {}

  function handleAddOrUpdateClick() {
    console.log("Input Data: ", {
      title,
      storyImg,
      story,
      visitedLocation,
      visitedDate,
    });

    if (!title) {
      setError("Please enter title of story.");
      return;
    }

    if (!story) {
      setError("Please enter the story.");
      return;
    }

    setError("");

    if (type === "edit") {
      updateTravelStory();
    } else {
      addNewTravelStory();
    }
  }
  function handleDeleteImage() {}

  return (
    <div>
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-medium text-slate-700">
          {type === "add" ? "Add Story" : "Update Story"}
        </h5>

        <div>
          <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
            {type === "add" ? (
              <button className="btn-small" onClick={handleAddOrUpdateClick}>
                <MdAdd className="text-lg" /> Add Story
              </button>
            ) : (
              <>
                <button className="btn-small" onClick={handleAddOrUpdateClick}>
                  <MdUpdate className="text-lg" /> Update Story
                </button>
                {/* 
                <button className="btn-small btn-delete" onClick={onClose}>
                  <MdDeleteOutline className="text-lg" /> Delete
                </button> */}
              </>
            )}

            <button className="cursor-pointer" onClick={onClose}>
              <MdClose className="text-lg text-slate-400" />
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-xs pt-2 text-right">{error} </p>
          )}
        </div>
      </div>

      <div>
        <div className="flex-1 flex flex-col gap-2 pt-4">
          <label className="input-label" htmlFor="title">
            TITLE
          </label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="A Day at the Gateway Of India"
            className="text-2xl text-slate-950 outline-none"
            value={title}
            onChange={({ target }) => {
              setTitle(target.value);
            }}
          />
          <div className="my-3">
            <DateSelector date={visitedDate} setDate={setVisitedDate} />
          </div>

          <ImageSelector
            image={storyImg}
            setImage={setStoryImg}
            handleDeleteImage={handleDeleteImage}
          />

          <div className="flex flex-col gap-2 mt-4">
            <label htmlFor="story" className="input-label">
              STORY
            </label>

            <textarea
              name="story"
              id="story"
              type="text"
              className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
              placeholder="Your Story...."
              rows={10}
              value={story}
              onChange={({ target }) => {
                setStory(target.value);
              }}
            ></textarea>
          </div>

          <div className="pt-3">
            <label htmlFor="visitedLocation">VISITED LOCATION</label>
            <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
          </div>
        </div>
      </div>
    </div>
  );
}
