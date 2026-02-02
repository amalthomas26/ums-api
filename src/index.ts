import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";

import { typeDefs } from "./graphql/typeDefs";
import { resolvers } from "./graphql/resolvers";

import { verifyToken } from "./utils/jwt";
import { UserModel } from "./models/User";
import { Context } from "./types/context";
import { ENV } from "./config/env";

dotenv.config();

async function startServer() {
  await connectDB();

  const app: Application = express();

  app.use(cors());
  app.use(express.json());

  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }): Promise<Context> => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return { user: null };
        }

        const token = authHeader.split(" ")[1];

        try {
          
          const decoded = verifyToken(token);

          
          const user = await UserModel.findById(decoded.id);

          return { user };
        } catch (error) {
          console.error("Authentication failed:", error);
          return { user: null };
        }
      },
    })
  );

  app.listen(ENV.PORT, () => {
    console.log(
      ` UMS GraphQL running at http://localhost:${ENV.PORT}/graphql`
    );
  });
}

startServer();
