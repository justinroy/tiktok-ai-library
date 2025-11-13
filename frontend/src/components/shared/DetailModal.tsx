import type { MouseEvent } from 'react';

import { Video } from '../../types/video';

import './DetailModal.css';

interface DetailModalProps {
  video: Video | null;
  onClose: () => void;
}

export const DetailModal = ({ video, onClose }: DetailModalProps) => {
  if (!video) {
    return null;
  }

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Video details"
      onClick={handleOverlayClick}
    >
      <div className="modal">
        <header>
          <h2>Video details</h2>
          <button type="button" onClick={onClose} aria-label="Close details">
            ✕
          </button>
        </header>
        <section className="modal-content">
          <p className="summary">{video.summary}</p>
          {video.transcript ? (
            <div className="transcript">
              <h3>Transcript</h3>
              <p>{video.transcript}</p>
            </div>
          ) : null}
          <div className="metadata">
            <div>
              <h3>Tags</h3>
              <ul>
                {video.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </div>
            {video.createdAt ? (
              <div>
                <h3>Published</h3>
                <time dateTime={video.createdAt}>
                  {new Date(video.createdAt).toLocaleString()}
                </time>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
};
