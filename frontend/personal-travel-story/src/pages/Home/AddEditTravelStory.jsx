import React, { useState } from "react";
import { MdAdd, MdDeleteOutline, MdUpdate, MdClose } from "react-icons/md";
import DateSelector from "../../components/Input/DateSelector";

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

  function handleAddOrUpdateClick() {}

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
        </div>
      </div>
    </div>
  );
}
