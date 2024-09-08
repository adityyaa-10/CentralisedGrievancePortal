import { Grievance } from "../models/grievance.model.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const submitGrievance = asyncHandler(async (req, res) => {
    /*
        1. User must be authenticated via verifyJWT middleware
        2. Name and email are retrieved automatically from req.user
        3. Grievance is submitted by the user
        4. Date and time are added automatically to the form submission
    */

    const { grievance } = req.body;

    if (!grievance) {
        throw new ApiError(400, "Grievance is required");
    }

    const newGrievance = {
        user: req.user._id,
        name: req.user.username,  // Automatically fetched from the logged-in user
        email: req.user.email,  // Automatically fetched from the logged-in user
        grievance,
        submittedAt: new Date(),  // Automatically adds the current date and time
    };


    const submission = await Grievance.create(newGrievance);

    return res.status(201).json(new ApiResponse(201, submission, "Form submitted successfully"));
});

const getGrievanceCounts = asyncHandler(async (req, res) => {
    /*
        1. Fetch the total number of grievances
        2. Fetch the count of pending grievances (status: false)
        3. Fetch the count of solved grievances (status: true)
    */

    const totalGrievances = await Grievance.countDocuments({});
    const pendingGrievances = await Grievance.countDocuments({ status: false });
    const solvedGrievances = await Grievance.countDocuments({ status: true });

    const grievanceCounts = {
        total: totalGrievances,
        pending: pendingGrievances,
        solved: solvedGrievances,
    };

    return res.status(200).json(new ApiResponse(200, grievanceCounts, "Grievance counts fetched successfully"));
});

const respondToGrievance = asyncHandler(async (req, res) => {
    /*
        1. Verify admin rights using verifyAdmin middleware
        2. Validate and fetch the grievance by ID
        3. Update the grievance status to 'solved' (true)
        4. Respond with a success message
    */

    const { id } = req.params;

    // Validate the grievance ID
    if (!id) {
        throw new ApiError(400, "Grievance ID is required");
    }

    // Find and update the grievance
    const updatedGrievance = await Grievance.findByIdAndUpdate(
        id,
        { status: true },  // Mark as 'solved'
        { new: true }  // Return the updated document
    );

    if (!updatedGrievance) {
        throw new ApiError(404, "Grievance not found");
    }

    return res.status(200).json(new ApiResponse(200, updatedGrievance, "Grievance responded to and marked as complete"));
});


const getAllGrievances = asyncHandler(async (req, res) => {
    /*
        1. Fetch all grievances submitted by all users
    */

    const grievances = await Grievance.find({}); // Fetch all grievances

    return res.status(200).json(new ApiResponse(200, grievances, "All grievances fetched successfully"));
});

const getPendingGrievances = asyncHandler(async (req, res) => {
    /*
        1. Fetch all grievances where the status is false (pending grievances)
    */

    const pendingGrievances = await Grievance.find({ status: false }); // Query to get pending grievances

    return res.status(200).json(new ApiResponse(200, pendingGrievances, "Pending grievances fetched successfully"));
});

const getGrievanceById = asyncHandler(async (req, res) => {
    /*
        1. User must be authenticated via verifyJWT middleware
        2. Grievance ID is passed as a route parameter
        3. The corresponding grievance details are retrieved and returned
    */

    const { id } = req.params; // Grievance ID from the request parameters

    // Find the grievance by ID
    const grievance = await Grievance.findById(id);

    if (!grievance) {
        throw new ApiError(404, "Grievance not found");
    }

    return res.status(200).json(new ApiResponse(200, grievance, "Grievance details fetched successfully"));
});



const getUserGrievances = asyncHandler(async (req, res) => {
    const userGrievances = await Grievance.find({ user: req.user._id }); // Fetch grievances for this user

    return res.status(200).json(new ApiResponse(200, userGrievances, "User grievances fetched successfully"));
});

export {
    submitGrievance,
    getGrievanceCounts,
    respondToGrievance,
    getAllGrievances,
    getUserGrievances,
    getPendingGrievances,
    getGrievanceById
}