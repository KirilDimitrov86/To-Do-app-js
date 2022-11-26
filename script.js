const addToDoBtn = document.getElementById("add-to-do-btn");
const toDoInput = document.getElementsByTagName("input")[0];
const toDoInProgres = document.querySelector("#to-do-in-progres");
const toDoCompleted = document.querySelector("#to-do-completed");
const selectToDoMode = document.getElementById("chose-mode");

let localToDos = [];
let remoteToDos = [];
let workToDos = [];

function addToDo() {
  const validText = toDoInput.value.trim();
  if (validText) {
    const newToDoObj = {
      title: validText,
      completed: false,
    };
    localToDos.push(newToDoObj);
    if (selectToDoMode.value === "local") {
      workToDos = [...localToDos];
    }
    renderToDos();
    toDoInput.value = "";
  } else {
    alert("Please type in some text");
  }
}

function renderToDos() {
  toDoInProgres.innerHTML = "";
  toDoCompleted.innerHTML = "";

  workToDos.forEach((todo) => {
    const newToDoElement = createToDoElement(todo);
    if (todo.completed) {
      toDoCompleted.appendChild(newToDoElement);
    } else {
      toDoInProgres.appendChild(newToDoElement);
    }
  });
}

function createToDoElement(todoObj) {
  const divElement = document.createElement("div");
  divElement.classList.add("to-do-instance");

  const pElement = document.createElement("p");
  pElement.textContent = todoObj.title;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.addEventListener("click", () => {
    workToDos = workToDos.filter((el) => el.title !== todoObj.title);
    divElement.remove();
  });

  const checkbox = document.createElement("input");
  checkbox.classList.add("checkbox");
  checkbox.setAttribute("type", "checkbox");
  checkbox.checked = todoObj.completed;
  checkbox.addEventListener("click", () => {
    todoObj.completed = !todoObj.completed;
    renderToDos();
  });

  divElement.appendChild(pElement);
  divElement.appendChild(checkbox);
  divElement.appendChild(deleteBtn);

  return divElement;
}

async function fetchRemoteToDos() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
}

async function randomToDos() {
  const allToDos = await fetchRemoteToDos();
  const tenRandomToDos = [];
  for (let i = 0; i < 10; i++) {
    const randomNumber = Math.round(Math.random() * (200 - 0) + 0);
    tenRandomToDos.push(allToDos[randomNumber]);
  }
  return tenRandomToDos;
}

addToDoBtn.addEventListener("click", addToDo);
toDoInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    addToDo();
  }
});

selectToDoMode.addEventListener("input", async (event) => {
  let select = event.target;
  if (select.value === "local") {
    remoteToDos = [...workToDos];
    workToDos = [...localToDos];
    renderToDos();
  } else {
    localToDos = [...workToDos];
    if (remoteToDos.length === 0) {
      console.log(remoteToDos.length);
      remoteToDos = await randomToDos();
    }
    workToDos = [...remoteToDos];
    renderToDos();
  }
});
