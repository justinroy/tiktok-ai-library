import { ChangeEvent } from 'react';

import './SearchBar.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
}

export const SearchBar = ({ value, onChange, isLoading = false }: SearchBarProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <label className="search-bar">
      <span className="search-label">Search</span>
      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder="Search summaries or tags"
        aria-label="Search summaries or tags"
      />
      {isLoading ? <span className="search-spinner" aria-hidden>⏳</span> : null}
    </label>
  );
};
