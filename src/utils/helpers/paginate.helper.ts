//src/utils/pagination.helper.ts
import { Document, Query } from "mongoose";
import { PaginatedResponse, PaginationOptions } from "../../interfaces";

// Centralizing pagination logic
export const paginate = async <T extends Document>(
  query: Query<T[], T>,
  options: PaginationOptions
): Promise<PaginatedResponse<T>> => {
  const { page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;

  // Fetch data and total items count
  const [data, totalItems] = await Promise.all([
    query.skip(skip).limit(limit), // Fetch paginated data
    query.model.countDocuments(query.getFilter()), // Get total count of documents based on filters
  ]);

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalItems / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    data,
    meta: {
      totalItems,
      totalPages,
      currentPage: page,
      pageSize: limit,
      hasNextPage,
      hasPreviousPage,
    },
  };
};
