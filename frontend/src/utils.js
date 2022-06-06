import { useLocation } from "react-router-dom";
import { ENDPOINTS } from "./constants";

const fetchCategories = () =>
  fetch(ENDPOINTS.CATEGORIES).then((res) => res.json());
const fetchLocations = ({search = ""}) =>
  fetch(`${ENDPOINTS.LOCATIONS}?search=${search}`).then((res) => res.json());
const useQueryParams = () => new URLSearchParams(useLocation().search);

export { fetchCategories, fetchLocations, useQueryParams };
