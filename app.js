const input = document.getElementById("todo_input");
const btn = document.querySelector(".btn");
const result = document.querySelector(".todo_result");
const error = document.querySelector(".error");
const form = document.querySelector(".form");
let allTodos = [];
let newTodo = {
  id: 0,
  todo: "",
  completed: false,
};
form.addEventListener("submit", (e) => {
  e.preventDefault();
});
const makeLoading = () => {
  result.textContent = "";
  const loading = document.createElement("div");
  loading.classList.add("loading");
  result.style.display = "flex";
  result.style.justifyContent = "center";
  result.style.alignItems = "center";
  result.append(loading);
};

const removeLoading = () => {
  const loading = document.querySelector("loading");
  result.style.display = "block";
  result.style.justifyContent = "";
  result.style.alignItems = "";
  if (loading) {
    loading.style.display = "none";
  }
};
const getTodos = () => {
  makeLoading();
  fetch("https://dummyjson.com/todos?limit=3")
    .then((a) => a.json())
    .then((a) => {
      allTodos.push(...a.todos);
      showTodo(allTodos);
      removeLoading();
    });
};
getTodos();

const showTodo = (allTodos) => {
  if (!allTodos.length) {
    result.textContent = "";
    let noResult = document.createElement("p");
    noResult.textContent = "The ToDo List is Empty. Add some ToDo!";
    result.append(noResult);
    return;
  }
  result.textContent = "";
  allTodos.map((todo) => {
    let todoDiv = document.createElement("div");
    let todoLabel = document.createElement("label");
    todoLabel.setAttribute("for", `${todo.id}`);
    let todoCheckbox = document.createElement("input");
    todoCheckbox.setAttribute("type", "checkbox");
    todoCheckbox.setAttribute("id", `${todo.id}`);
    todoCheckbox.classList.add("hidden");
    todoDiv.classList.add("todo_list");
    let todoList = document.createElement("p");
    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete_btn");
    deleteButton.textContent = "Delete";
    todoList.textContent = todo.todo;
    todoLabel.append(todoList);
    todoDiv.append(todoCheckbox, todoLabel, deleteButton);
    result.append(todoDiv);
    todoLabel.addEventListener("click", () => {
      todoChecked(todo, todoList);
    });
    deleteButton.addEventListener("click", (e) => {
      deleteTodo(todo, allTodos);
    });
  });
};
const todoChecked = (todo, todoList) => {
  todo.completed = true;
  if (todo.completed) {
    todoList.style.textDecoration = "line-through";
  }
};
btn.addEventListener("click", () => {
  if (input.value === "") {
    error.style.display = "block";
    error.style.color = "red";
    error.textContent = "Error! Add some ToDo!";
    input.style.borderColor = "red";
    return;
  }
  input.style.borderColor = "#000";
  error.textContent = "";
  let newTodo = {
    id: allTodos.length + 1,
    todo: input.value,
    completed: false,
    userId: 5,
  };
  addTodo(newTodo);
  input.value = "";
  input.focus();
});
const deleteTodo = (todo, allTodos) => {
  makeLoading();
  fetch(`https://dummyjson.com/todos/${todo.id}`, {
    method: "DELETE",
  })
    .then((a) => a.json())
    .then((a) => {
      if (a.isDeleted) {
        allTodos = allTodos.filter((a) => a.id !== todo.id);
        showTodo(allTodos);
        removeLoading();
      }
    });
};
const addTodo = (newTodo) => {
  makeLoading();
  fetch("https://dummyjson.com/todos/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTodo),
  })
    .then((a) => a.json())
    .then((a) => {
      allTodos.push(newTodo);
      showTodo(allTodos);
      removeLoading();
    });
};
