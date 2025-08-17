// Alternative Authentication Fix for Cross-Origin Deployment
// If cookies still don't work, we can use Authorization headers instead

// Add this to your backend auth.js - Alternative login response
authRouter.post("/login-alt", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "4d" });
    
    // Send token in response body instead of cookie
    res.status(200).send({ 
      message: "Login successful", 
      user,
      token // Send token to frontend
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Alternative auth middleware that checks Authorization header
const authMiddlewareAlt = async (req, res, next) => {
  try {
    // Check Authorization header first, then cookies
    let token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      token = req.cookies.token;
    }
    
    if (!token) {
      return res.status(401).send({ message: "Unauthorized: No token provided" });
    }

    const isvalid = jwt.verify(token, process.env.JWT_SECRET);
    if (!isvalid) {
      return res.status(401).send({ message: "Unauthorized: Invalid token" });
    }

    const { _id } = isvalid;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in auth middleware:", error.message);
    res.status(400).send({ message: "Authentication failed. Please try again." });
  }
};
