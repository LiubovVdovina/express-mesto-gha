const router = require('express').Router();
const {
  getUsers, getUser, updateUser, updateAvatar, getCurrentUser,
} = require('../controllers/users');

const { updateUserValidation, updateAvatarValidation, userIdValidation } = require('../middlewares/validators/userValidator');

router.get('/users/me', getCurrentUser);
router.get('/users', getUsers);
router.get('/users/:userId', userIdValidation, getUser);
router.patch('/users/me', updateUserValidation, updateUser);
router.patch('/users/me/avatar', updateAvatarValidation, updateAvatar);

module.exports = router;
