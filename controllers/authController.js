const User = require("../models/UserModel.js");
const bcrypt = require("bcrypt");
const jwt =require("jsonwebtoken");



// REGISTER
const register = async(req,res)=>{
    const {username,email,password} = req.body;
    try{
      //check if user exists
     const existingUser = await User.findOne({email});
     if(existingUser){
        return res.status(404).json({message:"user already exists"})
     }
     //hash the password
     const hashedPassword = await bcrypt.hash(password, 12);
     //create a new User document in the database
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
     console.log(newUser);

     //create a JWT token for the new user
    const token = jwt.sign(
      {  username: newUser.username, email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );
    //respond with the token
    res.status(201).json({ token });
    

    }catch(error){
        res.status(500).json({ message: 'Something went wrong' });
    }
}

//LOGIN: 
const login = async (req, res) => {
    const { email, password } = req.body;
    //check if user exists
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      //check password
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Create JWT token
    const payload = {
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      },
    };
    console.log('Payload:', payload);

    const token= jwt.sign(
      payload,
      process.env.JWT_SECRET, // Ensure JWT_SECRET matches your .env file
      { expiresIn: '1h' }, // Optional: token expiration
      // (err, token) => {
      //   if (err) throw err;
      //   console.log(token)
        // res.json({ token });
      // }
    );

      //create JWT
      // const token = jwt.sign(
      //   { email: user.email, id: user._id },
      //   process.env.JWT_SECRET, // Use a strong secret key in production
      //   { expiresIn: '1h' }
      // );
  
       res.status(200).json({ token, username:user.username });

    } catch (error) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  };
  

  module.exports = { register, login };