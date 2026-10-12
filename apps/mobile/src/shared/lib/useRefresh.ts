import { useCallback, useRef, useState } from 'react';

const MIN_VISIBLE_MS = 650;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useRefresh = (...tasks: (() => Promise<unknown>)[]) => {
  const [refreshing, setRefreshing] = useState(false);
  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([...tasksRef.current.map((task) => task()), wait(MIN_VISIBLE_MS)]);
    } finally {
      setRefreshing(false);
    }
  }, []);

  return { refreshing, onRefresh };
};
