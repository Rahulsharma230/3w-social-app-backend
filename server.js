const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

dotenv.config();

const app = express();

// =======================
// CORS CONFIGURATION
// =======================

const allowedOrigins = [
    "http://localhost:3000",
    "https://3w-social-app-frontend-git-main-rahulsharma230-5508.vercel.app",
    "https://3w-social-app-frontend.vercel.app"
];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests like Postman/server-to-server
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },

        credentials: true,

        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ],

        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]
    })
);

// =======================
// BODY PARSER
// =======================

app.use(express.json());

app.use(express.urlencoded({
    extended: false
}));

app.use(cookieParser());

// =======================
// ROUTES
// =======================

app.use("/api/auth", authRoutes);

app.use("/api/posts", postRoutes);

// =======================
// MONGODB CONNECTION
// =======================

mongoose
    .connect(process.env.DB)
    .then(() => {
        console.log("MongoDB connection is successful");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });

// =======================
// SERVER
// =======================

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});