import express from 'express';
const router = express.Router();

import { getMovieID, getMovieKey } from "../controllers/watchMovie.controller.js";

router.get('/movie/:movieName', getMovieID);
router.get('/key/:id', getMovieKey);

export default router;