const express = require('express');
const connectDb = require('./config/db');
const Usea = require('./src/modles/user');

const app = express();

// Middleware to parse JSON request body
app.use(express.json());

app.get("/signup", async (req, res) => {
  try {
    // Await the result of User.find()
    const users = await Usea.find({ email: req.body.email });

    if (users.length === 0) {
      return res.status(400).send({ message: "User not found" });
    } else {
      return res.status(200).send(users);
    }
  } catch (error) {
    console.error("Error in /signup route:", error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.delete("/delet", async (req,res) =>{
  try{

    const Duser = await Usea.findByIdAndDelete(req.body._id);
    res.send("user deleted")
  }catch(err){
    res.status(400).send("something is wrong")
;
  }
});

app.post("/post", async (req, res) => {
  try {
    // Create a new user instance with the request body
    const user = new Usea(req.body);
    // Save the user to the database
    await user.save();
    res.status(201).send(user); // Send the created user as a response
  } catch (error) {
    console.error("Error in /post route:", error.message);
    res.status(400).send({ message: "Bad Request" });
  }
});

app.patch("/update", async (req, res) => {  //put and patch are same but put is used to update the whole data and patch is used to update the specific data
               //put will behave like patch untill we not {ovewrite:true}
  try {
    // Find the user by ID and update it with the request body
    const updatedUser = await Usea.findByIdAndUpdate(req.body._id, req.body, { new: true });  
    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(updatedUser); // Send the updated user as a response
  }
  catch (error) {
    console.error("Error in /update route:", error.message);
    res.status(400).send({ message: "Bad Request" });
  }
}); 

// Connect to the database
connectDb()
  .then(() => {
    console.log('Database connection successful');
    // Start the server after the database connection is established
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1); // Exit the process if the database connection fails
  });