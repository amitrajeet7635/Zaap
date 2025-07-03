require('dotenv').config();
const { Client, Databases, Query } = require('node-appwrite');

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1') 
  .setProject('68658d86003da49ce8ee')
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

module.exports = { databases, client, Query };