const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const projectRoutes = require('./projectRoutes');
const songRoutes = require('./songRoutes');
const versionRoutes = require('./versionRoutes');
const feedbackRoutes = require('./feedbackRoutes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/songs', songRoutes);
router.use('/versions', versionRoutes);
router.use('/feedback', feedbackRoutes);

module.exports = router;
