import * as React from "react";
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { LocationMarkerIcon, MapIcon } from "@heroicons/react/solid";

import { CATEGORY_COLOR_MAP } from "./constants";
import { useCategory } from "./contexts";

export default function Select({ data }) {
  const categories = [{ pk: 0, label_plural: "Toate Categoriile" }, ...data];
  const [category, setCategory] = useCategory();
  const [selected, setSelected] = useState(category || categories[0]);
  React.useEffect(() => category && setSelected(category), [category]);
  function onChange(item) {
    setCategory(item);
    setSelected(item);
  }

  return (
    <Listbox value={selected} onChange={onChange}>
      {({ open }) => (
        <div className="mt-1">
          <Listbox.Button className="relative w-56 py-4 pl-6 pr-10 text-left bg-white shadow-md cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm rounded-l-2xl">
            <span className="truncate uppercase text-sm font-semibold pl-4">
              {selected.label_plural}
            </span>
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              {selected.pk !== 0 ? (
                <LocationMarkerIcon
                  className="w-5 h-5"
                  aria-hidden="true"
                  style={{ color: CATEGORY_COLOR_MAP[selected.pk] }}
                />
              ) : (
                <MapIcon className="w-5 h-5 text-gray-700" aria-hidden="true" />
              )}
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            show={open}
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Listbox.Options className="fixed bottom-20 py-1 mt-1 overflow-auto text-base bg-white shadow-lg max-h-90 z-20 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm rounded-l-2xl">
              {categories.map((item, itemIdx) => (
                <Listbox.Option
                  key={itemIdx}
                  className={({ selected, active }) =>
                    `${
                      selected || active
                        ? "text-black bg-gray-100"
                        : "text-gray-500"
                    }
                            cursor-pointer select-none relative py-2 pl-10 pr-4`
                  }
                  value={item}
                >
                  <span className="uppercase text-sm font-semibold">
                    {item.label_plural}
                  </span>
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    {item.pk !== 0 ? (
                      <LocationMarkerIcon
                        className="w-5 h-5"
                        aria-hidden="true"
                        style={{ color: CATEGORY_COLOR_MAP[item.pk] }}
                      />
                    ) : (
                      <MapIcon
                        className="w-5 h-5 text-gray-700"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
}
