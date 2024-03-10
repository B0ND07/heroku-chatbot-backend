import app from "./app.js";
import { connectDatabase } from "./config/database.js";

const PORT = process.env.PORT || 5000;
connectDatabase()
  .then(() => {
    app.listen(PORT, () => console.log("server running on 5000"));
  })
  .catch((err) => console.log(err));
