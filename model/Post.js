const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        content: {
            type: String,
            required: true,
            trim: true,
        },

        image: {
            type: String,
            default: null,
        },

        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },

                text: {
                    type: String,
                    trim: true
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;