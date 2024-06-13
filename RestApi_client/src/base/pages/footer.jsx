import React from "react";
const students = [
  {
    name: "Avaz Sultanov",
    id: 48213,
  },
  {
    name: "Shomurod Mamadjonov",
    id: 48213,
  },
  {
    name: "Farid Aliyev",
    id: 48213,
  },
  {
    name: "Abai Dyldaev",
    id: 47116,
  },
  {
    name: "Mehmet Kızılkaya",
    id: 39291,
  },
];

export default function Footer() {
  return (
    <>
      <div className="bg-green-200">
        <div className="lg:container w-full mx-auto p-4 flex gap-5 lg:flex-row flex-col items-center">
          <div className="lg:w-1/2">
            <h1 className="text-xl font-bold">About Project</h1>
            <p>
              The dynamic Bid&Won application, developed by skilled students
              from the University of Economics and Human Sciences, enables users
              to engage in vibrant bidding activities. To access the full suite
              of features offered by the app, authorization from the
              administrator is required. Refer to the contact details of the
              project contributors listed below to learn more.
            </p>
          </div>
          <div className="lg:w-1/2 bg-inherit w-full">
            <h1 className="text-xl font-bold">Contact</h1>
            <ul className="bg-inherit">
              {students.map((student) => (
                <li className="w-full flex  justify-between">
                  <div className="flex ">
                    <p>
                      {student.name} ID:{student.id}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
