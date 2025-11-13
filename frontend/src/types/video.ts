export interface Video {
  id: string;
  summary: string;
  tags: string[];
  signedUrl: string;
  createdAt?: string;
  transcript?: string;
  videoUri?: string;
}

export interface VideosResponse {
  items: Video[];
  total: number;
  page: number;
  pageSize: number;
  availableTags: string[];
  tagCounts: Record<string, number>;
}

export interface VideoFilters {
  search?: string;
  tags?: string[];
  page?: number;
  pageSize?: number;
}
