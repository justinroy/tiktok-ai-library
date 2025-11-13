import './TagCloud.css';

interface TagCloudProps {
  tagCounts: Array<{ tag: string; count: number }>;
  highlightedTags: string[];
  onTagClick: (tag: string) => void;
}

export const TagCloud = ({ tagCounts, highlightedTags, onTagClick }: TagCloudProps) => {
  if (tagCounts.length === 0) {
    return null;
  }

  const maxCount = Math.max(...tagCounts.map((item) => item.count));
  const safeMax = Number.isFinite(maxCount) && maxCount > 0 ? maxCount : 1;

  return (
    <div className="tag-cloud">
      <h3>Top Tags</h3>
      <div className="tag-cloud-items" role="list">
        {tagCounts.map(({ tag, count }) => {
          const weight = Math.max(0.6, count / safeMax);
          const isActive = highlightedTags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              role="listitem"
              className={`tag-cloud-item${isActive ? ' active' : ''}`}
              style={{ fontSize: `${0.85 + weight * 0.6}rem` }}
              aria-pressed={isActive}
              onClick={() => onTagClick(tag)}
            >
              {tag}
              <span className="tag-count">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
