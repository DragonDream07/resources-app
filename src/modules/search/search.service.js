const { Client } = require('@elastic/elasticsearch');

const client = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
});

const PRODUCTS_INDEX = process.env.ELASTICSEARCH_INDEX || 'products';

/**
 * Performs a full-text search with faceted aggregations.
 * @param {object} params
 * @param {string} params.q - Search query string
 * @param {object} params.filters - Faceted filters (e.g. { brand: [...], category: [...], price: { min, max } })
 * @param {number} params.page - 1-based page number
 * @param {number} params.size - Page size
 * @param {string} params.sort - Sort field
 * @returns {Promise<object>} Search results with hits and aggregations
 */
async function search({ q, filters, page, size, sort }) {
  const from = (page - 1) * size;

  const mustClauses = [];
  const filterClauses = [];

  if (q && q.trim() !== '') {
    mustClauses.push({
      multi_match: {
        query: q,
        fields: ['name^3', 'description', 'brand^2', 'category^2', 'tags'],
        fuzziness: 'AUTO',
      },
    });
  } else {
    mustClauses.push({ match_all: {} });
  }

  if (filters.brand && filters.brand.length > 0) {
    filterClauses.push({ terms: { 'brand.keyword': filters.brand } });
  }

  if (filters.category && filters.category.length > 0) {
    filterClauses.push({ terms: { 'category.keyword': filters.category } });
  }

  if (filters.price) {
    const rangeFilter = { range: { price: {} } };
    if (filters.price.min !== undefined) rangeFilter.range.price.gte = filters.price.min;
    if (filters.price.max !== undefined) rangeFilter.range.price.lte = filters.price.max;
    filterClauses.push(rangeFilter);
  }

  if (filters.inStock !== undefined) {
    filterClauses.push({ term: { inStock: filters.inStock } });
  }

  const sortClause = buildSortClause(sort);

  const body = {
    from,
    size,
    query: {
      bool: {
        must: mustClauses,
        filter: filterClauses,
      },
    },
    sort: sortClause,
    aggs: {
      brands: {
        terms: { field: 'brand.keyword', size: 50 },
      },
      categories: {
        terms: { field: 'category.keyword', size: 50 },
      },
      price_stats: {
        stats: { field: 'price' },
      },
      price_ranges: {
        range: {
          field: 'price',
          ranges: [
            { key: 'under_500', to: 500 },
            { key: '500_to_1000', from: 500, to: 1000 },
            { key: '1000_to_5000', from: 1000, to: 5000 },
            { key: 'above_5000', from: 5000 },
          ],
        },
      },
    },
  };

  const response = await client.search({
    index: PRODUCTS_INDEX,
    body,
  });

  const hits = response.hits || response.body?.hits;
  const aggregations = response.aggregations || response.body?.aggregations;

  const total = typeof hits.total === 'object' ? hits.total.value : hits.total;
  const results = hits.hits.map((hit) => ({
    id: hit._id,
    score: hit._score,
    ...hit._source,
  }));

  return {
    total,
    page,
    size,
    totalPages: Math.ceil(total / size),
    results,
    facets: buildFacets(aggregations),
  };
}

/**
 * Provides autocomplete suggestions based on a partial query.
 * @param {object} params
 * @param {string} params.q - Partial query string
 * @param {number} params.size - Number of suggestions to return
 * @returns {Promise<object>} Suggestion results
 */
async function suggest({ q, size }) {
  if (!q || q.trim() === '') {
    return { suggestions: [] };
  }

  const body = {
    size: 0,
    suggest: {
      name_suggest: {
        prefix: q,
        completion: {
          field: 'name_suggest',
          size,
          skip_duplicates: true,
          fuzzy: {
            fuzziness: 'AUTO',
          },
        },
      },
    },
    query: {
      bool: {
        should: [
          {
            match_phrase_prefix: {
              name: {
                query: q,
                max_expansions: 20,
              },
            },
          },
        ],
        minimum_should_match: 1,
      },
    },
  };

  let suggestions = [];

  try {
    const suggestResponse = await client.search({
      index: PRODUCTS_INDEX,
      body: {
        size,
        _source: ['name', 'brand', 'category', 'imageUrl'],
        query: {
          bool: {
            should: [
              {
                match_phrase_prefix: {
                  name: {
                    query: q,
                    max_expansions: 20,
                    boost: 3,
                  },
                },
              },
              {
                match_phrase_prefix: {
                  brand: {
                    query: q,
                    max_expansions: 10,
                    boost: 2,
                  },
                },
              },
              {
                match_phrase_prefix: {
                  category: {
                    query: q,
                    max_expansions: 10,
                    boost: 1,
                  },
                },
              },
            ],
            minimum_should_match: 1,
          },
        },
      },
    });

    const hits = suggestResponse.hits || suggestResponse.body?.hits;
    suggestions = hits.hits.map((hit) => ({
      id: hit._id,
      name: hit._source.name,
      brand: hit._source.brand,
      category: hit._source.category,
      imageUrl: hit._source.imageUrl,
    }));
  } catch (err) {
    suggestions = [];
  }

  return { suggestions };
}

/**
 * Builds the Elasticsearch sort clause from a sort string.
 * @param {string} sort
 * @returns {Array}
 */
function buildSortClause(sort) {
  switch (sort) {
    case 'price_asc':
      return [{ price: { order: 'asc' } }];
    case 'price_desc':
      return [{ price: { order: 'desc' } }];
    case 'newest':
      return [{ createdAt: { order: 'desc' } }];
    case 'popularity':
      return [{ salesCount: { order: 'desc' } }];
    case '_score':
    default:
      return [{ _score: { order: 'desc' } }];
  }
}

/**
 * Transforms Elasticsearch aggregations into a facets structure.
 * @param {object} aggregations
 * @returns {object}
 */
function buildFacets(aggregations) {
  if (!aggregations) return {};

  const facets = {};

  if (aggregations.brands) {
    facets.brands = aggregations.brands.buckets.map((b) => ({
      value: b.key,
      count: b.doc_count,
    }));
  }

  if (aggregations.categories) {
    facets.categories = aggregations.categories.buckets.map((b) => ({
      value: b.key,
      count: b.doc_count,
    }));
  }

  if (aggregations.price_stats) {
    facets.priceStats = {
      min: aggregations.price_stats.min,
      max: aggregations.price_stats.max,
      avg: aggregations.price_stats.avg,
    };
  }

  if (aggregations.price_ranges) {
    facets.priceRanges = aggregations.price_ranges.buckets.map((b) => ({
      key: b.key,
      from: b.from,
      to: b.to,
      count: b.doc_count,
    }));
  }

  return facets;
}

module.exports = { search, suggest };
