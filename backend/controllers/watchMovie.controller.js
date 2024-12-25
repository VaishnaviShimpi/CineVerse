import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function getMovieID(req, res) {
    const { movieName } = req.params;

    try {
        const encodedMovieName = encodeURIComponent(movieName);
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/search/movie?query=${encodedMovieName}&include_adult=false&language=en-US&page=1`); 
        const movieIds = data.results.map(result => result.id);
        res.json({ success: true, content: movieIds });

    } catch (error) {
        if (error.message.includes("404")) {
            return res.status(404).send(null);
        }

        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


export async function getMovieKey(req, res) {
    const { id } = req.params;

    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`);
        const validKey = data.results.find(result => result.key); 

        if (validKey) {
            res.json({ success: true, content: { key: validKey.key } });
        } else {
            res.status(404).json({ success: false, message: "No valid keys found for the given movie ID." });
        }
    } catch (error) {
        if (error.message.includes("404")) {
            return res.status(404).send(null);
        }

        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
