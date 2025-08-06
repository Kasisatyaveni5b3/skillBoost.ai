import React, { useRef, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import PokemonCard from '../components/PokemonCard';
import { useCollection } from '../context/CollectionContext';

const fetchPokemons = async ({ pageParam = 0 }) => {
  const res = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${pageParam}&limit=20`);
  const data = res.data;

  const detailed = await Promise.all(
    data.results.map(p => axios.get(p.url).then(res => res.data))
  );

  return {
    results: detailed,
    nextOffset: pageParam + 20,
    hasNext: !!data.next
  };
};

export default function DiscoverPage() {
  const { addToCollection } = useCollection();
  const bottomRef = useRef();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['pokemons'],
    queryFn: fetchPokemons,
    getNextPageParam: (lastPage) => lastPage.hasNext ? lastPage.nextOffset : undefined,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    if (bottomRef.current) observer.observe(bottomRef.current);

    return () => {
      if (bottomRef.current) observer.unobserve(bottomRef.current);
    };
  }, [fetchNextPage, hasNextPage]);

return (
  <div className="p-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {data?.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.results.map(pokemon => (
            <PokemonCard key={pokemon.name} pokemon={pokemon} onAdd={addToCollection} />
          ))}
        </React.Fragment>
      ))}
    </div>
    <div ref={bottomRef} className="h-10"></div>
    {isFetchingNextPage && (
      <p className="text-center text-gray-500 mt-4">Loading more Pokemon...</p>
    )}
  </div>
);

}
