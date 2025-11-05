import dotenv from 'dotenv'
dotenv.config();
import express from "express";
// import session from 'express-session';
import mongoose from "mongoose";
import cors from "cors";




import userRoute from "./routes/user.route.js"
import postRoute from "./routes/post.route.js"


const app = express();


const port = process.env.PORT || 8000;

//static file 
app.use('/static', express.static('uploads'))

// app.use(cors({
//     origin:"http://localhost:5173",credentials:true,
// }))

app.use(cors({ origin: "*", credentials: true }));

//to pass body data
app.use(express.json())

app.get("/",(req,res)=>{
    res.send("Server is running")
})

mongoose
.connect(process.env.MONGO_DB_URL)
  .then(() => console.log("DB Connected!"))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log("Server is running on http://localhost:" + port);
});

app.use(process.env.API_PREFIX,userRoute)
app.use(process.env.API_PREFIX,postRoute)
