import express from "express";
import { ApolloServer } from "apollo-server-express";
import intrinioSDK from "intrinio-sdk";
import { typeDefs, resolvers } from "./src/graphql/index";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

/* Instantiate intrinio api */
intrinioSDK.ApiClient.instance.authentications["ApiKeyAuth"].apiKey = process.env.INTRINIO_API_KEY
const company = new intrinioSDK.CompanyApi();
const fundamentals = new intrinioSDK.FundamentalsApi();

/* Instantiate express app */
const app = express();

/* Instantiate + configure ApolloServer */
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    company,
    fundamentals
  }
});

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
