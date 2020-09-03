import path from "path";
import { mergeTypeDefs, mergeResolvers, mergeSchemas } from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";

// Typedefs
const typesArray = loadFilesSync(path.join(__dirname, "./typeDefs"));
export const typeDefs = mergeTypeDefs(typesArray, { all: true });
// Resolvers
const resolversArray = loadFilesSync(path.join(__dirname, './resolvers'));
export const resolvers = mergeResolvers(resolversArray);
