import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 🧩 Log mỗi khi có request đến server
app.use((req, res, next) => {
  console.log("➡️ Incoming:", req.method, req.url);
  next();
});
app.use("/api", authRoutes);



app.get("/", (req, res) => res.send("Backend running 🚀"));

export default app;
