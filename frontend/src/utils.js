import { useLocation } from "react-router-dom";
import { ENDPOINTS } from "./constants";

const fetchCategories = () =>
  fetch(ENDPOINTS.CATEGORIES).then((res) => res.json());
const fetchLocations = () =>
  fetch(ENDPOINTS.LOCATIONS).then((res) => res.json());
const useQueryParams = () => new URLSearchParams(useLocation().search);

export { fetchCategories, fetchLocations, useQueryParams };
