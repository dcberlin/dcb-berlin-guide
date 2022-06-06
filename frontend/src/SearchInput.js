import * as React from "react";
import {
  SearchIcon,
} from "@heroicons/react/solid";
import { useQueryClient } from "react-query";
import { fetchLocations, useQueryParams } from "./utils";
import { useSearchPhrase } from "./contexts";


export default function SearchInput() {
  const [searchPhrase, setSearchPhrase] = useSearchPhrase();
  const queryClient = useQueryClient()

  React.useEffect(() => {
    queryClient.invalidateQueries("locations")
    console.log(searchPhrase)
  }, [searchPhrase])

  function onChange(e) {
    setSearchPhrase(e.target.value);
    e.preventDefault();
  };
	return (
    <div className="flex fixed right-0 bottom-36 p-2 text-left bg-white shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 text-md rounded-l-2xl">
      <SearchIcon className="flex-none h-5 w-5 mr-2 text-gray-600" />
      <input
        type="text"
        value={searchPhrase}
        onChange={onChange}
      />
    </div>
  )
}
