const { admin, db } = require('../config/firebaseConfig');

const verifyAuthToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  try {
    console.log('Token received:', token); // Log the token
    const decodedToken = await admin.auth().verifyIdToken(token, true);
    
    const expectedAudience = process.env.FIREBASE_PROJECT_ID;  
    if (process.env.NODE_ENV !== 'test' && decodedToken.aud !== expectedAudience) {
      throw new Error(`Token audience mismatch. Expected: ${expectedAudience}, but got: ${decodedToken.aud}`);
    }
    req.user = decodedToken;

    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    if (!userDoc.exists) {
      req.user.role = 'Driver';
      return res.status(403).json({ message: 'User document not found' });
    }
    req.user.role = userDoc.data().role || 'Driver'; // Default to Driver

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(403).json({ message: 'Unauthorized access' });
  }
};

module.exports = verifyAuthToken;
