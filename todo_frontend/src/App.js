import React, { useState, useRef, useEffect } from "react";
import "./App.css";

// PUBLIC_INTERFACE
function App() {
  // Todo state: [{id, text, completed}], editable todoId
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);       // id of todo in edit mode
  const [editText, setEditText] = useState("");
  const inputRef = useRef(null);
  const editInputRef = useRef(null);

  // Focus add input on mount
  useEffect(() => {
    if (inputRef.current && editId === null) inputRef.current.focus();
  }, [editId]);
  useEffect(() => {
    if (editId !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editId]);

  // PUBLIC_INTERFACE
  function handleAdd(e) {
    e.preventDefault();
    const val = input.trim();
    if (!val) return;
    setTodos([
      ...todos,
      { id: Date.now(), text: val, completed: false }
    ]);
    setInput("");
  }

  // PUBLIC_INTERFACE
  function handleDelete(id) {
    setTodos(todos.filter(todo => todo.id !== id));
    if (editId === id) {
      setEditId(null);
      setEditText("");
    }
  }

  // PUBLIC_INTERFACE
  function handleToggle(id) {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  // PUBLIC_INTERFACE
  function handleEditInit(id, currentText) {
    setEditId(id);
    setEditText(currentText);
  }

  // PUBLIC_INTERFACE
  function handleEditChange(e) {
    setEditText(e.target.value);
  }

  // PUBLIC_INTERFACE
  function handleEditSubmit(e) {
    e.preventDefault();
    if (!editText.trim()) return;
    setTodos(
      todos.map(todo =>
        todo.id === editId ? { ...todo, text: editText.trim() } : todo
      )
    );
    setEditId(null);
    setEditText("");
  }

  // PUBLIC_INTERFACE
  function handleEditCancel() {
    setEditId(null);
    setEditText("");
  }

  // PUBLIC_INTERFACE
  function handleKeyDown(e) {
    if (e.key === "Escape") {
      handleEditCancel();
    }
  }

  return (
    <div className="todo-app-bg">
      <main className="todo-main">
        <h1 className="todo-title">Todo List</h1>
        <form className="todo-add-form" onSubmit={handleAdd}>
          <input
            className="todo-input"
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Add a new todo..."
            aria-label="Add new todo"
            ref={inputRef}
            maxLength={100}
            autoComplete="off"
          />
          <button
            className="todo-btn accent-btn"
            type="submit"
            aria-label="Add"
            disabled={!input.trim()}
          >
            +
          </button>
        </form>
        <ul className="todo-list" aria-label="Todo List">
          {todos.length === 0 && (
            <li className="todo-empty">No todos yet.</li>
          )}
          {todos.map((todo) => (
            <li
              className={
                "todo-item" +
                (todo.completed ? " todo-completed" : "") +
                (editId === todo.id ? " todo-editing" : "")
              }
              key={todo.id}
            >
              {editId === todo.id ? (
                <form
                  className="todo-edit-form"
                  onSubmit={handleEditSubmit}
                  onKeyDown={handleKeyDown}
                >
                  <input
                    className="todo-edit-input"
                    ref={editInputRef}
                    value={editText}
                    maxLength={100}
                    onChange={handleEditChange}
                    aria-label="Edit todo"
                  />
                  <button className="todo-btn primary-btn" type="submit" aria-label="Save Edit">
                    Save
                  </button>
                  <button className="todo-btn secondary-btn" type="button" onClick={handleEditCancel} aria-label="Cancel Edit">
                    Cancel
                  </button>
                </form>
              ) : (
                <div className="todo-row">
                  <button
                    className="todo-chk-btn"
                    aria-label={todo.completed ? "Mark as not completed" : "Mark as completed"}
                    onClick={() => handleToggle(todo.id)}
                    title="Toggle completed"
                  >
                    {todo.completed ?
                      <span className="todo-chk-icon accent-color">&#10003;</span>
                      :
                      <span className="todo-chk-icon"></span>
                    }
                  </button>
                  <span
                    className="todo-text"
                    tabIndex={0}
                    aria-label={todo.text}
                    onDoubleClick={() => handleEditInit(todo.id, todo.text)}
                  >
                    {todo.text}
                  </span>
                  <div className="todo-actions">
                    <button
                      className="todo-btn secondary-btn"
                      onClick={() => handleEditInit(todo.id, todo.text)}
                      aria-label="Edit"
                      title="Edit"
                    >
                      Edit
                    </button>
                    <button
                      className="todo-btn delete-btn"
                      onClick={() => handleDelete(todo.id)}
                      aria-label="Delete"
                      title="Delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
