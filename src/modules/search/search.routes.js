const express = require('express');
const router = express.Router();
const searchController = require('./search.controller');
const { validateSearch, validateSuggest } = require('./search.validator');

/**
 * GET /search
 * Full-text search with faceted filters
 */
router.get('/', validateSearch, searchController.search);

/**
 * GET /search/suggest
 * Autocomplete suggestions
 */
router.get('/suggest', validateSuggest, searchController.suggest);

module.exports = router;
