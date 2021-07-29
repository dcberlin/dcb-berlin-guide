import * as React from "react";

/* Location */

const LocationContext = React.createContext();

function useLocation() {
  const context = React.useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}

function LocationProvider(props) {
  const [location, setLocation] = React.useState(null);
  const value = React.useMemo(() => [location, setLocation], [location]);
  return <LocationContext.Provider value={value} {...props} />;
}

/* Category */

const CategoryContext = React.createContext();

function useCategory() {
  const context = React.useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }
  return context;
}

function CategoryProvider(props) {
  const [category, setCategory] = React.useState(null);
  const value = React.useMemo(() => [category, setCategory], [category]);
  return <CategoryContext.Provider value={value} {...props} />;
}

export { useLocation, LocationProvider, useCategory, CategoryProvider };
