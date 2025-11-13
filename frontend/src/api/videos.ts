import { VideoFilters, VideosResponse } from '../types/video';

const DEFAULT_PAGE_SIZE = 20;

const buildQueryString = (filters: VideoFilters) => {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set('search', filters.search);
  }

  if (filters.tags && filters.tags.length > 0) {
    params.set('tags', filters.tags.join(','));
  }

  params.set('page', filters.page?.toString() ?? '1');
  params.set('pageSize', filters.pageSize?.toString() ?? DEFAULT_PAGE_SIZE.toString());

  return params.toString();
};

export const fetchVideos = async (filters: VideoFilters): Promise<VideosResponse> => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  const query = buildQueryString(filters);
  const url = `${baseUrl}/api/videos?${query}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Unable to load videos (${response.status})`);
  }

  const data = (await response.json()) as VideosResponse;

  const computedTagCounts =
    data.tagCounts ??
    data.items
      .flatMap((item) => item.tags)
      .reduce<Record<string, number>>((acc, tag) => {
        acc[tag] = (acc[tag] ?? 0) + 1;
        return acc;
      }, {});

  const availableTags = (data.availableTags ?? Object.keys(computedTagCounts)).sort((a, b) =>
    a.localeCompare(b)
  );

  return {
    ...data,
    availableTags,
    tagCounts: computedTagCounts
  };
};
