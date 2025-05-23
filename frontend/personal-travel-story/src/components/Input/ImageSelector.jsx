import React, { useRef, useState, useEffect } from "react";
import { FaRegFileImage } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

export default function ImageSelector({ image, setImage, handleDeleteImage }) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  function handleImageChange(event) {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  }

  function onChooseFile() {
    inputRef.current.click();
  }

  function handleRemoveImage() {
    setImage(null);
    handleDeleteImage();
  }

  useEffect(() => {
    if (typeof image === "string") {
      setPreviewUrl(image);
    } else if (image) {
      setPreviewUrl(URL.createObjectURL(image));
    } else {
      setPreviewUrl(null);
    }

    return () => {
      if (previewUrl && typeof previewUrl === "string" && !image) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [image]);

  return (
    <div>
      <input
        type="file"
        name="image"
        id="image"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!image ? (
        <button
          className="w-full h-[220px] flex flex-col items-center justify-center gap-4 bg-slate-50 rounded border border-slate-200/50"
          onClick={() => {
            onChooseFile();
          }}
        >
          <div className="w-14 h-14 flex items-center justify-center bg-cyan-50 rounded-full border border-cyan-100 cursor-pointer">
            <FaRegFileImage className="text-xl text-cyan-500" />
          </div>

          <p className="text-sm text-slate-500">
            Browse image files to upload.
          </p>
        </button>
      ) : (
        <div className="w-full relative">
          <img
            src={previewUrl}
            alt="Selected Image"
            className="w-full h-[300px] object-cover rounded-lg"
          />

          <button
            className="btn-small btn-delete absolute top-2 right-2"
            onClick={handleRemoveImage}
          >
            <MdDeleteOutline className="text-lg" />
          </button>
        </div>
      )}
    </div>
  );
}
