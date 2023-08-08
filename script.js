//Dispara imediatamente após o navegador carregar o objeto.
window.onload = loadTasks;

// Adicionar ouvinte de evento de envio ao formulário(quando o buttom for apertado chama a função addTask())
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  addTask();
});

function loadTasks() {
  // verifica se localStorage tem alguma tarefa
  // caso não retorne
  if (localStorage.getItem("tasks") == null) return;

  //  Obtem as tarefas do localStorage e converta-as em um array, para em seguida os converte em objetos estruturados em JavaScript(JSON.parse)
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  //Percorra as tarefas no array e roda a função para cada elemento, e adiciona-os na lista
  tasks.forEach((task) => {
    const list = document.querySelector("ul");
    const li = document.querySelector("li");
    //usando o operador ternário para determinar se a tarefa está concluída ou não e, em seguida, adicionamos a classe 'concluída' à tarefa.
    li.innerHTML = `<input type="checkbox" onclick="taskComplete(this)" class="check" ${
      task.completed ? "checked" : ""
    }>
          <input type="text" value="${task.task}" class="task ${
      task.completed ? "completed" : ""
    }" onfocus="getCurrentTask(this)" onblur="editTask(this)">
           <span class="material-symbols-outlined" onclick="removeTask(this)"> delete
            </span>`;
    //Insere em list o elemento li antes dos filhos ja existentes de list
    list.insertBefore(li, list.children[0]);
  });
}
function addTask() {
  const task = document.querySelector("form input");
  const list = document.querySelector("ul");

  //Valida se o input esta vazio
  if (task.value === "") {
    alert("Please, add some task!");
    return false;
  }
  // Checa se a task já existe
  if (document.querySelector(`input[value="${task.value}"]`)) {
    alert("Task already exist!");
    return false;
  }

  //Add task no localStorage
  localStorage.setItem(
    "tasks",
    JSON.stringify([
      ...JSON.parse(localStorage.getItem("tasks") || "[]"),
      { task: task.value, completed: false },
    ])
  );

  //criar item de lista, adicionar innerHTML e anexar a ul
  const li = document.createElement("li");
  li.innerHTML = `<input type="checkbox" onclick="taskComplete(this)" class="check">
      <input type="text" value="${task.value}" class="task" onfocus="getCurrentTask(this)" onblur="editTask(this)">
      <span class="material-symbols-outlined" onclick="removeTask(this)"> delete
            </span>`;
  list.insertBefore(li, list.children[0]);
  // Limpar o input
  task.value = "";
}

//marca a tarefa como uma tarefa concluída.
function taskComplete(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.forEach((task) => {
    if (task.task === event.nextElementSibling.value) {
      task.completed = !task.completed;
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  event.nextElementSibling.classList.toggle("completed");
}

function removeTask(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.forEach((task) => {
    if (task.task === event.parentNode.children[1].value) {
      // Apagar task
      tasks.splice(tasks.indexOf(task), 1);
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  event.parentElement.remove();
}

//Armazenar a tarefa atual para rastrear as alterações
var CurrentTask = null;

//Obter tarefa atual(chamada do html)
function getCurrentTask(event) {
  CurrentTask = event.value;
}
//Edite a tarefa e atualize o localStorage
function editTask(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  //Verifica se a tarefa está vazia
  if (event.value === "") {
    alert("Task is empty!");
    event.value = CurrentTask;
    return;
  }
  //Verifica se a tarefa já existe
  tasks.forEach((task) => {
    if (task.task === event.value) {
      alert("Task already exist!");
      event.value = CurrentTask;
      return;
    }
  });
  // update task
  tasks.forEach((task) => {
    if (task.task === CurrentTask) {
      task.task = event.value;
    }
  });
  // Atualizar localStorage
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
