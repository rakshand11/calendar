import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY!,
});

export async function generateArticle(topic: string): Promise<string> {
    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "user",
                content: `Write a well-structured article about: ${topic}. Include an introduction, 3-4 main sections with headings, and a conclusion. Make it informative and engaging.`,
            },
        ],
    });

    return response.choices[0]?.message?.content || "";
}