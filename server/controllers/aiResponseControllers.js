import fs from "fs"
import uploadFile from "../services/imageKit.js";
import generateAiResponse from "../services/openRouter.js";
import PDFParser from "pdf2json"
import masterPrompt from "../utils/masterprompt.js";
import Itinerary from "../model/itinerary.js";






const analysePdf = async (req, res) => {
    try {
        console.log(req.file)
        let filePath = req.file.path;
        const fileName = req.file.filename;
        console.log("filePath", filePath);
        console.log("fileName", fileName);

        const fileBuffer = await fs.promises.readFile(filePath);
        console.log("fileBuffer", fileBuffer)

        const response = await uploadFile(fileBuffer, fileName);
        console.log("response", response);

        await fs.promises.unlink(filePath);

        return res.status(201).json({
            success: true,
            message: "File uploaded successfully",
            data: response
        })



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while analyzing PDF"
        })
    }
}



const aiResponse = async (req, res) => {
    let filePath;

    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        filePath = req.file.path;

        const fileBuffer = await fs.promises.readFile(filePath);

        const pdfParser = new PDFParser(null, 1);

        const pdfData = await new Promise((resolve, reject) => {
            pdfParser.on("pdfParser_dataError", (errData) => {
                reject(errData.parserError);
            });

            pdfParser.on("pdfParser_dataReady", (pdfData) => {
                resolve(pdfData);
            });

            pdfParser.parseBuffer(fileBuffer);
        });

        console.log("PDF Parsed Successfully");

        const extractedText = pdfParser.getRawTextContent();

        if (!extractedText || extractedText.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "No readable text found in PDF"
            });
        }

        console.log("Extracted Text Length:", extractedText.length);

        const prompt = masterPrompt(extractedText)


        // Generate AI response
        const aiResult = await generateAiResponse(prompt);

        console.log("AI Response Received");

        let parsedResponse;

        try {
            parsedResponse = JSON.parse(aiResult);
        } catch (parseError) {
            console.log("Invalid JSON Returned By AI");
            console.log(aiResult);

            return res.status(500).json({
                success: false,
                message: "AI returned invalid JSON",
                rawResponse: aiResult
            });
        }

        const itinerary = await Itinerary.create({
            user: req.user._id,
            tripSummary: parsedResponse.tripSummary,
            passengers: parsedResponse.passengers,
            flights: parsedResponse.flights,
            trains: parsedResponse.trains,
            hotels: parsedResponse.hotels,
            transportation: parsedResponse.transportation,
            events: parsedResponse.events,
            payments: parsedResponse.payments,
            dailyItinerary: parsedResponse.dailyItinerary,
            rawExtractedDetails: parsedResponse.rawExtractedDetails,
        });

        console.log("Itinerary Updated Successfully")

        return res.status(200).json({
            success: true,
            message: "Travel itinerary generated successfully",
            data: itinerary
        });

    } catch (error) {
        console.error("AI Controller Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong"
        });
    } finally {
        // Delete uploaded file
        if (filePath) {
            try {
                await fs.promises.unlink(filePath);
            } catch (err) {
                console.log("File cleanup failed:", err.message);
            }
        }
    }
};

const getAllItenery = async (req, res) => {
    try {
        const user = req.user
        const itineraries = await Itinerary.find({ user: user._id })
        return res.status(200).json({
            success: true,
            message: "Itineraries fetched successfully",
            ItineryLength: itineraries.length,
            data: itineraries
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while getting itineraries"
        })
    }
}

const getItineraryById = async (req, res) => {
    try {
        const { itineryId } = req.params;
        const itinerary = await Itinerary.findById(itineryId);
        if (!itinerary) {
            return res.status(404).json({
                success: false,
                message: "Itinerary not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Itinerary fetched successfully",
            data: itinerary
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while getting itinerary"
        })
    }
}



const deleteItinery = async (req, res) => {
    try {
        const { itineryId } = req.params;
        const itinerary = await Itinerary.findByIdAndDelete(itineryId);
        if (!itinerary) {
            return res.status(404).json({
                success: false,
                message: "Itinerary not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Itinerary deleted successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting itinerary"
        })
    }
}

export {
    analysePdf, aiResponse, deleteItinery, getItineraryById, getAllItenery
}