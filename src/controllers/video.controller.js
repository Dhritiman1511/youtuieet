import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query    
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    if([title ,description].some(field=>field.trim()===""))
        {
            throw new ApiError(400,"Title and Descreption is required")
        }
        const videoLocalPath=req.files?.videoFile[0]?.path
        const thumbnailLocalPath=req.files?.thumbnail[0]?.path
        if(!(videoLocalPath && thumbnailLocalPath ))
        {   
            throw new ApiError(400,"Video and thumbnail is required")
        }
        const video=await uploadOnCloudinary(videoLocalPath)
        const thumbnail=await uploadOnCloudinary(thumbnailLocalPath)
        if(!(video&& thumbnail))
            {   
                throw new ApiError(500,"There was a problem while uploading Video and thumbnail to cloud")
            }

            const uploadedVideo=await Video.create({
                videoFile:video.url,
                thumbnail:thumbnail.url,
                title,
                description,
                duration:video.duration,
                owner: ref.user._id
            })
            if(!uploadedVideo)
                {
                    throw new ApiError(500,"There was a problem while uploading video")
                }
        return res.status(200).json(new ApiResponse(200,uploadedVideo,"Video was uploaded successfully"))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!videoId)
        {
            throw new ApiError(400,"Video Id is required")
        }
    const video=await Video.findById(videoId)
    if(!video)
        {
            throw new ApiError(400,"No video exists with the id")
        }
        return res.status(200).json(new ApiResponse(200,video,"Video returned successfully"))

})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const {title,description}=req.body
    if(!videoId)
        {
            throw new ApiError(400,"Video Id is required")
        }
    if([title,description].some(fields=>fields.trim()===""))
        {
            throw new ApiError(400,"Title and Descreption is required")
        }

        const thumbnailLocalPath=req.file?.path
        if(!thumbnailLocalPath)
            {
                throw new ApiError(400,"Thumbnail is required")
            }
        const thumbnail=await uploadOnCloudinary(thumbnailLocalPath)

        if(!thumbnail)
            {
                throw new ApiError(500,"There was Problem while uploading Thumbnail on cloud")
            }

        const updatedVideo=await Video.findByIdAndUpdate(videoId,{
            $set:{
                 title,description,thumbnail:thumbnail.url
            }
        },
        {
            new:true
        }
    )
    if(!updatedVideo)
        {
            throw new ApiError(500,"Video was not Updated Due to some error")
        }
        
        return res.status(200).json(new ApiResponse(200,updatedVideo,"Video was updated successfully"))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!videoId)
        {
            throw new ApiError(400,"Video id is required")
        }
    const deletedVideo=await Video.findByIdAndDelete(videoId)
    if(!deleteVideo)
        {
            throw new ApiError(500,"There was a problem while deleting the video")
        }

        return res.status(200).json(new ApiResponse(200,{},"Video was deleted Successfully"))

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!videoId)
        {
            throw new ApiError(400,"Video id is required")
        }

        const video=await Video.findByIdAndUpdate(videoId,{$set:{isPublished:!isPublished}},{new:true})
        if(!video)
            {
                throw new ApiError(400,"Video was not updated")
            }
            return res.status(200).json(new ApiResponse(400,video,"Video was updated"))
})


export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}