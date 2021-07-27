import * as React from "react";
import ReactMapGL, { Source, FlyToInterpolator } from "react-map-gl";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
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
import { fetchCategories, fetchLocations } from "./utils";
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
      <Routes />
    </QueryClientProvider>
  );
}

/**
 * Router component with header and routes for category pages.
 */
function Routes() {
  const { isLoading, error, data } = useQuery("categories", fetchCategories);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error has occurred: {error.message}</div>;

  return (
    <Router>
      <div className="relative z-20">
        <div className="bg-red-500 h-8"></div>
        <div className="flex items-center justify-center gap-4 sm:gap-32 p-6 bg-opacity-40 bg-white">
          <Link to="/">
            <h1 className="font-bold text-xl w-full md:w-max uppercase">
              Harta diasporei <br /> din Berlin
            </h1>
          </Link>
          <a className="w-32" href="https://diasporacivica.berlin">
            <img alt="Logo of Diaspora Civica Berlin" src={dcbLogo} />
          </a>
        </div>
      </div>
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
  const [selectedCategory, setSelectedCategory] = React.useState(null);
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

  function onSelectCategory(category) {
    category.pk == 0
      ? setSelectedCategory(null)
      : setSelectedCategory(category);
  }

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
      <div className="absolute inset-0">
        <ModalMap data={locationData} category={selectedCategory} />
        <div className="absolute bottom-20 right-0">
          <Select data={categoryData} onSelect={onSelectCategory} />
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
function Map({ locations, onClick }) {
  const [viewport, setViewport] = React.useState({
    latitude: 52.518008,
    longitude: 13.390954,
    zoom: 11.1,
  });

  function onSelectPin(feature) {
    onClick(feature);
    setViewport({
      ...viewport,
      longitude: feature.geometry.coordinates[0],
      latitude: feature.geometry.coordinates[1] - 0.001,
      zoom: 13,
      transitionDuration: 1500,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: easeCubic,
    });
  }

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
        <Pins data={pinData.features} onClick={onSelectPin} />
      </Source>
    </ReactMapGL>
  );
}

/**
 * Modal for showing information about a specific POI.
 * @param {object} selectedLocation The POI data.
 * @param {function} onClose Callback to be executed when the modal is closed.
 */
function POIModal({ selectedLocation, onClose }) {
  const dialogTitleRef = React.useRef(null);
  return (
    <Dialog
      as="div"
      className="fixed inset-0 z-40 overflow-y-auto"
      onClose={onClose}
      open={!!selectedLocation}
      initialFocus={dialogTitleRef}
    >
      <Transition
        appear
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        show={!!selectedLocation}
        as={React.Fragment}
      >
        <div className="min-h-screen">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
          >
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>

          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
          >
            <div className="inline-block w-full max-h-80 sm:max-h-auto p-6 my-0 text-left align-bottom transition-all transform bg-white shadow-xl overflow-y-scroll sm:overflow-hidden mt-4 sm:p-10">
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
                      {selectedLocation?.category?.label_singular}
                    </span>
                    <div>{selectedLocation?.name}</div>
                  </div>
                  <div className="flex">
                    <XCircleIcon
                      type="button"
                      className="cursor-pointer justify-center h-8 w-8 hover:text-red-500 text-gray-500 focus:outline-none"
                      onClick={onClose}
                    />
                  </div>
                </div>
              </Dialog.Title>

              <div className="mt-4 text-md">
                {selectedLocation?.address && (
                  <div className="flex items-center font-semibold text-gray-600">
                    <LocationMarkerIcon className="flex-none inline h-5 w-5 mr-2" />
                    <div>{selectedLocation.address}</div>
                  </div>
                )}
                {selectedLocation?.email && (
                  <div className="flex items-center">
                    <MailIcon className="flex-none h-5 w-5 mr-2 text-gray-600" />
                    <a
                      href={`mailto://${selectedLocation.email}`}
                      className="text-blue-600"
                    >
                      {selectedLocation.email}
                    </a>
                  </div>
                )}
                {selectedLocation?.phone && (
                  <div className="flex items-center text-gray-600">
                    <PhoneIcon className="flex-none h-5 w-5 mr-2" />
                    <div>{selectedLocation.phone}</div>
                  </div>
                )}
                {selectedLocation?.website && (
                  <div className="flex items-center">
                    <LinkIcon className="flex-none h-5 w-5 mr-2 text-gray-600" />
                    <a
                      href={selectedLocation.website}
                      className="text-blue-600"
                    >
                      {selectedLocation.website}
                    </a>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <p className="text-lg">{selectedLocation?.description}</p>
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
 */
function ModalMap({ data, category }) {
  const [features, setFeatures] = React.useState(data.features);
  const [selectedLocation, setSelectedLocation] = React.useState(null);
  React.useEffect(() => {
    const newFeatures = !category
      ? data.features
      : data.features.filter(
          (feature) => feature.properties.category.pk == category.pk
        );
    setFeatures(newFeatures);
  }, [category]);

  return (
    <>
      <Map
        height="100%"
        locations={{ ...data, features }}
        onClick={(feature) => setSelectedLocation(feature.properties)}
      />
      <POIModal
        selectedLocation={selectedLocation}
        onClose={() => setSelectedLocation(null)}
      />
    </>
  );
}

export default App;
