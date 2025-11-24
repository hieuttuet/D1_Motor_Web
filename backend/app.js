import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import consumableSpecsRoutes from "./src/routes/consumableSpecs.routes.js";
import consumablePrintRoutes from "./src/routes/consumablePrint.routes.js";

dotenv.config();
BigInt.prototype.toJSON = function() { return Number(this); }; //JSON.stringify() tự động chuyển BigInt → Number.
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
app.use("/api", userRoutes);
app.use("/api", consumableSpecsRoutes);
app.use("/api", consumablePrintRoutes);  


// app.get("/", (req, res) => res.send("Backend running 🚀"));

export default app;
