import {User} from '../models/user.model.js';
import {Task} from '../models/task.model.js';
import {asyncHandler} from '../utils/AsyncHandler.js'
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';

const options = {
    httpOnly: true,
    secure:true
}

const registerUser = asyncHandler(async(req, res) => {
    const {name, email, password} = req.body;

    if(
        [name, email, password].some((field) => field?.trim === "")
    ){
        throw new ApiError(400, "All fields are required")
    }

    const existeduser = await User.findOne({email: email});
    if(existeduser) {
        throw new ApiError(400, "User with this email already exists");
    }

    const user = await User.create({
        name,
        email, 
        password
    });

    
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    
    if(!createdUser){
        throw new ApiError(500, "Something went wrong");
    }
    
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            user
        ),
        "User Registered Successfully"
    );

});


const generateAccessAndRefreshToken = async(userId) => {

    try{
        const user = await User.findById(userId)
        const accessToken =  user.generateAccessToken()
        const refreshToken =  user.generateRefreshToken()

        user.refreshToken = refreshToken
        user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}

    }catch(error){
        throw new ApiError(500, "Somethong went wrong while generating refresh and access token")
    }
}

const loginUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        throw new ApiError(400, "Both fields are required");
    }

    const user = await User.findOne({email});

    if(!user){
        throw new ApiError(404, "User does not exists");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid) {
        throw new ApiError(401, "Invalid User credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            user
        ),
        "User Logged in Successfully"
    )
})

const logoutUser = asyncHandler(async(req, res) =>{

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(
            200,
            {},
            "User Logged out Successfully"
        )
    )

})

const refreshAccessToken = asyncHandler(async(req, res) => {
    try {
        const {refreshToken} = req.cookies;
        if(!refreshToken) {
            throw new ApiError(401, "Unauthorized, Please login again");
        }
    
        const decodedToken = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        let user = await User.findById(decodedToken._id)
    
        if(!user || user.refreshToken !== refreshToken) {
            throw new ApiError(401, "Unauthorized, Please login again");
        }
    
        const {accessToken, newRefreshToken} = generateAccessAndRefreshToken(user._id);
    
        user = await User.findByIdAndUpdate(
            user._id,
            {
                $set: {
                    refreshToken: newRefreshToken
                }
            },
            {
                new: true
            }
        );
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                user,
                "Access Token refreshed successfully"
            )
        )
    } catch (error) {
        throw new ApiError(500, error?.message || "Invalid refresh token, please login again");
    }
});

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            req.user,
            "Current user fetched Successfully"
        )
    )
});

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {name, email} = req.body
    if(!name || !email){
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id, 
        {
            $set:{
                name: name,
                email:email
            }
        },
        {new: true}
    ).select(" -password ")

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "Account details updated successfully"
        )
    )
})

const tasksAssigned = asyncHandler(async(req, res) => {
    try {
    const { page = 1, limit = 10, status, priority, dueDate, search, role = 'assignee' } = req.query;
    const userId = req.user._id; 

    const matchStage = {};

    if (role === 'assignee') {
        matchStage.assignedTo = userId;
    } else if (role === 'creator') {
        matchStage.createdBy = userId;
    } else if (role === 'both') {
        matchStage.$or = [
            { assignedTo: userId },
            { createdBy: userId }
        ];
    }

    if (status) matchStage.status = status;
    if (priority) matchStage.priority = priority;
    if (dueDate === 'upcoming') {
        const now = new Date();
        const threeDaysLater = new Date(now);
        threeDaysLater.setDate(now.getDate() + 3);
        matchStage.dueDate = { $lte: threeDaysLater };
    }
    if (search) {
        matchStage.$or = [
            ...(matchStage.$or || []), 
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    const aggregate = Task.aggregate([
        { $match: matchStage },
        {
            $lookup: {
            from: 'users',
            localField: 'assignedTo',
            foreignField: '_id',
            as: 'assigneeDetails',
            },
        },
        {
            $unwind: {
            path: '$assigneeDetails',
            preserveNullAndEmptyArrays: true,
            },
        },
        {
            $lookup: {
            from: 'users',
            localField: 'createdBy',
            foreignField: '_id',
            as: 'creatorDetails',
            },
        },
        {
            $unwind: {
            path: '$creatorDetails',
            preserveNullAndEmptyArrays: true,
            },
        },
        { $sort: { dueDate: 1 } }
    ]);

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
    };

    const tasks = await Task.aggregatePaginate(aggregate, options);

    res.status(200).json(tasks);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});


const getAllUsers = asyncHandler(async(req, res) => {
    const users = await User.find({}).select("-password -refreshToken");
    if(!users || users.length === 0) {
        throw new ApiError(404, "No users found");
    }
    return res
    .status(200)    
    .json(
        new ApiResponse(
            200,
            users,
            "All users fetched successfully"
        )
    )
});

export{
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    updateAccountDetails,
    tasksAssigned, 
    getAllUsers
}