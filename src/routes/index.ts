import {Router} from "express"
import userRoute from "./userRoute.js"
import chatRoute from "./chatRoute.js"



const router=Router()

router.use("/user",userRoute)
router.use("/chats",chatRoute)


export default router