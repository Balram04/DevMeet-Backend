const express = require("express");
const { authMiddleware } = require('../middlewares/auth');
const User = require('../models/user');

const feedRouter = express.Router();

// Get all users for feed (excluding current user)
feedRouter.get("/feed", authMiddleware, async (req, res) => {
  try {
    const loggedInUser = req.user;
    
    // Get all users except the current logged-in user
    const users = await User.find({ 
      _id: { $ne: loggedInUser._id } 
    }).select("-password -confirmpassword"); // Exclude password fields for security
    
    res.status(200).send({
      message: "Feed data retrieved successfully",
      users: users,
      totalUsers: users.length
    });
  } catch (error) {
    console.error("Error in /feed route:", error.message);
    res.status(500).send({ message: "Internal server error while fetching feed" });
  }
});

// Get users with pagination for better performance
feedRouter.get("/feed/paginated", authMiddleware, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Get users with pagination
    const users = await User.find({ 
      _id: { $ne: loggedInUser._id } 
    })
    .select("-password -confirmpassword")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 }); // Sort by newest first
    
    // Get total count for pagination info
    const totalUsers = await User.countDocuments({ 
      _id: { $ne: loggedInUser._id } 
    });
    
    res.status(200).send({
      message: "Paginated feed data retrieved successfully",
      users: users,
      pagination: {
        currentPage: page,
        totalUsers: totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        usersPerPage: limit,
        hasNext: page < Math.ceil(totalUsers / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error("Error in /feed/paginated route:", error.message);
    res.status(500).send({ message: "Internal server error while fetching paginated feed" });
  }
});

// Get users by skills filter
feedRouter.get("/feed/filter", authMiddleware, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { skills, location } = req.query;
    
    let filter = { _id: { $ne: loggedInUser._id } };
    
    // Add skills filter if provided
    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      filter.skills = { $in: skillsArray };
    }
    
    // Add location filter if provided
    if (location) {
      filter.address = { $regex: location, $options: 'i' }; // Case-insensitive search
    }
    
    const users = await User.find(filter)
      .select("-password -confirmpassword")
      .sort({ createdAt: -1 });
    
    res.status(200).send({
      message: "Filtered feed data retrieved successfully",
      users: users,
      totalUsers: users.length,
      filters: { skills, location }
    });
  } catch (error) {
    console.error("Error in /feed/filter route:", error.message);
    res.status(500).send({ message: "Internal server error while filtering feed" });
  }
});

// Get random users for discovery
feedRouter.get("/feed/discover", authMiddleware, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const limit = parseInt(req.query.limit) || 5;
    
    // Get random users using MongoDB aggregation
    const users = await User.aggregate([
      { $match: { _id: { $ne: loggedInUser._id } } },
      { $sample: { size: limit } },
      { $project: { password: 0, confirmpassword: 0 } } // Exclude password fields
    ]);
    
    res.status(200).send({
      message: "Random users for discovery retrieved successfully",
      users: users,
      totalUsers: users.length
    });
  } catch (error) {
    console.error("Error in /feed/discover route:", error.message);
    res.status(500).send({ message: "Internal server error while getting discovery feed" });
  }
});

// Get user by ID for detailed profile view
feedRouter.get("/feed/user/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const loggedInUser = req.user;
    
    // Prevent users from viewing their own profile through this endpoint
    if (userId === loggedInUser._id.toString()) {
      return res.status(400).send({ message: "Use profile route to view your own profile" });
    }
    
    const user = await User.findById(userId).select("-password -confirmpassword");
    
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    
    res.status(200).send({
      message: "User profile retrieved successfully",
      user: user
    });
  } catch (error) {
    console.error("Error in /feed/user/:userId route:", error.message);
    res.status(500).send({ message: "Internal server error while fetching user profile" });
  }
});

// Search users by name or email
feedRouter.get("/feed/search", authMiddleware, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { query } = req.query;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).send({ message: "Search query is required" });
    }
    
    const searchRegex = new RegExp(query, 'i'); // Case-insensitive search
    
    const users = await User.find({
      _id: { $ne: loggedInUser._id },
      $or: [
        { firstname: searchRegex },
        { lastname: searchRegex },
        { email: searchRegex }
      ]
    }).select("-password -confirmpassword");
    
    res.status(200).send({
      message: "Search results retrieved successfully",
      users: users,
      totalUsers: users.length,
      searchQuery: query
    });
  } catch (error) {
    console.error("Error in /feed/search route:", error.message);
    res.status(500).send({ message: "Internal server error while searching users" });
  }
});

module.exports = feedRouter;
