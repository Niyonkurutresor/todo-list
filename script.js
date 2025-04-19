const TodoApp = (() => {
  let todos = [];
  let currentFilter = "all";
  let currentSort = "dueAsc";

  const DOM = {
    form: document.getElementById("todo-form"),
    todoTitle: document.getElementById("todo-title"),
    todoDueDate: document.getElementById("todo-due-date"),
    todosList: document.getElementById("todos-list"),
    emptyState: document.getElementById("empty-state"),
    loadingSpinner: document.getElementById("loading-spinner"),
    todosCount: document.getElementById("todos-count"),
    progressBar: document.getElementById("progress-bar"),
    progressText: document.getElementById("progress-text"),

    sortDueDateAsc: document.getElementById("sort-due-date-asc"),
    sortDueDateDesc: document.getElementById("sort-due-date-desc"),

    filterAll: document.getElementById("filter-all"),
    filterActive: document.getElementById("filter-active"),
    filterCompleted: document.getElementById("filter-completed"),

    editModal: document.getElementById("edit-modal"),
    editForm: document.getElementById("edit-form"),
    editTitle: document.getElementById("edit-title"),
    editDueDate: document.getElementById("edit-due-date"),
    editId: document.getElementById("edit-id"),
    closeModal: document.querySelector(".close-modal"),
  };

  const init = () => {
    setMinDateTimeToNow();
    bindEvents();
    fetchInitialTodos();
  };

  const bindEvents = () => {
    DOM.form.addEventListener("submit", handleFormSubmit);
    DOM.sortDueDateAsc.addEventListener("click", () => setSorting("dueAsc"));
    DOM.sortDueDateDesc.addEventListener("click", () => setSorting("dueDesc"));
    DOM.filterAll.addEventListener("click", () => setFilter("all"));
    DOM.filterActive.addEventListener("click", () => setFilter("active"));
    DOM.filterCompleted.addEventListener("click", () => setFilter("completed"));

    DOM.editForm.addEventListener("submit", handleEditFormSubmit);
    DOM.closeModal.addEventListener("click", closeEditModal);
    window.addEventListener("click", (e) => {
      if (e.target === DOM.editModal) closeEditModal();
    });

    setInterval(setMinDateTimeToNow, 60000);
  };

  const setMinDateTimeToNow = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

    DOM.todoDueDate.min = currentDateTime;

    if (DOM.editDueDate) {
      DOM.editDueDate.min = currentDateTime;
    }
  };

  // fetching initall
  const fetchInitialTodos = async () => {
    try {
      showLoadingState();

      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos?_limit=10"
      );
      if (!response.ok) throw new Error("Something went wrong");

      const data = await response.json();
      // store data in local storage/ (array...)
      todos = data.map((todo) => ({
        id: todo.id.toString(),
        title: todo.title,
        completed: todo.completed,
        dueDateTime: generateRandomFutureDueDate().toISOString(),
      }));

      hideLoadingState();
      renderTodos();
      updateProgressBar();
    } catch (error) {
      console.error("Error fetching todos:", error);
      hideLoadingState();
      showErrorMessage("Failed to load initial todos. Please try again later.");
    }
  };

  const generateRandomFutureDueDate = () => {
    const now = new Date();
    const randomHours = Math.floor(Math.random() * 24 * 7);
    const futureDate = new Date(now.getTime() + randomHours * 60 * 60 * 1000);
    return futureDate;
  };

  const showLoadingState = () => {
    DOM.loadingSpinner.classList.remove("hidden");
    DOM.emptyState.classList.add("hidden");
  };

  const hideLoadingState = () => {
    DOM.loadingSpinner.classList.add("hidden");
  };

  const showErrorMessage = (message) => {
    const errorEl = document.createElement("div");
    errorEl.className = "error-message";
    errorEl.textContent = message;

    DOM.todosList.insertAdjacentElement("beforebegin", errorEl);

    setTimeout(() => {
      errorEl.remove();
    }, 5000);
  };

  /*==============================================\
| form submistion event                           |
 \==============================================*/
  const handleFormSubmit = (e) => {
    e.preventDefault();

    const title = DOM.todoTitle.value.trim();
    const dueDateTime = DOM.todoDueDate.value;

    if (!title) {
      alert("Please enter a task title");
      return;
    }

    if (!dueDateTime) {
      alert("Please select a due date and time");
      return;
    }
    const newTodo = {
      id: Date.now().toString(),
      title,
      dueDateTime: new Date(dueDateTime).toISOString(),
      completed: false,
    };
    todos.unshift(newTodo);
    DOM.form.reset();
    // render todos
    renderTodos();
    updateProgressBar();
  };

  /*==============================================\
| form edit event                                 |
 \==============================================*/
  const handleEditFormSubmit = (e) => {
    e.preventDefault();

    const id = DOM.editId.value;
    const title = DOM.editTitle.value.trim();
    const dueDateTime = DOM.editDueDate.value;

    if (!title || !dueDateTime) {
      alert("Please fill in all fields");
      return;
    }

    const todoIndex = todos.findIndex((todo) => todo.id === id);
    if (todoIndex !== -1) {
      todos[todoIndex].title = title;
      todos[todoIndex].dueDateTime = new Date(dueDateTime).toISOString();

      renderTodos();
      closeEditModal();
    }
  };

  // check/ uncheck
  const toggleTodoCompletion = (id) => {
    const todoIndex = todos.findIndex((todo) => todo.id === id);
    if (todoIndex !== -1) {
      todos[todoIndex].completed = !todos[todoIndex].completed;
      renderTodos();
      updateProgressBar();
    }
  };

  // delete todo
  const deleteTodo = (id) => {
    if (confirm("Are you sure you want to delete this task?")) {
      todos = todos.filter((todo) => todo.id !== id);
      renderTodos();
      updateProgressBar();
    }
  };

  /*==============================================\
| edit model                                      |
 \==============================================*/
  const openEditModal = (id) => {
    const todo = todos.find((todo) => todo.id === id);
    if (!todo) return;

    const dueDate = new Date(todo.dueDateTime);
    const formattedDate = formatDateForInput(dueDate);

    DOM.editTitle.value = todo.title;
    DOM.editDueDate.value = formattedDate;
    DOM.editId.value = todo.id;

    DOM.editModal.classList.add("show");
  };

  // close edit modal

  const closeEditModal = () => {
    DOM.editModal.classList.remove("show");
  };
  /*==============================================\
| sorting and filterin                           |
 \==============================================*/
  const setSorting = (sortType) => {
    currentSort = sortType;

    DOM.sortDueDateAsc.classList.toggle("active", sortType === "dueAsc");
    DOM.sortDueDateDesc.classList.toggle("active", sortType === "dueDesc");

    renderTodos();
  };

  // filter
  const setFilter = (filterType) => {
    currentFilter = filterType;

    DOM.filterAll.classList.toggle("active", filterType === "all");
    DOM.filterActive.classList.toggle("active", filterType === "active");
    DOM.filterCompleted.classList.toggle("active", filterType === "completed");
    renderTodos();
  };

  // apply sort on data
  const sortTodos = (todosToSort) => {
    return [...todosToSort].sort((a, b) => {
      const dateA = new Date(a.dueDateTime);
      const dateB = new Date(b.dueDateTime);

      if (currentSort === "dueAsc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
  };

  // apply firter on data
  const filterTodos = () => {
    switch (currentFilter) {
      case "active":
        return todos.filter((todo) => !todo.completed);
      case "completed":
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  };

  // compl
  const updateProgressBar = () => {
    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;

    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    // Update DOM elements
    DOM.progressBar.style.width = `${percentage}%`;
    DOM.progressText.textContent = `${percentage}% complete`;
    DOM.todosCount.textContent = `(${total})`;
  };

  // format date for datetime input

  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // format date for display
  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow =
      new Date(now.setDate(now.getDate() + 1)).toDateString() ===
      date.toDateString();

    const options = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };

    const timeString = date.toLocaleTimeString([], options);

    if (isToday) {
      return `Today at ${timeString}`;
    } else if (isTomorrow) {
      return `Tomorrow at ${timeString}`;
    } else {
      const dateOptions = {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      };
      return date.toLocaleString([], dateOptions);
    }
  };

  // Check if a date is in past

  const isDatePast = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    return date < now;
  };

  /*==============================================\
| redner filter and sorts                         |
 \==============================================*/
  const renderTodos = () => {
    const filteredTodos = filterTodos();
    const sortedTodos = sortTodos(filteredTodos);

    DOM.todosList.innerHTML = "";
    if (sortedTodos.length === 0) {
      DOM.emptyState.classList.remove("hidden");
      return;
    }

    DOM.emptyState.classList.add("hidden");

    sortedTodos.forEach((todo) => {
      const todoItem = document.createElement("div");
      todoItem.className = `todo-item ${
        todo.completed ? "todo-completed" : ""
      }`;
      todoItem.dataset.id = todo.id;

      const isPastDue = isDatePast(todo.dueDateTime) && !todo.completed;
      todoItem.innerHTML = `
                <input type="checkbox" class="todo-checkbox" ${
                  todo.completed ? "checked" : ""
                }>
                <div class="todo-content">
                    <div class="todo-title">${todo.title}</div>
                    <div class="todo-due-date ${isPastDue ? "overdue" : ""}">
                        ${
                          isPastDue
                            ? '<i class="fas fa-exclamation-circle"></i> '
                            : ""
                        }
                        Due: ${formatDateForDisplay(todo.dueDateTime)}
                    </div>
                </div>
                <div class="todo-actions">
                    <button class="todo-action-btn edit-btn" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="todo-action-btn delete-btn" title="Delete">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
      const checkbox = todoItem.querySelector(".todo-checkbox");
      const editBtn = todoItem.querySelector(".edit-btn");
      const deleteBtn = todoItem.querySelector(".delete-btn");
      checkbox.addEventListener("change", () => {
        toggleTodoCompletion(todo.id);
      });

      editBtn.addEventListener("click", () => {
        openEditModal(todo.id);
      });

      deleteBtn.addEventListener("click", () => {
        deleteTodo(todo.id);
      });

      DOM.todosList.appendChild(todoItem);
    });
  };

  return {
    init,
  };
})();

document.addEventListener("DOMContentLoaded", TodoApp.init);
