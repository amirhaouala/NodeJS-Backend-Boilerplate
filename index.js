import express from 'express';
import { ParseServer } from 'parse-server';
/* GraphQL */

import fs from 'fs';
import gql from 'graphql-tag';
import { ParseGraphQLServer } from 'parse-server';

const app = express();

const mountPath = process.env.PARSE_MOUNT || '/rest';

const parseServer = new ParseServer({
  databaseURI: process.env.DB_URL || 'postgres://postgres:Passw0rd@127.0.0.1:5432/postgres',
  appId: process.env.APP_ID || 'appidappidappid',
  masterKey: process.env.MASTER_KEY || 'masterkeymasterkeymasterkey',
  fileKey: process.env.FILE_KEY || 'filekeyfilekeyfilekey',
  serverURL: `http://localhost:1337${mountPath}`,
});
await parseServer.start();

// Mounts the REST API
app.use(mountPath, parseServer.app);

import('./controllers/user.js');
import('./controllers/test.js');

app.listen(1337, function () {
  console.log(`API running on http://localhost:1337${mountPath}`);
});

/* GraphQL */

const customSchema = fs.readFileSync('./schema/mutations.graphql');
const parseGraphQLServer = new ParseGraphQLServer(parseServer, {
  graphQLPath: '/graphql',
  playgroundPath: '/playground',
  graphQLCustomTypeDefs: gql`
    ${customSchema}
  `,
});
// Mounts the GraphQL API
parseGraphQLServer.applyGraphQL(app);
if (process.env.DEV !== false) {
  // Mounts the GraphQL Playground
  parseGraphQLServer.applyPlayground(app);
}
