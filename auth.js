 const autho = (req, res, next) => {
    console.log('Checking authorization for /job routes');
    const token = "123"; // Hardcoded token for simplicity

    const isAuthorized = token === "123";
    if (!isAuthorized) {
        return res.status(401).send('Unauthorized'); // Send a plain string response
    } else {
        console.log('Token is valid');
    }

    next(); // Proceed to the next middleware or route handler
};

module.exports = autho;