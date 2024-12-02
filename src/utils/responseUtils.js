const createSuccessResponse = (data, message = 'Success') => ({
  success: true,
  message,
  data
});

const createErrorResponse = (message, errors = null) => ({
  success: false,
  message,
  ...(errors && { errors })
});

const createPaginatedResponse = (data, page, limit, total) => ({
  success: true,
  data,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  }
});

module.exports = {
  createSuccessResponse,
  createErrorResponse,
  createPaginatedResponse
};