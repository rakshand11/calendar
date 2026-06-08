import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function ArticlePage({
    params,
}: {
    params: { id: string };
}) {
    const client = await clientPromise;
    const db = client.db();

    const article = await db.collection("articles").findOne({
        _id: new ObjectId(params.id),
    });

    if (!article) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500">Article not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

                <h1 className="text-3xl font-bold text-gray-900 mb-2">{article.topic}</h1>

                <div className="mb-6">
                    {article.status === "done" && (
                        <span className="text-xs font-medium bg-green-100 text-green-700 px-3 py-1 rounded-full">
                            Generated
                        </span>
                    )}
                    {article.status === "pending" && (
                        <span className="text-xs font-medium bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                            Scheduled — waiting to generate
                        </span>
                    )}
                    {article.status === "processing" && (
                        <span className="text-xs font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                            Generating...
                        </span>
                    )}
                    {article.status === "failed" && (
                        <span className="text-xs font-medium bg-red-100 text-red-700 px-3 py-1 rounded-full">
                            Generation failed
                        </span>
                    )}
                </div>


                <p className="text-sm text-gray-400 mb-8">
                    Scheduled for:{" "}
                    {new Date(article.scheduledAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                    })}
                </p>

                {article.status === "done" && article.content ? (
                    <div className="prose prose-gray max-w-none whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {article.content}
                    </div>
                ) : (
                    <div className="text-center py-16 text-gray-400">
                        <p className="text-lg">Article not generated yet</p>
                        <p className="text-sm mt-1">Check back after the scheduled time</p>
                    </div>
                )}

            </div>
        </div>
    );
}