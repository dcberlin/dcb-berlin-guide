const distinctColors = [
  "#a6cee3",
  "#1f78b4",
  "#b2df8a",
  "#33a02c",
  "#fb9a99",
  "#e31a1c",
  "#fdbf6f",
  "#ff7f00",
  "#cab2d6",
  "#6a3d9a",
  "#ffff99",
  "#b15928",
  "#000000",
  "#ff00d7",
];

const CATEGORY_COLOR_MAP = {};

distinctColors.forEach(
  (color, index) => (CATEGORY_COLOR_MAP[index + 1] = color)
);

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const API_URL = process.env.REACT_APP_API_URL;
const ENDPOINTS = {
  LOCATIONS: `${API_URL}/api/locations/`,
  CATEGORIES: `${API_URL}/api/categories/`,
}
export { CATEGORY_COLOR_MAP, MAPBOX_TOKEN, API_URL, ENDPOINTS };
