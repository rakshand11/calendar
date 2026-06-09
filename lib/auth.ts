import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const client = await clientPromise;
                const db = client.db();


                const user = await db.collection("users").findOne({
                    email: credentials?.email,
                });


                if (!user) return null;


                if (!user.verified) return null;


                const isValid = await bcrypt.compare(
                    credentials!.password,
                    user.password
                );

                if (!isValid) return null;

                return { id: user._id.toString(), email: user.email };
            },
        }),
    ],
    pages: {
        signIn: "/auth/signin",
    },
    session: {
        strategy: "jwt",
    },
};