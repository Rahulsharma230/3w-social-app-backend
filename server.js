const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

dotenv.config();

const app = express();

//  MIDDLEWARE 

// Enable CORS from frontend
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());


//  ROUTES 

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);


//  MONGODB CONNECTION 

mongoose
    .connect(process.env.DB)
    .then(() => {
        console.log("MongoDB connection is successful");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });


//  SERVER 

app.listen(process.env.PORT, () => {
    console.log(`App is running on port ${process.env.PORT}`);
});