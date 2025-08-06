import React, { createContext, useContext, useEffect, useState } from 'react';

const CollectionContext = createContext();

export const CollectionProvider = ({ children }) => {
  const [collection, setCollection] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('myCollection');
    if (saved) {
      setCollection(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('myCollection', JSON.stringify(collection));
  }, [collection]);

  const addToCollection = (pokemon) => {
    if (!collection.some(p => p.name === pokemon.name)) {
      setCollection([...collection, pokemon]);
    }
  };

  const removeFromCollection = (name) => {
    setCollection(collection.filter(p => p.name !== name));
  };

  return (
    <CollectionContext.Provider value={{ collection, addToCollection, removeFromCollection }}>
      {children}
    </CollectionContext.Provider>
  );
};

export const useCollection = () => useContext(CollectionContext);
