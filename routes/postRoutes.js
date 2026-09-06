const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
    createPost,
    getAllPosts,
    likePost,
    unlikePost,
    addComment,
    deleteComment,
} = require("../controllers/postController");

const router = express.Router();

// Create post (protected)
router.post("/", authMiddleware, createPost);

// Get all posts
router.get("/", getAllPosts);

// Like post (protected)
router.post("/:postId/like", authMiddleware, likePost);

// Unlike post (protected)
router.post("/:postId/unlike", authMiddleware, unlikePost);

// Add comment (protected)
router.post("/:postId/comment", authMiddleware, addComment);

// Delete comment (protected)
router.delete("/:postId/comment/:commentId", authMiddleware, deleteComment);

module.exports = router;
