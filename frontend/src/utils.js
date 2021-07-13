import { ENDPOINTS } from "./constants";

const fetchCategories = () => fetch(ENDPOINTS.CATEGORIES).then((res) => res.json());
const fetchLocations = () => fetch(ENDPOINTS.LOCATIONS).then((res) => res.json());

export { fetchCategories, fetchLocations };
