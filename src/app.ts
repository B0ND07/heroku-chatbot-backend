import express from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import morgan from "morgan";
import router from "./routes/index.js";
import cors from "cors"
config();

const app = express();


app.use(cors({origin:"https://botopenai.netlify.app",credentials:true}))
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(morgan("dev"));

app.use("/api/v1", router);

export default app;
