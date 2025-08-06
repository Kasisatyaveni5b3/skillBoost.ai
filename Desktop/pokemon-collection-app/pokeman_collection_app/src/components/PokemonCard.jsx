import React from 'react';
import { Button } from '@mui/material';
import { useCollection } from '../context/CollectionContext';

export default function PokemonCard({ pokemon }) {
  const { collection, addToCollection, removeFromCollection } = useCollection();

  const isCollected = collection.some(p => p.name === pokemon.name);

  return (
    <div className="flex items-center justify-between p-4 my-2 bg-white rounded shadow hover:shadow-md transition">
      <div className="flex items-center space-x-4">
        <img src={pokemon.sprites.front_default} alt={pokemon.name} className="w-14 h-14" />
        <div>
          <h2 className="text-lg font-semibold capitalize">{pokemon.name}</h2>
          <p className="text-sm text-gray-600">
            {pokemon.types.map(t => (
              <span
                key={t.type.name}
                className="bg-blue-100 text-blue-800 text-xs font-semibold mr-1 px-2.5 py-0.5 rounded"
              >
                {t.type.name}
              </span>
            ))}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            HP: {pokemon.stats[0].base_stat}, ATK: {pokemon.stats[1].base_stat}, DEF: {pokemon.stats[2].base_stat}
          </p>
        </div>
      </div>
      <Button
        variant="contained"
        color={isCollected ? 'error' : 'primary'}
        onClick={() => isCollected ? removeFromCollection(pokemon.name) : addToCollection(pokemon)}
        className="min-w-[36px] h-10 text-xl"
      >
        {isCollected ? '×' : '+'}
      </Button>
    </div>
  );
}
