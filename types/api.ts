export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  success: boolean
}

export interface ApiError {
  message: string
  code: string
  statusCode: number
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}
