const searchService = require('./search.service');

/**
 * GET /search
 * Handles full-text search with optional faceted filters, pagination
 */
async function search(req, res, next) {
  try {
    const { q, filters, page, size, sort } = req.query;

    const parsedFilters = filters ? (typeof filters === 'string' ? JSON.parse(filters) : filters) : {};
    const parsedPage = parseInt(page, 10) || 1;
    const parsedSize = parseInt(size, 10) || 20;

    const result = await searchService.search({
      q: q || '',
      filters: parsedFilters,
      page: parsedPage,
      size: parsedSize,
      sort: sort || '_score',
    });

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /search/suggest
 * Handles autocomplete suggestion queries
 */
async function suggest(req, res, next) {
  try {
    const { q, size } = req.query;

    const parsedSize = parseInt(size, 10) || 10;

    const result = await searchService.suggest({
      q: q || '',
      size: parsedSize,
    });

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { search, suggest };
