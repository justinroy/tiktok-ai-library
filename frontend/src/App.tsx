import { useMemo, useState } from 'react';

import { useVideos } from './hooks/useVideos';
import { DetailModal } from './components/shared/DetailModal';
import { Layout } from './components/layout/Layout';
import { Pagination } from './components/shared/Pagination';
import { SearchBar } from './components/sidebar/SearchBar';
import { TagCloud } from './components/sidebar/TagCloud';
import { TagFilter } from './components/sidebar/TagFilter';
import { VideoGrid } from './components/video/VideoGrid';
import { Video } from './types/video';

const PAGE_SIZE = 20;

export default function App() {
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching
  } = useVideos({
    search,
    tags: selectedTags,
    page,
    pageSize: PAGE_SIZE
  });

  const tagCounts = useMemo(() => {
    if (!data) {
      return [] as Array<{ tag: string; count: number }>;
    }

    return Object.entries(data.tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [data]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  const handleTagToggle = (tag: string) => {
    setPage(1);
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSearchChange = (value: string) => {
    setPage(1);
    setSearch(value);
  };

  return (
    <Layout
      sidebar={
        <>
          <SearchBar value={search} onChange={handleSearchChange} isLoading={isFetching} />
          <TagFilter
            tags={data?.availableTags ?? []}
            selectedTags={selectedTags}
            onToggle={handleTagToggle}
            isLoading={isLoading && !data}
          />
          <TagCloud
            tagCounts={tagCounts}
            highlightedTags={selectedTags}
            onTagClick={handleTagToggle}
          />
        </>
      }
    >
      <div className="content-header">
        <div>
          <h1>TikTok AI Library</h1>
          <p className="subtitle">
            {data ? `Showing ${data.total} videos` : 'Loading video catalog…'}
          </p>
        </div>
        <div className="status">
          {isFetching ? <span className="pill">Refreshing…</span> : null}
          {isError ? <span className="pill error">{(error as Error).message}</span> : null}
        </div>
      </div>

      <VideoGrid
        videos={data?.items ?? []}
        isLoading={isLoading && !data}
        onSelect={setActiveVideo}
      />

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      <DetailModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </Layout>
  );
}
