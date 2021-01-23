const config = {
    mongoUri : process.env.MONGODB_URI || 'mongodb+srv://rafainsta:InstaColne2021@instaclone.t7lzv.mongodb.net/instaclone',
    port: process.env.PORT || 4000,
    jwtSecret: process.env.JWT_SECRET || 'hyJhsdl76sflJujsl'
};

module.exports = config;