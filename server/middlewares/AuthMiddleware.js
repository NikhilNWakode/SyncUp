import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  
  console.log('Received token:', token); // Debug log

  if (!token) {
    console.log('No token found in cookies'); // Debug log
    return res.status(401).json({ message: "You are not authenticated!" });
  }

  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      console.log('Token verification error:', err); // Debug log
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "Token has expired" });
      }
      return res.status(403).json({ message: "Token is not valid!" });
    }

    console.log('Token verified successfully. User ID:', payload.userId); // Debug log
    req.userId = payload.userId;
    next();
  });
};

export { verifyToken };