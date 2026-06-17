import { ImageKit } from "@imagekit/nodejs/client.js";
import dotenv from "dotenv"
dotenv.config();

const imagekitClient = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})

const uploadFile = async (fileBuffer, fileName) => {
    const response = await imagekitClient.files.upload({
        file: fileBuffer.toString("base64"),
        fileName: fileName,
        folder: "travel-planner"
    })

    return response;
}

export default uploadFile;