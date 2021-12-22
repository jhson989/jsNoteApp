const mongoose = require('mongoose');

db = module.exports = {};

db.connect = (DB_HOST) => {
    //mongoose.set('useNewUrlParser', true);
    //mongoose.set('useFindAndModify', false);
    //mongoose.set('useCreateIndex', true);
    //mongoose.set('useUnifiedTopology', true);
    
    mongoose.connect(DB_HOST);

    mongoose.connection.on('error', err => {
        console.error(err);
        console.log('MongoDB connection error. Please make sure MongoDB is running.')
        process.exit();
    });

};

db.close = () => {
    mongoose.connection.close();
};