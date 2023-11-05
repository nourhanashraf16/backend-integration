import { useEffect, useState } from "react";
import { instanceAxios } from "../config/axiosConfig";

const Todolist = () => {
  const [todos, setTodos] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Function to debounce the search
  const debounce = (func, delay) => {
    let timeoutId;
    return function () {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, arguments);
      }, delay);
    };
  };

  const performSearch = async () => {
    try {
      const response = await instanceAxios.get(`/todos?q=${searchTerm}`);
      setTodos(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Create a debounced search function with a delay of 500ms
  const debouncedSearch = debounce(performSearch, 500);

  // useEffect to listen for changes in searchTerm
  useEffect(() => {
    debouncedSearch();
  }, [searchTerm]);

  ////////////////////////////////////////////////////////
  const handleChange = (e) => {
    console.log(e.target.value);
    setTaskName(e.target.value);
  };

  const handleDelete = (id) => {
    instanceAxios.delete(`/todos/${id}`).then((res) => {
      console.log("Todo deleted successfully");
      getTodos();
    });
  };
  const handleEdit = (todo) => {
    instanceAxios
      .patch(`/todos/${todo.id}`, {
        isCompleted: false,
      })
      .then(() => {
        getTodos();
      });
  };
  const handleDone = (todo) => {
    instanceAxios
      .patch(`/todos/${todo.id}`, {
        isCompleted: true,
      })
      .then(() => {
        getTodos();
      });
  };

  const addTask = async (e) => {
    e.preventDefault();
    instanceAxios
      .post("/todos", {
        taskName,
        isCompleted: false,
      })
      .then((res) => {
        console.log(res.data);
        getTodos();
      });
    setTaskName("");
  };
  const getTodos = () => {
    instanceAxios.get("/todos").then((res) => {
      console.log(res.data);
      setTodos(res.data);
    });
  };
  useEffect(() => {
    getTodos();
  }, []);

  // const handleSearch = (e) => {
  //   // console.log(e.target);
  //   setSearchTerm(e.target.value);
  //   // console.log(searchTerm);
  //   const searchValue = e.target.value;
  //   instanceAxios.get(`/todos?q=${searchValue}`).then((res) => {
  //     console.log(res.data);
  //     setTodos(res.data);
  //   });
  // };
  return (
    <div className="todolist">
      <div className="search" onSubmit={addTask}>
        <input
          type="text"
          placeholder="Search ex: todo 1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <form className="addTask" onSubmit={addTask}>
        <input
          type="text"
          onChange={handleChange}
          value={taskName}
          placeholder="Add a task........"
        />
        <button className="addtask-btn">Add Task</button>
      </form>
      <div className="lists">
        {todos?.map((todo, id) => (
          <div
            key={id}
            className={`list ${todo.isCompleted ? "completed" : ""}`}
          >
            <p> {todo.taskName}</p>
            <div className="span-btns">
              {!todo.isCompleted && (
                <span onClick={() => handleDone(todo)} title="completed">
                  ✓
                </span>
              )}
              <span
                className="delete-btn"
                onClick={() => handleDelete(todo.id)}
                title="delete"
              >
                x
              </span>
              <span
                className="edit-btn"
                onClick={() => handleEdit(todo)}
                title="edit"
              >
                ↻
              </span>
            </div>
          </div>
        ))}
        {!todos?.length && <h1>No Records</h1>}
      </div>
    </div>
  );
};

export default Todolist;
