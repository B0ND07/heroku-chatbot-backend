import { connect, disconnect } from "mongoose";

const connectDatabase = async () => {
  try {
    await connect(process.env.MONGODB_URL);
    console.log("db connected");
  } catch (error) {
    console.log(error);

    throw new Error("cannot connect to DB");
  }
};

const disconnectDatabase = async () => {
  try {
    await disconnect();
  } catch (error) {
    console.log(error);

    throw new Error("cannot disconnect from DB");
  }
};

export { connectDatabase, disconnectDatabase };
