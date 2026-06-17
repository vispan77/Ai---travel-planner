import axios from "axios"
import dotenv from "dotenv"
dotenv.config();


const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions";
const model = "openai/gpt-oss-120b:free";

const generateAiResponse = async (prompt) => {
    try {
        console.log(process.env.OPENROUTER_API_KEY)
        const response = await axios.post(
            openRouterUrl,
            {
                model: model,
                messages: [
                    {
                        role: "system",
                        content: "Please give response in json format only"
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        )

        const content = response.data.choices[0].message.content;
        console.log(content);

        return content;
    } catch (error) {
        console.log("something went wrong in getting response form the AI", error);
        throw new Error("something went wrong in getting response form the AI");
    }

}

export default generateAiResponse;