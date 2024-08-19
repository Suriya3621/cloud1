const mongoose = require('mongoose');

exports.connectDB = ()=>{
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((con) => console.log(`Connected to MongoDB on ${con.connection.host}`))
  .catch(err => console.error('Could not connect to MongoDB:', err.message));
}