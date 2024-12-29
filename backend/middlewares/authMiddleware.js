const { admin, db } = require('../config/firebaseConfig');


// Configure explicitly to trust the frontend project
const frontendProjectId = process.env.REACT_APP_FRONTEND_URL;

const verifyAuthToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  try {
    console.log('Token received:', token); // Log the token
    const decodedToken = jwt.decode(token); // Decode the token without verifying it
    console.log('Decoded token payload:', decodedToken);

    const verifiedToken = await admin.auth().verifyIdToken(token,true);
    console.log('Verified token:', verifiedToken);

    if (verifiedToken.aud !== frontendProjectId) {
      throw new Error('Token does not belong to the expected frontend project');
    }
    req.user = verifiedToken;

    const userDoc = await db.collection('users').doc(verifiedToken.uid).get();
    if (!userDoc.exists) {
      req.user.role = 'Driver';
      return res.status(403).json({ message: 'User document not found' });
    }
    req.user.role = userDoc.data().role || 'Driver'; // Default to Driver

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(403).json({ message: 'Unauthorized access', error: error.message });
  }
};

module.exports = verifyAuthToken;
