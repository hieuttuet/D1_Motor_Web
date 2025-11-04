import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();
console.log('PORT in process.env =', process.env.PORT);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
