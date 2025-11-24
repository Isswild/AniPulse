import { createContext, useContext, useEffect, useState } from "react";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  // Load from localStorage once on first render
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem("animu-favorites");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Error loading favorites", e);
      return [];
    }
  });

  // Save to localStorage any time favorites change
  useEffect(() => {
    localStorage.setItem("animu-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (anime) => {
    setFavorites((prev) => {
      // avoid duplicates by id (e.g. mal_id)
      if (prev.some((a) => a.mal_id === anime.mal_id)) return prev;
      return [...prev, anime];
    });
  };

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((a) => a.mal_id !== id));
  };

  const isFavorite = (id) => favorites.some((a) => a.mal_id === id);

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
