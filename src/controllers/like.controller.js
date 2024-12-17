import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    if(!videoId)
        {
            throw new ApiError(400,"Video id is required")
        }
        const LikeExists= await Like.findOne({
            $set:{
                video:videoId,
                likedBy:req.user._id
            }
        })
        if(LikeExists)
        {
            const removeLike=await Like.findByIdAndDelete(LikeExists._id)
            if(!removeLike)
                {
                    throw new ApiError(500,"There was a problem while removing the like")
                }
            return res.status(200).json(new ApiResponse(200,{},"Like removed successfully"))
        }
        const addLike=await Like.create({
            video:videoId,
            likedBy:req.user._id
        })
        if(!addLike)
            {
                throw new ApiError(500,"There was a problem while adding the like")
            }
            return res.status(200).json(new ApiResponse(200,{},"Like was added successfully"))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
       if(!commentId)
        {
            throw new ApiError(400,"Video id is required")
        }
        const LikeExists= await Like.findOne({
            $set:{
                comment:commentId,
                likedBy:req.user._id
            }
        })
        if(LikeExists)
        {
            const removeLike=await Like.findByIdAndDelete(LikeExists._id)
            if(!removeLike)
                {
                    throw new ApiError(500,"There was a problem while removing the like")
                }
            return res.status(200).json(new ApiResponse(200,{},"Like removed successfully"))
        }
        const addLike=await Like.create({
            comment:commentId,
            likedBy:req.user._id
        })
        if(!addLike)
            {
                throw new ApiError(500,"There was a problem while adding the like")
            }
            return res.status(200).json(new ApiResponse(200,{},"Like was added successfully"))

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
       if(!tweetId)
        {
            throw new ApiError(400,"Video id is required")
        }
        const LikeExists= await Like.findOne({
            $set:{
                tweet:tweetId,
                likedBy:req.user._id
            }
        })
        if(LikeExists)
        {
            const removeLike=await Like.findByIdAndDelete(LikeExists._id)
            if(!removeLike)
                {
                    throw new ApiError(500,"There was a problem while removing the like")
                }
            return res.status(200).json(new ApiResponse(200,{},"Like removed successfully"))
        }
        const addLike=await Like.create({
            tweetId:tweetId,
            likedBy:req.user._id
        })
        if(!addLike)
            {
                throw new ApiError(500,"There was a problem while adding the like")
            }
            return res.status(200).json(new ApiResponse(200,{},"Like was added successfully"))

}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    const AllLike = await Like.find({
        likedBy: req.user._id,
        video: { $exists }
      });
      return res.status(200).json(new ApiResponse(200,AllLike,"Liked video were uploaded successfully"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}