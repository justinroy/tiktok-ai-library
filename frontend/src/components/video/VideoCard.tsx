import { Video } from '../../types/video';

import './VideoCard.css';

interface VideoCardProps {
  video: Video;
  onSelect: (video: Video) => void;
}

export const VideoCard = ({ video, onSelect }: VideoCardProps) => {
  return (
    <article className="video-card">
      <header>
        <h2>{video.summary}</h2>
        <button
          type="button"
          onClick={() => onSelect(video)}
          className="details-button"
          aria-label={`View details for ${video.summary}`}
        >
          View details
        </button>
      </header>
      {video.signedUrl ? (
        <video controls preload="metadata" src={video.signedUrl} poster={video.videoUri}>
          Your browser does not support embedded videos.
        </video>
      ) : (
        <p className="missing-video">Video preview unavailable.</p>
      )}
      <footer>
        <ul className="tags">
          {video.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </footer>
    </article>
  );
};
