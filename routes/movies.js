const axios = require('axios');
const config = require('../config');

const createMovieDbUrl = (relativeUrl, queryParams) => {
  let baseUrl = `${config.movieDbBaseUrl}${relativeUrl}?api_key=${
    config.movieDbApiKey
  }&language=en-US`;
  if (queryParams) {
    Object.keys(queryParams).forEach(paramName => (baseUrl += `&${paramName}=${queryParams[paramName]}`));
  }
  return baseUrl;
};

const getRelativeUrl = (path) => {
  switch (path) {
    case 'top':
      return '/movie/top_rated';
    case 'search':
      return '/search/movie';
    default:
      return '/movie/';
  }
};

module.exports = (app) => {
  app.get('/api/movies/:id', (req, res, next) => {
    const id = req.params.id;
    const relativeUrl = getRelativeUrl(req.query.path);
    const fullUrl = createMovieDbUrl(`${relativeUrl}${id}`);
    axios(fullUrl)
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        res.json({ success: false, message: error.message });
      });
  });

  app.get('/api/movies', (req, res, next) => {
    // http://localhost:5000/api/movies?path=top&page=1&search=father
    const relativeUrl = getRelativeUrl(req.query.path);
    const page = parseInt(req.query.page, 10);
    const query = req.query.search;
    const fullUrl = createMovieDbUrl(relativeUrl, {
      page,
      query,
    });
    axios(fullUrl)
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        res.json({ success: false, message: error.message });
      });
  });
};

// Top Rated Movies
// https://api.themoviedb.org/3/movie/top_rated?api_key={api_key}&language=en-US&page=1
// Search Movies
// https://api.themoviedb.org/3/search/movie?api_key={api_key}&language=en-US&page=1&include_adult=false
// Movie Details
// https://api.themoviedb.org/3/movie/{movie_id}?api_key={api_key}&language=en-US
