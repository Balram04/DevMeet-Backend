const mongoose = require('mongoose');

const connectDb =async (params) => 
    { await mongoose.connect
        ('mongodb+srv://balramprajapati3263:GSfhxWLajAUiT4Q0@nodeg.x9gffle.mongodb.net/')
};

module.exports = connectDb;