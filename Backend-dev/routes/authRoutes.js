const express = require('express');
const { register, login, db } = require('../controllers/authController');
const authenticateJWT = require('../middlewares/authenticateJWT');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Example protected route
router.get('/profile', authenticateJWT, async (req, res) => {
  const user = req.user;

  try {
    const usersRef = db.collection('users');
    const userDoc = usersRef.doc(user.uid);
    const userData = await userDoc.get();
    if (!userData.exists) {
      return res.status(404).send({ error: 'User not found' });
    }

    res.status(200).send(userData.data());
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;