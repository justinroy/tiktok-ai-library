import './TagFilter.css';

interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  onToggle: (tag: string) => void;
  isLoading?: boolean;
}

export const TagFilter = ({ tags, selectedTags, onToggle, isLoading = false }: TagFilterProps) => {
  if (isLoading) {
    return <div className="tag-filter">Loading tags…</div>;
  }

  if (tags.length === 0) {
    return <div className="tag-filter">No tags available.</div>;
  }

  return (
    <div className="tag-filter">
      <h3>Filter by tag</h3>
      <ul>
        {tags.map((tag) => {
          const isActive = selectedTags.includes(tag);
          return (
            <li key={tag}>
              <label>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => onToggle(tag)}
                  aria-label={`Filter by ${tag}`}
                />
                <span>{tag}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
