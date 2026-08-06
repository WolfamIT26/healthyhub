export type LocaleCode = 'vi-VN' | 'en-US';
export type ContractVersion = 'v1';
export type ApiStatus = 'success' | 'warning' | 'error';

export interface ApiResponseMetadata {
  timestamp: string;
  timezone: 'Asia/Ho_Chi_Minh' | 'UTC';
  locale: LocaleCode;
  requestDurationMs?: number;
  pagination?: PaginationMetadata;
  appliedFilter?: AppliedFilter;
  appliedSearch?: AppliedSearch;
  appliedSort?: AppliedSort;
  [key: string]: unknown;
}

export interface ApiWarning {
  code: string;
  message: string;
  field?: string;
}

export interface ApiSuccessEnvelope<TData = unknown> {
  success: true;
  status: 'success' | 'warning';
  message: string;
  data: TData;
  metadata: ApiResponseMetadata;
  warnings?: ApiWarning[];
  requestId: string;
  traceId: string;
  contractVersion: ContractVersion;
}

export type ErrorCategory =
  | 'VALIDATION'
  | 'BUSINESS'
  | 'AUTH'
  | 'PERMISSION'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMIT'
  | 'SYSTEM'
  | 'INTEGRATION'
  | 'AI';

export interface FieldValidationError {
  field: string;
  code: string;
  message: string;
  rule?: string;
  rejectedValuePolicy?: 'hidden' | 'masked' | 'returned';
  path?: string;
}

export interface ApiErrorObject {
  code: string;
  category: ErrorCategory;
  domain?: string;
  message: string;
  details?: Record<string, unknown>;
  validationErrors?: FieldValidationError[];
  retryable?: boolean;
  retryAfter?: number;
  supportCode?: string;
}

export interface ApiErrorEnvelope {
  success: false;
  status: 'error';
  message: string;
  data: null;
  error: ApiErrorObject;
  metadata: ApiResponseMetadata;
  requestId: string;
  traceId: string;
  contractVersion: ContractVersion;
}

export type ApiEnvelope<TData = unknown> = ApiSuccessEnvelope<TData> | ApiErrorEnvelope;

export interface PaginationMetadata {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedData<TItem = unknown> {
  items: TItem[];
}

export interface PaginatedApiResponse<TItem = unknown> extends ApiSuccessEnvelope<
  PaginatedData<TItem>
> {
  metadata: ApiResponseMetadata & {
    pagination: PaginationMetadata;
  };
}

export interface FilterRule {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains' | 'between';
  value: string | number | boolean | unknown[];
}

export interface SortRule {
  field: string;
  direction: 'asc' | 'desc';
}

export interface AppliedFilter {
  filters: FilterRule[];
}

export interface AppliedSearch {
  keyword?: string;
  fields?: string[];
}

export interface AppliedSort {
  sort: SortRule[];
}

export interface Money {
  amount: string;
  currency: string;
}

export interface AuditMetadata {
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  version?: number;
}

export interface UploadContract {
  uploadId: string;
  uploadUrl: string;
  expiresAt: string;
}

export interface AiResult<TOutput = Record<string, unknown>> {
  interactionId: string;
  result: TOutput;
  confidence?: number;
  model?: string;
  safety?: Record<string, unknown>;
}
