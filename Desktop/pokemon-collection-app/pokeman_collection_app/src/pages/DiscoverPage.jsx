import React, { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import PokemonCard from '../components/PokemonCard';
import { useCollection } from '../context/CollectionContext';
import '../styles/DiscoverPage.css';

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
  const { collection, addToCollection } = useCollection();
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

    const currentBottomRef = bottomRef.current;
    if (currentBottomRef) observer.observe(currentBottomRef);

    return () => {
      if (currentBottomRef) observer.unobserve(currentBottomRef);
    };
  }, [fetchNextPage, hasNextPage]);

const isInCollection = (pokemon) =>
  collection.some((p) => p.name === pokemon.name);
console.log('🎯 Collection in DiscoverPage:', collection);


  return (
    <div className="custom-scroll-page">
      <div className="custom-card-container">
        {data?.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.results.map((pokemon) => (
              <PokemonCard
                key={pokemon.name}
                pokemon={pokemon}
                toggleCollection={addToCollection}
                isInCollection={isInCollection(pokemon)}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
      <div ref={bottomRef} className="loader-trigger" />
      {isFetchingNextPage && (
        <p className="text-center text-gray-500 mt-4">Loading more Pokémon...</p>
      )}
    </div>
  );
}
