import express from "express"
import machineController from "../controllers/machineController.js"

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.get('/getXML', machineController.getXML);


export default router;
