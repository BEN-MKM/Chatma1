import { useState, useEffect } from 'react';

const usePagination = (fetchData, pageSize = 10) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const newData = await fetchData(page, pageSize);
      
      if (newData.length < pageSize) {
        setHasMore(false);
      }

      setData(prevData => [...prevData, ...newData]);
      setPage(prev => prev + 1);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    setPage(1);
    setData([]);
    setHasMore(true);
    await loadMore();
  };

  return {
    data,
    loading,
    hasMore,
    error,
    loadMore,
    refresh
  };
};

export default usePagination;
