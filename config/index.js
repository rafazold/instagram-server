const config = {
    mongoUri : process.env.MONGODB_URI || 'mongodb://heroku_z5wx928q:qhmr0u73dlq875hrci3vintl2h@ds349618.mlab.com:49618/heroku_z5wx928q',
    port: process.env.PORT || 4000,
    jwtSecret: process.env.JWT_SECRET || 'hyJhsdl76sflJujsl',
    keyFilename: './config/storage.json',
    projectId: 'long-nation-262714',
    bucket: 'insta-images'
};

module.exports = config;