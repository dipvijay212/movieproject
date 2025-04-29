const express = require('express');
const router = express.Router();
const {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} = require('../controllers/movieController');

const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllMovies);
router.get('/:id', getMovieById);

// Admin protected routes
router.post('/', authMiddleware, adminMiddleware, createMovie);
router.put('/:id', authMiddleware, adminMiddleware, updateMovie);
router.delete('/:id', authMiddleware, adminMiddleware, deleteMovie);

module.exports = router;
