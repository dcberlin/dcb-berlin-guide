import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/solid";

export default function Select({ data, onSelect }) {
  const [selected, setSelected] = useState(data[0]);
  function onChange(item) {
    setSelected(item);
    onSelect(item);
  }

  return (
    <Listbox value={selected} onChange={onChange}>
      {({ open }) => (
        <div className="mt-1">
          <Listbox.Button className="relative w-56 py-4 pl-6 pr-10 text-left bg-white shadow-md cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
            <span className="block truncate uppercase text-sm font-semibold">
              {selected.label_plural}
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            show={open}
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Listbox.Options className="fixed bottom-20 py-1 mt-1 overflow-auto text-base bg-white shadow-lg max-h-100 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {data.map((item, itemIdx) => (
                <Listbox.Option
                  key={itemIdx}
                  className={({ selected, active }) =>
                    `${
                      selected || active
                        ? "text-black bg-red-50"
                        : "text-gray-700"
                    }
                            cursor-pointer select-none relative py-2 pl-10 pr-4`
                  }
                  value={item}
                >
                  {({ selected, active }) => (
                    <>
                      <span className="uppercase text-sm font-semibold">
                        {item.label_plural}
                      </span>
                      {selected ? (
                        <span className="text-red-600 absolute inset-y-0 left-0 flex items-center pl-3">
                          <CheckIcon className="w-5 h-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
}