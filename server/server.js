const express = require('express');
const path = require('path');
const db = require('./config/connection');
const {ApolloServer} = require('apollo-server-express');
const {typeDefs, resolvers} = require('./schemas');
const {authMiddleware} = require('./utils/auth');

const PORT = process.env.PORT || 3001;
const server = new ApolloServer(
  {
    typeDefs,
    resolvers,
    context:authMiddleware, 
    introspection:true
  }
);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/build')));
// }

// if the user navigates to a url that does not exist, then they will be redirected to the index page
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });

const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();

  // integrate Apollo server with the Express application as a middleware
  server.applyMiddleware({app});

  db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
  });
}

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);