// ===== キー =====
function subjectKey(i, j) {
  return `subject-${i}-${j}`;
}

function taskKey(i, j) {
  return `task-${i}-${j}`;
}

const tbody = document.getElementById("tbody");

// ===== 時間割生成 =====
for (let i = 0; i < 4; i++) {

  const row = document.createElement("tr");

  // 時限
  const th = document.createElement("th");
  th.textContent = `${i + 1}限`;
  row.appendChild(th);

  for (let j = 0; j < 5; j++) {

    const td = document.createElement("td");

    // ===== 授業名 =====
    const subjectInput = document.createElement("input");
    subjectInput.className = "subject-input";
    subjectInput.placeholder = "授業名";

    const savedSubject = localStorage.getItem(subjectKey(i, j));

    if (savedSubject) {
      subjectInput.value = savedSubject;
    }

    // Enterで保存
    subjectInput.addEventListener("keydown", (e) => {

      if (e.key === "Enter") {

        localStorage.setItem(
          subjectKey(i, j),
          subjectInput.value
        );

        subjectInput.blur();
      }
    });

    // ===== 課題名入力 =====
    const taskInput = document.createElement("input");
    taskInput.className = "task-input";
    taskInput.placeholder = "課題名";

    // ===== 締切入力 =====
    const deadlineInput = document.createElement("input");
    deadlineInput.type = "datetime-local";
    deadlineInput.className = "deadline-input";

    // ===== Enter説明 =====
    const enterText = document.createElement("div");
    enterText.className = "enter-text";
    enterText.textContent = "Enterで追加";

    // ===== 課題表示エリア =====
    const cellDiv = document.createElement("div");
    cellDiv.className = "cell";

    // ===== Enterで課題追加 =====
    taskInput.addEventListener("keydown", (e) => {

      if (e.key === "Enter") {

        const name = taskInput.value;
        const deadline = deadlineInput.value;

        if (!name || !deadline) return;

        const taskData = {
          name,
          deadline,
          completed: false
        };

        // 保存
        const tasks =
          JSON.parse(localStorage.getItem(taskKey(i, j)) || "[]");

        tasks.push(taskData);

        localStorage.setItem(
          taskKey(i, j),
          JSON.stringify(tasks)
        );

        // 表示
        createTask(cellDiv, taskData, i, j);

        // リセット
        taskInput.value = "";
        deadlineInput.value = "";
      }
    });

    // ===== 要素追加 =====
    td.appendChild(subjectInput);
    td.appendChild(taskInput);
    td.appendChild(deadlineInput);
    td.appendChild(enterText);
    td.appendChild(cellDiv);

    row.appendChild(td);

    // 保存課題読み込み
    loadTasks(cellDiv, i, j);
  }

  tbody.appendChild(row);
}

function createTask(cell, data, i, j) {

  const taskDiv = document.createElement("div");
  taskDiv.className = "task";
  if (data.completed) {
    taskDiv.classList.add("done");
  }


  // ===== 課題名 =====
  const title = document.createElement("div");
  title.className = "task-title";
  title.textContent = data.name;

  // ===== 締切 =====
  const deadline = document.createElement("div");
  deadline.className = "task-deadline";

  // ===== 残り時間 =====
  const remaining = document.createElement("div");

  function updateTime() {

    const now = new Date();
    const end = new Date(data.deadline);

    const diff = end - now;

    deadline.textContent =
      "締切: " + data.deadline.replace("T", " ");

    // ===== 期限切れ =====
    if (diff <= 0) {

      remaining.textContent = "期限切れ";

      taskDiv.classList.add("expired");

      // 完了済みなら削除
      if (taskDiv.classList.contains("done")) {

        taskDiv.remove();

        removeTask(i, j, data);
      }

      return;
    }

    // ===== 残り時間 =====
    const days =
      Math.floor(diff / (1000 * 60 * 60 * 24));

    const hours =
      Math.floor(
       (diff / (1000 * 60 * 60)) % 24
      );

    remaining.textContent =
       `残り ${days}日 ${hours}時間`;
 
       // ===== 5時間前 =====
    if (diff <= 5 * 60 * 60 * 1000) {

      taskDiv.classList.add("warning");

    } else {

      taskDiv.classList.remove("warning");
    }
  }

  updateTime();

  setInterval(updateTime, 60000);

  // ===== 完了ボタン =====
  const doneBtn = document.createElement("button");

  doneBtn.textContent = "完了";

  doneBtn.className = "done-btn";

 doneBtn.onclick = () => {

  taskDiv.classList.toggle("done");

  // 状態更新
  data.completed =
    taskDiv.classList.contains("done");

  // 保存更新
  let tasks =
    JSON.parse(
      localStorage.getItem(taskKey(i, j))
      || "[]"
    );

  tasks = tasks.map(task => {

    if (
      task.name === data.name &&
      task.deadline === data.deadline
    ) {

      return data;
    }

    return task;
  });

  localStorage.setItem(
    taskKey(i, j),
    JSON.stringify(tasks)
  );
  };

  // ===== 削除ボタン =====
  const deleteBtn = document.createElement("button");

  deleteBtn.textContent = "削除";

  deleteBtn.className = "delete-btn";

  deleteBtn.onclick = () => {

    taskDiv.remove();

    removeTask(i, j, data);
  };

  taskDiv.appendChild(title);

  taskDiv.appendChild(deadline);

  taskDiv.appendChild(remaining);

  taskDiv.appendChild(doneBtn);

  taskDiv.appendChild(deleteBtn);

  cell.appendChild(taskDiv);
}

// ===== 保存課題読み込み =====
function loadTasks(cell, i, j) {

  const tasks =
    JSON.parse(localStorage.getItem(taskKey(i, j)) || "[]");

  tasks.forEach(task => {

    createTask(cell, task, i, j);

  });
}

// ===== 削除 =====
function removeTask(i, j, target) {

  let tasks =
    JSON.parse(localStorage.getItem(taskKey(i, j)) || "[]");

  tasks = tasks.filter(task => {

    return !(
      task.name === target.name &&
      task.deadline === target.deadline
    );
  });

  localStorage.setItem(
    taskKey(i, j),
    JSON.stringify(tasks)
  );
}
