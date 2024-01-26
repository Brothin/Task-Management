import React from "react";

const Pagination = ({ tasksPerPage, totalTasks, paginate, currentPage }) => {
  const totalPages = Math.ceil(totalTasks / tasksPerPage);

  return (
    <nav>
      <ul className="flex list-none">
        {currentPage > 1 && (
          <li className="mx-1 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 cursor-pointer">
            <button onClick={() => paginate(currentPage - 1)}>Prev</button>
          </li>
        )}

        {[...Array(totalPages).keys()].map((number) => (
          <li
            key={number + 1}
            className={`mx-1 ${
              currentPage === number + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            } px-3 py-1 rounded hover:bg-gray-300 cursor-pointer`}
          >
            <button onClick={() => paginate(number + 1)}>{number + 1}</button>
          </li>
        ))}

        {currentPage < totalPages && (
          <li className="mx-1 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 cursor-pointer">
            <button onClick={() => paginate(currentPage + 1)}>Next</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
