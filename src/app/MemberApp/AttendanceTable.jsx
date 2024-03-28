import React from "react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

function AttendanceTable({ allDocuments, monthWeeks, selectedMonth, setSelectedMonth }) {
  // Render function for displaying table
  const renderTable = () => {
    return (
      <div className="mt-8 overflow-x-auto shadow-lg rounded-lg">
        <table className="table-auto w-full min-w-max border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-4 text-left text-gray-800">Members</th>
              {monthWeeks.map((week) => (
                <th key={week.weekNumber} className="px-6 py-4 text-center text-gray-800">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold mt-1">
                      {getSundayOfWeek(week.startDate).getDate()}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allDocuments.map((member, index) => (
              <tr key={member.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <td className="border px-6 py-3 font-medium">{member.id}</td>
                {monthWeeks.map((week) => (
                  <td
                    key={week.weekNumber}
                    className={`border px-6 py-3 text-center ${week.members.includes(member.id) ? 'bg-green-500 text-white' : ''}`}
                  >
                    {member.attendance?.[week.weekNumber] && (
                      <span className="text-lg">✓</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    return (
        <div className="container mx-auto pt-5">
          <div className="mb-4 ">
            <Menu
              as="div"
              className="relative inline-block justify-center text-center">
              <div>
                <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                  <h2 className="text-4xl font-bold">
                    {new Date(0, selectedMonth).toLocaleString("default", {
                      month: "long",
                    })}
                  </h2>
                  <ChevronDownIcon
                    className="-mr-1 ml-2 h-10 w-10 text-violet-200 hover:text-violet-100"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95">
                <Menu.Items className="absolute mt-2  origin-top divide-y divide-gray-100 rounded-lg bg-gradient-to-b from-gray-100 to-white shadow-xl ring-1 ring-black/5 focus:outline-none  flex flex-col items-center">
                  {Array.from({ length: 12 }, (_, i) => (
                    <Menu.Item key={i}>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-violet-500 text-white" : "text-gray-900"
                          }  flex flex-col items-center group flex w-full items-center rounded-lg px-4 py-4 text-2xl font-semibold hover:bg-violet-100 transition-colors duration-200 `}
                          onClick={() => setSelectedMonth(i)}>
                          {new Date(0, i).toLocaleString("default", {
                            month: "long",
                          })}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>

          {/* Render the table */}
          {renderTable()}
        </div>
      );
}

export default AttendanceTable;
