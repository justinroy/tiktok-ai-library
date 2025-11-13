import { Video } from '../../types/video';
import { VideoCard } from './VideoCard';

import './VideoGrid.css';

interface VideoGridProps {
  videos: Video[];
  isLoading?: boolean;
  onSelect: (video: Video) => void;
}

export const VideoGrid = ({ videos, isLoading = false, onSelect }: VideoGridProps) => {
  if (isLoading) {
    return <div className="video-grid">Loading videos…</div>;
  }

  if (videos.length === 0) {
    return <div className="video-grid">No videos found. Try adjusting your filters.</div>;
  }

  return (
    <div className="video-grid">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} onSelect={onSelect} />
      ))}
    </div>
  );
};
