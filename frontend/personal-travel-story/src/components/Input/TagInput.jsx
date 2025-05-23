import React, { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";
import { GrMapLocation } from "react-icons/gr";

export default function TagInput({ tags, setTags }) {
  const [inputValue, setInputValue] = useState([]);

  function addNewTag() {
    if (inputValue.trim() !== "") {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  }

  function handleInputChange(event) {
    setInputValue(event.target.value);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      addNewTag();
    }
  }

  function handleRemoveTag(tagToRemove) {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  }

  return (
    <div>
      {tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-2 ">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-2 text-sm text-cyan-600 bg-cyan-200/40 px-3 py-1 rounded"
            >
              <GrMapLocation className="text-sm" /> {tag}
              <button onClick={() => handleRemoveTag(tag)}>
                <MdClose />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-4 mt-3">
        <input
          type="text"
          name="location"
          id="location"
          className="text-sm bg-transparent border border-slate-400 px-3 py-2 rounded outline-none"
          placeholder="Add Location"
          value={inputValue}
          onChange={() => {
            handleInputChange(event);
          }}
          onKeyDown={() => {
            handleKeyDown(event);
          }}
        />
        <button
          className="w-8 h-8 flex items-center justify-center rounded border border-cyan-500 hover:bg-cyan-500 text-cyan-500 hover:text-white"
          onClick={addNewTag}
        >
          <MdAdd className="text-2xl  cursor-pointer" />
        </button>
      </div>
    </div>
  );
}
