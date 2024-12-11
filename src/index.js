import connectDB from "./db/index.js";
import dotenv from "dotenv";
import {app} from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log(`Server running at port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB db connection failed", error);
  });
