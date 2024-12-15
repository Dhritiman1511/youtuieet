import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (name?.trim() === "" || description.trim() === "") {
    throw new ApiError(400, "Name and description is required");
  }

  const playList = await Playlist.create({
    name,
    description,
    owner: req.user._id,
  });

  if (!playList) {
    throw new ApiError(500, "There was a problem while creating playlist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playList, "Playlist was created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    throw new ApiError(400, "Id is required");
  }

  const playlist = await Playlist.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
            },
          },
          {
            $addFields: {
              owner: {
                $first: "owner",
              },
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $addFields: {
        owner: {
          $first: "owner",
        },
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Play list is returned successfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const playlist = await Playlist.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(playlistId),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
            },
          },
          {
            $addFields: {
              owner: {
                $first: "owner",
              },
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $addFields: {
        owner: {
          $first: "owner",
        },
      },
    },
  ]);
  if (!playlist) {
    throw new ApiError(400, "Playlist not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Play list is returned successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!playlistId || !videoId) {
    throw new ApiError(400, "Playlist Id and video Id was not found");
  }
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(400, "Playlist was not found");
  }
  playlist.videos.push(new mongoose.Types.ObjectId(videoId));
  const updatedPlayList = await playlist.save({ validateBeforeSave: false });
  if (updatedPlayList) {
    throw new ApiError(400, "There was a problem while updating the playlist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updatedPlayList, "Video was added to Playlist"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!playlistId || !videoId) {
    throw new ApiError(400, "Playlist Id and video Id was not found");
  }
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(400, "Playlist was not found");
  }
  playlist.videos = playlist.videos.filter((item) => item._id != videoId);
  const updatedPlayList = await playlist.save({ validateBeforeSave: false });
  if (updatedPlayList) {
    throw new ApiError(400, "There was a problem while updating the playlist");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedPlayList, "Video was deleted from Playlist")
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!playlistId) {
    throw new ApiError(400, "Playlist id is required");
  }

  const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);
  if (!deletedPlaylist) {
    throw new ApiError(500, "There was a problem while deleting the playlist");
  }
  return res.status(200).json(new ApiResponse(200, {}, "Playlist was removed"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  if (!playlistId) {
    throw new ApiError(400, "Playlist id is required");
  }
  if (name.trim() === "" || description.trim() === "") {
    throw new ApiError(400, "Name and Description is required");
  }
  const updatedPlayList = await Playlist.findByIdAndUpdate({
    name,
    description,
  });
  if (!updatePlaylist) {
    throw new ApiError(500, "There was a problem while updating the Playlist");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatePlaylist, "Playlist was updated successfully")
    );
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
