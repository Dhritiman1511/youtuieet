import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!channelId)
        {
            throw new ApiError(400,"Channel id is required")
        }
        const subscriber=await Subscription.find({
            subscriber:req.user?._id,
            channel:channelId
        })
        if(!subscriber)
        {
            const newSubscriber=await Subscription.create({
                subscriber:req.user?._id,
                channel:channelId
            })
            if(!newSubscriber)
                {
                    throw new ApiError(400,"There was a problem while adding the subscription")
                }
            return res.status(200).json(new ApiResponse(200,newSubscriber,"Subscription is added to the channel"))
        }
        const deleteSubscriber=await Subscription.findByIdAndDelete(subscriber?._id)
        if(!deleteSubscriber)
            {
                throw new ApiError(400,"There was a problem while removing the subscription")
            }
            return res.status(200).json(new ApiError(200,deleteSubscriber,"Subscription was removed"))
        
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const subscriberList=await User.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(req.user?._Id)
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subscriberList",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"subscriber",
                            foreignField:"_id",
                            as:"subscriber",
                            pipeline:[
                                {
                                    $project:{
                                        fullname:1,
                                        username:1,
                                        email:1,
                                        avatar:1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            subscriber:{
                                $first:"subscriber"
                            }
                        }
                    },
                    {
                        $lookup:{
                            from:"users",
                            localField:"channel",
                            foreignField:"_id",
                            as:"channel",
                            pipeline:[
                                {
                                    $project:{
                                        fullname:1,
                                        username:1,
                                        email:1,
                                        avatar:1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            channel:{
                                $first:"channel"
                            }
                        }
                    },
                ]
            }
        },
        {
            $project:{
                subscriberList:1
            }
        }
    ])
    return res.status(200).json(new ApiResponse(200,subscriberList[0].subscriberList))
   })

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    const ChannelList=await User.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"ChannelList",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"subscriber",
                            foreignField:"_id",
                            as:"subscriber",
                            pipeline:[
                                {
                                    $project:{
                                        fullname:1,
                                        username:1,
                                        email:1,
                                        avatar:1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            subscriber:{
                                $first:"subscriber"
                            }
                        }
                    },
                    {
                        $lookup:{
                            from:"users",
                            localField:"channel",
                            foreignField:"_id",
                            as:"channel",
                            pipeline:[
                                {
                                    $project:{
                                        fullname:1,
                                        username:1,
                                        email:1,
                                        avatar:1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            channel:{
                                $first:"channel"
                            }
                        }
                    },
                ]
            }
        }
    ])
    return res.status(200).json(new ApiResponse(200,ChannelList[0].ChannelList,"Subscribed Channel list returned successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}