import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import api from "../../components/utils/api";
import TasksGrid from "./components/TasksGrid";
import Pagination from "./components/Pagination";

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPageInput, setTasksPerPageInput] = useState("");
  const [tasksPerPage, setTasksPerPage] = useState(20);
  const [tasksPerPageError, setTasksPerPageError] = useState(false);

  const getTasks = async () => {
    try {
      const { data } = await api.get("/api/tasks");
      console.log(data);
      setTasks(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    if (searchQuery.trim() === "") {
      setFilteredTasks(tasks);
    } else {
      const filtered = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTasks(filtered);
    }
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleTasksPerPageChange = () => {
    const inputValue = parseInt(tasksPerPageInput, 10);
    if (!inputValue || inputValue <= 0) {
      setTasksPerPageError(true);
    } else {
      setTasksPerPageError(false);
      setTasksPerPage(inputValue);
    }
  };

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const [username, setUsername] = useState();
  useEffect(() => {
    const token = JSON.parse(
      localStorage.getItem("mern-task-management/user")
    )?.accessToken;
    setUsername(jwt_decode(token)?.username);
    getTasks();
  }, [navigate]);

  useEffect(() => {
    filterTasks();
  }, [searchQuery, tasks, currentPage, tasksPerPage]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center">
        <h3>Greetings {username}</h3>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="ml-4 p-2 border border-gray-300 rounded flex"
        />
        <button
          className="btn btn-primary"
          onClick={() => navigate("/new_task")}
        >
          Add Task
        </button>
      </div>
      <div>
        <p className="text-dark-2">
          Here are your tasks for today. Best of luck!
        </p>
        <div className="flex justify-center mt-2">
          <label className="mr-2 my-2">Tasks per page:</label>
          <input
            type="number"
            min="1"
            value={tasksPerPageInput}
            onChange={(e) => setTasksPerPageInput(e.target.value)}
            className={`p-2 border border-gray-300 rounded mr-2 ${
              tasksPerPageError ? "border-red-500" : ""
            }`}
          />
          <button
            className="btn btn-primary"
            onClick={handleTasksPerPageChange}
          >
            Apply
          </button>
        </div>
        {tasksPerPageError && (
          <p className="text-red-500 mt-2 flex justify-center">
            Value cannot be 0 or empty
          </p>
        )}
        <TasksGrid tasks={currentTasks} loading={loading} />
        <div className="flex justify-center mt-4">
          <Pagination
            tasksPerPage={tasksPerPage}
            totalTasks={filteredTasks.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
