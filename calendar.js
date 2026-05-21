const calendar =
  document.getElementById("calendar");

const taskDetail =
  document.getElementById("taskDetail");

const monthTitle =
  document.getElementById("monthTitle");

const prevBtn =
  document.getElementById("prevMonth");

const nextBtn =
  document.getElementById("nextMonth");

let currentDate = new Date();

function getAllTasks() {

  const tasks = [];

  for (let i = 0; i < 4; i++) {

    for (let j = 0; j < 5; j++) {

      // 授業名取得
      const subject =
        localStorage.getItem(
          `subject-${i}-${j}`
        ) || "授業名なし";

      // 課題取得
      const saved =
        JSON.parse(
          localStorage.getItem(
            `task-${i}-${j}`
          ) || "[]"
        );

      // 授業名を追加
      saved.forEach(task => {

        tasks.push({
          ...task,
          subject: subject
        });

      });
    }
  }

  return tasks;
}

function renderCalendar() {

  calendar.innerHTML = "";

  const year =
    currentDate.getFullYear();

  const month =
    currentDate.getMonth();

  monthTitle.textContent =
    `${year}年 ${month + 1}月`;

  const firstDay =
    new Date(year, month, 1)
      .getDay();

  const lastDate =
    new Date(year, month + 1, 0)
      .getDate();

  const weekNames =
    ["日", "月", "火", "水", "木", "金", "土"];

  // 曜日表示
  weekNames.forEach((day, index) => {

    const week =
      document.createElement("div");

    week.className = "week-name";
    week.textContent = day;

    //日曜
    if (index === 0) {
      week.classList.add("sunday")
    }
    //土曜
    if (index === 6) {
      week.classList.add("saturday")
    }

    calendar.appendChild(week);
  });

  // 空白マス
  for (let i = 0; i < firstDay; i++) {

    const empty =
      document.createElement("div");

    empty.className =
      "calendar-day empty";

    calendar.appendChild(empty);
  }

  const tasks = getAllTasks();

  // 日付マス
  for (let day = 1; day <= lastDate; day++) {

    const dayBox =
      document.createElement("div");

    dayBox.className =
      "calendar-day";
    // 日曜
    const dayOfWeek =
      new Date(year, month, day)
        .getDay();

    if (dayOfWeek === 0) {
      dayBox.classList.add("sunday-day");
    }

    // 土曜
    if (dayOfWeek === 6) {
      dayBox.classList.add("saturday-day");
    }

    const today = new Date();

    if (
      year === today.getFullYear() &&
      month === today.getMonth() &&
      day === today.getDate()
    ) {
      dayBox.classList.add("today");
    }

    const date =
      document.createElement("div");

    date.className =
      "calendar-date";

    date.textContent = day;

    dayBox.appendChild(date);

    // 課題表示
    tasks.forEach(task => {

      const deadline =
        new Date(task.deadline);

      if (
        deadline.getFullYear() === year &&
        deadline.getMonth() === month &&
        deadline.getDate() === day
      ) {

        const taskDiv =
          document.createElement("div");

        taskDiv.className =
          "calendar-task";

        taskDiv.textContent =
          `${task.name}（${task.subject}）`;
        if (task.completed) {
          taskDiv.classList.add("completed-task");
        }

        dayBox.appendChild(taskDiv);
      }
    });

    // 日付クリック
    dayBox.onclick = () => {

      const dayTasks =
        tasks.filter(task => {

          const deadline =
            new Date(task.deadline);

          return (
            deadline.getFullYear() === year &&
            deadline.getMonth() === month &&
            deadline.getDate() === day
          );
        });

      if (dayTasks.length === 0) {

        taskDetail.innerHTML =
          `<h3>${month + 1}月${day}日</h3>
       <p>課題なし</p>`;

        return;
      }

      let html =
        `<h3>${month + 1}月${day}日</h3>`;

      dayTasks.forEach(task => {

        html += `
      <div class="detail-task">
        <strong>
        ${task.name}
       （${task.subject}）
        </strong><br>
        締切：
        ${task.deadline.replace("T", " ")}
      </div>
    `;
      });

      taskDetail.innerHTML = html;
    };

    calendar.appendChild(dayBox);
  }
}

prevBtn.onclick = () => {

  currentDate.setMonth(
    currentDate.getMonth() - 1
  );

  renderCalendar();
};

nextBtn.onclick = () => {

  currentDate.setMonth(
    currentDate.getMonth() + 1
  );

  renderCalendar();
};

renderCalendar();
