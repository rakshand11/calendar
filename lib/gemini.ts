import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMIN_API_KEY!)

export async function generateArticle(topic: string): Promise<string> {
    const model = genAI.getGenerativeModel({ model: "gemin-1.5-flash" })

    const prompt = `Write a well-structured article about : ${topic}.Include an introduction , 3-4 main sections with headings, and a conclusion.Make it informative and engaging.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
} 