const Post = require("../model/Post");

/**
 * CREATE POST CONTROLLER
 * Allows authenticated users to create a new post
 * - Requires either content or image (or both)
 * - Saves post with user reference
 * - Returns created post with user details
 */
const createPost = async (req, res) => {
    try {
        const { content, image } = req.body;

        // Validate: content is required
        if (!content) {
            return res.status(400).json({
                message: "Content is required",
            });
        }

        // Create post in database
        const post = await Post.create({
            user: req.user._id,  // User from auth middleware
            content,
            image: image || null,  // Image is optional
        });

        // Populate user details before returning
        await post.populate("user", "username email");

        return res.status(201).json({
            message: "Post created successfully",
            post,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

/**
 * GET ALL POSTS CONTROLLER
 * Fetches all posts from database with populated user and comment/like data
 * - Includes user info (name, email)
 * - Includes who liked the post
 * - Includes all comments with user info
 * - Returns posts sorted by newest first
 */
//  GET ALL POSTS 

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("user", "username email")
            .populate("likes", "username")
            .populate("comments.user", "username")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Posts fetched successfully",
            posts,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


//  LIKE POST

const likePost = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        // Check if user already liked
        if (post.likes.includes(req.user._id)) {
            return res.status(400).json({
                message: "You have already liked this post",
            });
        }

        // Add like
        post.likes.push(req.user._id);
        await post.save();

        await post.populate("user", "username email");
        await post.populate("likes", "username");
        await post.populate("comments.user", "username");

        return res.status(200).json({
            message: "Post liked successfully",
            post,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


//  UNLIKE POST

const unlikePost = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        // Check if user liked
        if (!post.likes.includes(req.user._id)) {
            return res.status(400).json({
                message: "You have not liked this post",
            });
        }

        // Remove like
        post.likes = post.likes.filter(
            (userId) => userId.toString() !== req.user._id.toString()
        );
        await post.save();

        await post.populate("user", "username email");
        await post.populate("likes", "username");
        await post.populate("comments.user", "username");

        return res.status(200).json({
            message: "Post unliked successfully",
            post,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


//  ADD COMMENT

const addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                message: "Comment text is required",
            });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        // Add comment
        post.comments.push({
            user: req.user._id,
            text,
        });

        await post.save();

        await post.populate("user", "username email");
        await post.populate("likes", "username");
        await post.populate("comments.user", "username");

        return res.status(201).json({
            message: "Comment added successfully",
            post,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


//  DELETE COMMENT

const deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        // Find comment
        const comment = post.comments.id(commentId);

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found",
            });
        }

        // Check if user is comment owner
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to delete this comment",
            });
        }

        // Remove comment
        post.comments = post.comments.filter(
            (c) => c._id.toString() !== commentId
        );

        await post.save();

        await post.populate("user", "username email");
        await post.populate("likes", "username");
        await post.populate("comments.user", "username");

        return res.status(200).json({
            message: "Comment deleted successfully",
            post,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


module.exports = {
    createPost,
    getAllPosts,
    likePost,
    unlikePost,
    addComment,
    deleteComment,
};