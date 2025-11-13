import { useQuery } from '@tanstack/react-query';

import { fetchVideos } from '../api/videos';
import { VideoFilters, VideosResponse } from '../types/video';

export const useVideos = (filters: VideoFilters) => {
  return useQuery<VideosResponse, Error>({
    queryKey: ['videos', filters],
    queryFn: () => fetchVideos(filters),
    keepPreviousData: true,
    staleTime: 1000 * 30
  });
};
