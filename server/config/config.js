var path = require('path'),
    rootPath = path.normalize(__dirname + '/../../'),
    env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  development: {
    db: 'mongodb://localhost/apiintegrationpack-development',
    rootPath: rootPath,
    port: process.env.PORT || 9000,
    secret: 'd86c194c-4c37-4602-8849-288ff6fdfd88 7219e198-b054-42d5-9bea-512cafbae409 41e0096f-c944-4d27-8938-6bcda526d4f4 ea65ef97-7adb-42d7-b627-9b185e88abc0 37bab3f8-536e-48c1-a021-7fb0a657b613',
    expiresInMinutes: 60*2,

    sageone_apiPath: 'https://accounting.sageone.co.za/api/1.1.0/${model}/${method}?companyid=${companyid}&apikey=${apikey}${filter}',
    sageone_apiKey: '{}',
    sageone_companyId: 1234567890,
    sageone_authorization: 'Basic .....'
  },
  production: {  
  }
}[env];


