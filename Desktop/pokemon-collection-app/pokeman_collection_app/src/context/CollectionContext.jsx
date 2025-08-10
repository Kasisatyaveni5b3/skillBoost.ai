import React, { createContext, useContext, useEffect, useState } from 'react';

const CollectionContext = createContext();

export const useCollection = () => useContext(CollectionContext);

 function CollectionProvider({ children }) {
  const [collection, setCollection] = useState([]);

  // 🔁 Load collection from localStorage on first mount
useEffect(() => {
  const stored = localStorage.getItem("pokemon-collection");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      setCollection(parsed);
      console.log("📦 Loaded collection from localStorage:", parsed);
    } catch (e) {
      console.error("⚠️ Failed to parse collection:", e);
    }
  }
}, []);


  // 💾 Save to localStorage whenever collection updates
  useEffect(() => {
    localStorage.setItem('myCollection', JSON.stringify(collection));
    console.log('🔄 Saved collection to localStorage:', collection);
  }, [collection]);

  // ➕ Add a Pokémon
const addToCollection = (pokemon) => {
  const normalized = normalizePokemon(pokemon);
  const updated = [...collection, normalized];
  setCollection(updated);
  localStorage.setItem("pokemon-collection", JSON.stringify(updated));
};


const normalizePokemon = (pokemon) => {
  const hp = pokemon.stats?.find(s => s.stat.name === "hp")?.base_stat ?? 0;
  const attack = pokemon.stats?.find(s => s.stat.name === "attack")?.base_stat ?? 0;
  const defense = pokemon.stats?.find(s => s.stat.name === "defense")?.base_stat ?? 0;
  const image = pokemon.sprites?.other?.["official-artwork"]?.front_default;

  return {
    name: pokemon.name,
    types: pokemon.types?.map(t => t.type.name) ?? [],
    stats: { hp, attack, defense },
    image,
  };
};


  // ➖ Remove a Pokémon
  const removeFromCollection = (name) => {
    setCollection(prev => prev.filter(p => p.name !== name));
  };

  // 🔄 Reorder collection
  const reorderCollection = (newOrder) => {
    setCollection(newOrder);
  };

  return (
    <CollectionContext.Provider value={{
      collection,
      addToCollection,
      removeFromCollection,
      reorderCollection
    }}>
      {children}
    </CollectionContext.Provider>
  );
}


// At the bottom
export { CollectionProvider };

