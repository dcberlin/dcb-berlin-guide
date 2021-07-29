import * as React from "react";
import ReactMapGL, { Source, FlyToInterpolator } from "react-map-gl";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { Dialog, Transition } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/outline";
import {
  LocationMarkerIcon,
  LinkIcon,
  MailIcon,
  PhoneIcon,
} from "@heroicons/react/solid";
import { easeCubic } from "d3-ease";

import { MAPBOX_TOKEN } from "./constants";
import { fetchCategories, fetchLocations, useQueryParams } from "./utils";
import {
  CategoryProvider,
  useCategory,
  LocationProvider,
  useLocation,
} from "./contexts";
import Pins from "./Pins";
import Select from "./Select";
import dcbLogo from "./images/dcbLogo.png";

import "./App.css";

const queryClient = new QueryClient();

/**
 * Root component. Contains the router wrapped by React Query provider.
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CategoryProvider>
        <LocationProvider>
          <Routes />
        </LocationProvider>
      </CategoryProvider>
    </QueryClientProvider>
  );
}

/**
 * Router component with header and routes for category pages.
 */
function Routes() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

/**
 * Landing page, containing the map with all POIs and buttons leading to category pages.
 */
function Home() {
  const [category, setCategory] = useCategory();
  const [location, setLocation] = useLocation();
  const history = useHistory();
  const query = useQueryParams();

  const queryCategorySlug = query.get("category");
  const queryLocationPk = query.get("location");

  const {
    isLoading: categoryIsLoading,
    error: categoryError,
    data: categoryData,
  } = useQuery("categories", fetchCategories);
  const {
    isLoading: locationIsLoading,
    error: locationError,
    data: locationData,
  } = useQuery("locations", fetchLocations);

  /* Update query strings according to state */

  React.useEffect(() => {
    if (category) {
      query.set("category", category.name_slug);
    } else if (!category || !queryCategorySlug) {
      query.delete("category");
    }
    history.push({ search: query.toString() });
  }, [category, queryCategorySlug]); //eslint-disable-line
  React.useEffect(() => {
    if (location) {
      query.set("location", location.properties.pk);
    } else if (!location || !queryLocationPk) {
      query.delete("location");
    }
    history.push({ search: query.toString() });
  }, [location]); //eslint-disable-line

  /* Update state according to query strings */

  React.useEffect(() => {
    if (queryCategorySlug && categoryData) {
      setCategory(
        categoryData.filter(
          (category) => category.name_slug === queryCategorySlug
        )[0]
      );
    }
  }, [queryCategorySlug, categoryData]); //eslint-disable-line
  React.useEffect(() => {
    if (queryLocationPk && locationData) {
      setLocation(
        locationData.features.filter(
          (location) => location.properties.pk === Number(queryLocationPk)
        )[0]
      );
    }
  }, [queryLocationPk, locationData]); //eslint-disable-line

  if (locationIsLoading || categoryIsLoading) return <div>Loading...</div>;
  if (locationError || categoryError)
    return (
      <div>
        An error has occurred:{" "}
        {locationError?.message || categoryError?.message}
      </div>
    );

  return (
    <>
      <div
        className={`relative z-20 transition duration-300 delay-100 ease-in-out opacity-${
          !location ? 100 : 0
        }`}
      >
        <div className="bg-red-500 h-8"></div>
        <div className="flex items-center justify-center gap-4 sm:gap-32 p-6 bg-opacity-40 bg-white">
          <h1 className="font-bold text-xl w-full md:w-max uppercase">
            Harta diasporei <br /> din Berlin
          </h1>
          <a className="w-32" href="https://diasporacivica.berlin">
            <img alt="Logo of Diaspora Civica Berlin" src={dcbLogo} />
          </a>
        </div>
      </div>
      <div className="absolute inset-0">
        <ModalMap data={locationData} category={category} />
        <div className="absolute bottom-20 right-0">
          <Select data={categoryData} />
        </div>
      </div>
    </>
  );
}

/**
 * Map with POIs. The viewport is set to frame the central part of Berlin.
 * @param {object} locations The POI data as GeoJSON object.
 * @param {function} onClick Callback for a click event on a pin.
 */
function Map({ locations }) {
  const [viewport, setViewport] = React.useState({
    latitude: 52.518008,
    longitude: 13.390954,
    zoom: 11.1,
  });
  const [location, setLocation] = useLocation();

  React.useEffect(() => {
    location &&
      setViewport({
        ...viewport,
        longitude: location.geometry.coordinates[0],
        latitude: location.geometry.coordinates[1] - 0.006,
        zoom: 13,
        transitionDuration: 1500,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: easeCubic,
      });
  }, [location]); //eslint-disable-line

  let pinData = {};
  if (locations.features) {
    pinData = {
      ...locations,
      features: locations.features.filter((feature) => feature.geometry),
    };
  }

  return (
    <ReactMapGL
      {...viewport}
      width="100%"
      height="100vh"
      onViewportChange={setViewport}
      mapboxApiAccessToken={MAPBOX_TOKEN}
    >
      <Source id="my-data" type="geojson" data={pinData}>
        <Pins
          data={pinData.features}
          onClick={(location) => setLocation(location)}
        />
      </Source>
    </ReactMapGL>
  );
}

/**
 * Modal for showing information about a specific POI.
 * @param {object} selectedLocation The POI data.
 * @param {function} onClose Callback to be executed when the modal is closed.
 */
function POIModal() {
  const dialogTitleRef = React.useRef(null);
  const [location, setLocation] = useLocation();
  const { category, name, email, website, address, description, phone } =
    location?.properties || {};
  return (
    <Dialog
      as="div"
      className="fixed bottom-0 z-40 overflow-y-auto"
      onClose={() => setLocation(null)}
      open={!!location}
      initialFocus={dialogTitleRef}
    >
      <Transition
        appear
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        show={!!location}
        as={React.Fragment}
      >
        <div>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
          >
            <div className="w-screen max-h-100 sm:max-h-auto p-6 my-0 text-left align-bottom transition-all transform bg-white shadow-xl overflow-y-scroll sm:overflow-hidden mt-4 sm:p-10">
              <Dialog.Title
                as="h3"
                className="text-xl font-bold font-medium leading-6 text-gray-900"
              >
                <div
                  className="flex cols-2 justify-between"
                  ref={dialogTitleRef}
                >
                  <div>
                    <span className="font-semibold text-sm uppercase text-gray-500">
                      {category?.label_singular}
                    </span>
                    <div>{name}</div>
                  </div>
                  <div className="flex">
                    <XCircleIcon
                      type="button"
                      className="cursor-pointer justify-center h-8 w-8 hover:text-red-500 text-gray-500 focus:outline-none"
                      onClick={() => setLocation(null)}
                    />
                  </div>
                </div>
              </Dialog.Title>

              <div className="mt-4 text-md">
                {address && (
                  <div className="flex items-center font-semibold text-gray-600">
                    <LocationMarkerIcon className="flex-none inline h-5 w-5 mr-2" />
                    <div>{address}</div>
                  </div>
                )}
                {email && (
                  <div className="flex items-center">
                    <MailIcon className="flex-none h-5 w-5 mr-2 text-gray-600" />
                    <a href={`mailto://${email}`} className="text-blue-600">
                      {email}
                    </a>
                  </div>
                )}
                {phone && (
                  <div className="flex items-center text-gray-600">
                    <PhoneIcon className="flex-none h-5 w-5 mr-2" />
                    <div>{phone}</div>
                  </div>
                )}
                {website && (
                  <div className="flex items-center">
                    <LinkIcon className="flex-none h-5 w-5 mr-2 text-gray-600" />
                    <a href={website} className="text-blue-600">
                      {website}
                    </a>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <p className="text-lg">{description}</p>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Transition>
    </Dialog>
  );
}

/**
 * Map which displays a small modal with POI details when a pin is clicked.
 * @param {object} data The POI data as GeoJSON object.
 * @param {object} category The selected category.
 * @param {function} onSelectLocation Callback for a location change event.
 */
function ModalMap({ data }) {
  const [features, setFeatures] = React.useState(data.features);
  const [category] = useCategory();

  React.useEffect(() => {
    if (!category || category.pk === 0) {
      setFeatures(data.features);
    } else {
      setFeatures(
        data.features.filter(
          (feature) => feature.properties.category.pk === category.pk
        )
      );
    }
  }, [category, data.features]);

  return (
    <>
      <Map locations={{ ...data, features }} />
      <POIModal />
    </>
  );
}

export default App;
