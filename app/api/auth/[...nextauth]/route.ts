import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "OTP",
            credentials: {
                email: { label: "Email", type: "email" },
                otp: { label: "OTP", type: "text" },
            },
            async authorize(credentials) {
                const client = await clientPromise;
                const db = client.db();

                const record = await db.collection("otps").findOne({
                    email: credentials?.email,
                    otp: credentials?.otp,
                });

                if (!record) return null;
                await db.collection("otps").deleteOne({ _id: record._id });
                return { id: credentials!.email, email: credentials!.email };
            },
        }),
    ],
    pages: {
        signIn: "/auth/signin",
    },
    session: {
        strategy: "jwt",
    },
});

export { handler as GET, handler as POST };