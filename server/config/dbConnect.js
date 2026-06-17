import mongoose from "mongoose"

const dbConnect = async () => {
    try {
        const url = process.env.MONGODB_URL;
        await mongoose.connect(url);
        console.log("DB is connected succefully")
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export default dbConnect;