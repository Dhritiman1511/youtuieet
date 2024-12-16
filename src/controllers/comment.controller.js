import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    const video=await Video.findById(videoId)
    const pageSkip = ((page-1)*limit)
    if(!video)
        {
            throw new ApiError(400,"There was no video existed with this id")
        }
        const comments=await Comment.aggregate([
            {
                $match:{
                    owner:new mongoose.Types.ObjectId(videoId)
                }
            },
            {
                $lookup:{
                    from:"users",
                    localField:"owner",
                    foreignField:"_id",
                    as:"owner",
                    pipeline:[
                        {
                            $project:{
                                username:1,
                                email:1,
                                fullName:1,
                                avatar:1,
                            }
                        },
                        {
                            $addFields:{
                                owner:{
                                    $first:"$owner"
                                }
                            }
                        }
                    ]
                }
            },
            {
                $skip:pageSkip
            },
            {
                $limit:limit
            }
        ])
        res.status(200).json(new ApiResponse(200,comments,"Comments returned successfully"))
})

const addComment = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {content}=req.body
    if(content.trim()==="")
    {
        throw new ApiError(400,"Please add something to add to comment");
    }
    const video=await Video.findById(videoId)
    if(!video)
    {
        throw new ApiError(400,"Video not found with this id");
    }
    const newComment=await Comment.create({
        content,videoId,owner:req.user?.id
    })
    if(!newComment)
        {
            throw new ApiError(400,"There was a problem while saving the comment")
        }
    res.status(200).json(new ApiResponse(200,newComment,"Comment was added successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
     const {videoId}=req.params
     const {content,commentId}=req.body
        if((content.trim()==="")&&(commentId))
        {
            throw new ApiError(400,"Please write updated comment to update it")
        }
        const video=await Video.findById(videoId)
        if(!video)
        {
            throw new ApiError(400,"Video not found with the id")
        }
         const newComment=await Comment.findByIdAndUpdate(commentId,{
            $set:{
                content
            }
         },{
            new:true
         })
         if(!newComment)
        {
            throw new ApiError(500,"There was a problem while updating the comment")
        }
        return res.status(200).json(new ApiResponse(200,newComment,"Comment was updated"))

})

const deleteComment = asyncHandler(async (req, res) => {
    const {videoId}=req.params
    const {commentId}=req.body
    if(!commentId)
    {
        throw new ApiError(400,"Comment id is needed")
    }
    const video=await Video.findById(videoId)
    if(!video)
        {
            throw new ApiError(400,"Video was not found")
        }
        const commentTobeDeleted=await Comment.findByIdAndDelete(commentId)
        if(!commentTobeDeleted)
            {
                throw new ApiError(400,"There was a problem while deleting the comment")
            }
            return res.status(200).json(new ApiResponse(200,{},"Comment was deleted"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }