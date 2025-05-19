import React from "react";
import moment from "moment/moment";
import { FaHeart } from "react-icons/fa6";
import { GrMapLocation } from "react-icons/gr";

export default function TravelStoryCard({
  imgUrl,
  title,
  story,
  date,
  visitedLocation,
  isFavourite,
  onEdit,
  onClick,
  onFavouriteClick,
}) {
  return (
    <div className="border border-slate-300 rounded-lg overflow-hidden bg-white hover:shadow-lg  hover:shadow-slate-200 transition-all  ease-in-out relative cursor-pointer">
      <img
        src={imgUrl}
        alt={title}
        className="w-full h-56 object-cover rounded-lg"
        onClick={onClick}
      />

      <div className="p-4" onClick={onClick}>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <h6 className="text-sm font-medium">{title}</h6>
            <span className="text-xs text-slate-500">
              {date ? moment(date).format("Do MMM YYYY") : "-"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
