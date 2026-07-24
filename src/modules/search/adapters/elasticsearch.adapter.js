'use strict';

const { Client } = require('@elastic/elasticsearch');

// ---------------------------------------------------------------------------
// Client singleton
// ---------------------------------------------------------------------------

const client = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  auth: process.env.ELASTICSEARCH_API_KEY
    ? { apiKey: process.env.ELASTICSEARCH_API_KEY }
    : undefined,
  tls: process.env.ELASTICSEARCH_CA_CERT
    ? { ca: process.env.ELASTICSEARCH_CA_CERT, rejectUnauthorized: true }
    : undefined,
});

// ---------------------------------------------------------------------------
// Index names
// ---------------------------------------------------------------------------

const INDICES = {
  products: process.env.ES_INDEX_PRODUCTS || 'products',
  categories: process.env.ES_INDEX_CATEGORIES || 'categories',
  brands: process.env.ES_INDEX_BRANDS || 'brands',
};

// ---------------------------------------------------------------------------
// Index mapping definitions
// ---------------------------------------------------------------------------

const MAPPINGS = {
  products: {
    mappings: {
      properties: {
        id: { type: 'keyword' },
        name: {
          type: 'text',
          analyzer: 'standard',
          fields: { keyword: { type: 'keyword', ignore_above: 256 } },
        },
        description: { type: 'text', analyzer: 'standard' },
        slug: { type: 'keyword' },
        brand: {
          properties: {
            id: { type: 'keyword' },
            name: {
              type: 'text',
              fields: { keyword: { type: 'keyword', ignore_above: 256 } },
            },
          },
        },
        category: {
          properties: {
            id: { type: 'keyword' },
            name: {
              type: 'text',
              fields: { keyword: { type: 'keyword', ignore_above: 256 } },
            },
          },
        },
        price: { type: 'double' },
        salePrice: { type: 'double' },
        inStock: { type: 'boolean' },
        rating: { type: 'float' },
        reviewCount: { type: 'integer' },
        tags: { type: 'keyword' },
        attributes: { type: 'flattened' },
        status: { type: 'keyword' },
        createdAt: { type: 'date' },
        updatedAt: { type: 'date' },
        suggest: {
          type: 'completion',
          analyzer: 'simple',
          preserve_separators: true,
          preserve_position_increments: true,
          max_input_length: 50,
        },
      },
    },
    settings: {
      number_of_shards: 1,
      number_of_replicas: 1,
      analysis: {
        analyzer: {
          standard: { type: 'standard' },
        },
      },
    },
  },

  categories: {
    mappings: {
      properties: {
        id: { type: 'keyword' },
        name: {
          type: 'text',
          fields: { keyword: { type: 'keyword', ignore_above: 256 } },
        },
        slug: { type: 'keyword' },
        parentId: { type: 'keyword' },
        status: { type: 'keyword' },
        suggest: {
          type: 'completion',
          analyzer: 'simple',
          max_input_length: 50,
        },
      },
    },
    settings: { number_of_shards: 1, number_of_replicas: 1 },
  },

  brands: {
    mappings: {
      properties: {
        id: { type: 'keyword' },
        name: {
          type: 'text',
          fields: { keyword: { type: 'keyword', ignore_above: 256 } },
        },
        slug: { type: 'keyword' },
        status: { type: 'keyword' },
        suggest: {
          type: 'completion',
          analyzer: 'simple',
          max_input_length: 50,
        },
      },
    },
    settings: { number_of_shards: 1, number_of_replicas: 1 },
  },
};

// ---------------------------------------------------------------------------
// Index mapping helpers
// ---------------------------------------------------------------------------

/**
 * Create an index if it does not already exist.
 * @param {string} indexName - One of the values in INDICES.
 * @returns {Promise<object>} Elasticsearch response.
 */
async function ensureIndex(indexName) {
  const exists = await client.indices.exists({ index: indexName });
  if (exists) {
    return { acknowledged: true, already_exists: true };
  }
  const body = MAPPINGS[indexName] || {};
  return client.indices.create({ index: indexName, body });
}

/**
 * Create all known indices.
 * @returns {Promise<object[]>} Array of responses.
 */
async function ensureAllIndices() {
  return Promise.all(Object.values(INDICES).map((idx) => ensureIndex(idx)));
}

/**
 * Delete an index.
 * @param {string} indexName
 * @returns {Promise<object>}
 */
async function deleteIndex(indexName) {
  return client.indices.delete({ index: indexName });
}

/**
 * Refresh an index (force segments to be flushed so documents are searchable).
 * @param {string} indexName
 * @returns {Promise<object>}
 */
async function refreshIndex(indexName) {
  return client.indices.refresh({ index: indexName });
}

// ---------------------------------------------------------------------------
// Document helpers
// ---------------------------------------------------------------------------

/**
 * Index (upsert) a single document.
 * @param {string} indexName
 * @param {string|number} id
 * @param {object} document
 * @returns {Promise<object>}
 */
async function indexDocument(indexName, id, document) {
  return client.index({
    index: indexName,
    id: String(id),
    body: document,
    refresh: 'wait_for',
  });
}

/**
 * Bulk index an array of documents.
 * Each document must have an `id` property used as the document id.
 * @param {string} indexName
 * @param {object[]} documents
 * @returns {Promise<object>}
 */
async function bulkIndex(indexName, documents) {
  if (!documents || documents.length === 0) {
    return { items: [], errors: false };
  }

  const operations = documents.flatMap((doc) => [
    { index: { _index: indexName, _id: String(doc.id) } },
    doc,
  ]);

  return client.bulk({ refresh: 'wait_for', body: operations });
}

/**
 * Delete a single document by id.
 * @param {string} indexName
 * @param {string|number} id
 * @returns {Promise<object>}
 */
async function deleteDocument(indexName, id) {
  return client.delete({
    index: indexName,
    id: String(id),
    refresh: 'wait_for',
  });
}

// ---------------------------------------------------------------------------
// Query builders
// ---------------------------------------------------------------------------

/**
 * Build a full-text product search query.
 *
 * @param {object} params
 * @param {string}  [params.q]          - Free-text search string.
 * @param {string}  [params.categoryId] - Filter by category id.
 * @param {string}  [params.brandId]    - Filter by brand id.
 * @param {number}  [params.minPrice]   - Minimum price filter.
 * @param {number}  [params.maxPrice]   - Maximum price filter.
 * @param {boolean} [params.inStock]    - Filter in-stock only.
 * @param {string}  [params.sortBy]     - Field to sort by.
 * @param {'asc'|'desc'} [params.sortOrder] - Sort direction.
 * @param {number}  [params.page]       - 1-based page number.
 * @param {number}  [params.limit]      - Page size.
 * @returns {object} Elasticsearch request body.
 */
function buildProductSearchQuery(params = {}) {
  const {
    q,
    categoryId,
    brandId,
    minPrice,
    maxPrice,
    inStock,
    sortBy = '_score',
    sortOrder = 'desc',
    page = 1,
    limit = 20,
  } = params;

  const from = (Math.max(1, Number(page)) - 1) * Math.max(1, Number(limit));
  const size = Math.max(1, Number(limit));

  const must = [];
  const filter = [];

  // Full-text clause
  if (q && q.trim() !== '') {
    must.push({
      multi_match: {
        query: q.trim(),
        fields: ['name^3', 'description', 'brand.name^2', 'category.name', 'tags'],
        type: 'best_fields',
        fuzziness: 'AUTO',
      },
    });
  } else {
    must.push({ match_all: {} });
  }

  // Filters
  if (categoryId) {
    filter.push({ term: { 'category.id': String(categoryId) } });
  }

  if (brandId) {
    filter.push({ term: { 'brand.id': String(brandId) } });
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    const range = {};
    if (minPrice !== undefined) range.gte = Number(minPrice);
    if (maxPrice !== undefined) range.lte = Number(maxPrice);
    filter.push({ range: { price: range } });
  }

  if (inStock !== undefined) {
    filter.push({ term: { inStock: Boolean(inStock) } });
  }

  // Status must be active for public search
  filter.push({ term: { status: 'active' } });

  // Sort
  const allowedSortFields = ['price', 'rating', 'reviewCount', 'createdAt', '_score'];
  const resolvedSortBy = allowedSortFields.includes(sortBy) ? sortBy : '_score';
  const resolvedSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

  const sort = [];
  if (resolvedSortBy !== '_score') {
    sort.push({ [resolvedSortBy]: { order: resolvedSortOrder } });
  }
  sort.push({ _score: { order: 'desc' } });

  return {
    from,
    size,
    query: {
      bool: {
        must,
        filter,
      },
    },
    sort,
    aggs: {
      categories: {
        terms: { field: 'category.id', size: 20 },
        aggs: {
          name: { terms: { field: 'category.name.keyword', size: 1 } },
        },
      },
      brands: {
        terms: { field: 'brand.id', size: 20 },
        aggs: {
          name: { terms: { field: 'brand.name.keyword', size: 1 } },
        },
      },
      price_stats: { stats: { field: 'price' } },
      in_stock_count: { filter: { term: { inStock: true } } },
    },
  };
}

/**
 * Build a completion-suggester query for autocomplete.
 *
 * @param {string} prefix   - The user's partial input.
 * @param {number} [size=5] - Number of suggestions to return.
 * @returns {object} Elasticsearch request body.
 */
function buildSuggestQuery(prefix, size = 5) {
  return {
    suggest: {
      product_suggest: {
        prefix: prefix || '',
        completion: {
          field: 'suggest',
          size: Math.max(1, Number(size)),
          skip_duplicates: true,
          fuzzy: {
            fuzziness: 'AUTO',
          },
        },
      },
    },
    _source: ['id', 'name', 'slug', 'category', 'brand'],
  };
}

/**
 * Build a category search / list query.
 *
 * @param {object} params
 * @param {string} [params.q]        - Optional name filter.
 * @param {string} [params.parentId] - Filter by parent category.
 * @param {number} [params.page]
 * @param {number} [params.limit]
 * @returns {object} Elasticsearch request body.
 */
function buildCategorySearchQuery(params = {}) {
  const { q, parentId, page = 1, limit = 50 } = params;

  const from = (Math.max(1, Number(page)) - 1) * Math.max(1, Number(limit));
  const size = Math.max(1, Number(limit));

  const must = [];
  const filter = [{ term: { status: 'active' } }];

  if (q && q.trim() !== '') {
    must.push({
      match: {
        name: {
          query: q.trim(),
          fuzziness: 'AUTO',
        },
      },
    });
  } else {
    must.push({ match_all: {} });
  }

  if (parentId) {
    filter.push({ term: { parentId: String(parentId) } });
  }

  return {
    from,
    size,
    query: { bool: { must, filter } },
    sort: [{ 'name.keyword': { order: 'asc' } }],
  };
}

/**
 * Build a brand search / list query.
 *
 * @param {object} params
 * @param {string} [params.q]
 * @param {number} [params.page]
 * @param {number} [params.limit]
 * @returns {object} Elasticsearch request body.
 */
function buildBrandSearchQuery(params = {}) {
  const { q, page = 1, limit = 50 } = params;

  const from = (Math.max(1, Number(page)) - 1) * Math.max(1, Number(limit));
  const size = Math.max(1, Number(limit));

  const must = [];
  const filter = [{ term: { status: 'active' } }];

  if (q && q.trim() !== '') {
    must.push({
      match: {
        name: {
          query: q.trim(),
          fuzziness: 'AUTO',
        },
      },
    });
  } else {
    must.push({ match_all: {} });
  }

  return {
    from,
    size,
    query: { bool: { must, filter } },
    sort: [{ 'name.keyword': { order: 'asc' } }],
  };
}

// ---------------------------------------------------------------------------
// Search execution helpers
// ---------------------------------------------------------------------------

/**
 * Execute a search query against an index and return a normalised result.
 *
 * @param {string} indexName
 * @param {object} body - Elasticsearch query DSL body.
 * @returns {Promise<{hits: object[], total: number, aggregations: object}>}
 */
async function search(indexName, body) {
  const response = await client.search({ index: indexName, body });
  const hitsWrapper = response.hits || {};
  const total =
    typeof hitsWrapper.total === 'object'
      ? hitsWrapper.total.value
      : hitsWrapper.total || 0;

  return {
    hits: (hitsWrapper.hits || []).map((h) => ({ ...h._source, _score: h._score })),
    total,
    aggregations: response.aggregations || {},
  };
}

/**
 * Execute a suggest query and return an array of suggestion options.
 *
 * @param {string} indexName
 * @param {object} body - Elasticsearch suggest body.
 * @returns {Promise<object[]>}
 */
async function suggest(indexName, body) {
  const response = await client.search({ index: indexName, body });
  const suggestResult = response.suggest || {};
  const options = [];

  Object.values(suggestResult).forEach((suggesterResults) => {
    (suggesterResults || []).forEach((entry) => {
      (entry.options || []).forEach((opt) => {
        options.push({ ...opt._source, score: opt._score, text: opt.text });
      });
    });
  });

  return options;
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

module.exports = {
  client,
  INDICES,
  MAPPINGS,
  // Index mapping helpers
  ensureIndex,
  ensureAllIndices,
  deleteIndex,
  refreshIndex,
  // Document helpers
  indexDocument,
  bulkIndex,
  deleteDocument,
  // Query builders
  buildProductSearchQuery,
  buildSuggestQuery,
  buildCategorySearchQuery,
  buildBrandSearchQuery,
  // Search execution helpers
  search,
  suggest,
};
