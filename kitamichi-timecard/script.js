const API_URL = "/api/record";

document.addEventListener("DOMContentLoaded", () => {
  const name = localStorage.getItem("name");
  if (!name) {
    const n = prompt("あなたの名前を入力してください");
    localStorage.setItem("name", n);
    alert(`${n} さんを登録しました`);
  }
  document.getElementById("welcome").textContent =
    localStorage.getItem("name") + " さん";

  loadTimeOptions();
  updateButtons();
});

function loadTimeOptions() {
  const select = document.getElementById("timeSelect");
  for (let h = 5; h <= 21; h++) {
    for (let m = 0; m < 60; m += 5) {
      const time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      const option = document.createElement("option");
      option.value = time;
      option.textContent = time;
      select.appendChild(option);
    }
  }
  const now = new Date();
  const rounded = Math.round(now.getMinutes() / 5) * 5;
  const init = `${String(now.getHours()).padStart(2, "0")}:${String(rounded).padStart(2, "0")}`;
  select.value = init;
}

function updateButtons() {
  const status = localStorage.getItem("status");
  const btnStart = document.getElementById("btnStart");
  const btnEnd = document.getElementById("btnEnd");
  const btnEarly = document.getElementById("btnEarly");

  if (status === "出勤中") {
    btnStart.style.display = "none";
    btnEnd.style.display = "inline-block";
  } else {
    btnStart.style.display = "inline-block";
    btnEnd.style.display = "none";
  }
  btnEarly.style.display = "inline-block";
}

async function record(action) {
  const name = localStorage.getItem("name");
  const time = document.getElementById("timeSelect").value;
  const now = new Date();

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      action,
      selectedTime: time,
      recordedAt: now.toISOString(),
    }),
  });

  if (action === "出勤" || action === "早出") {
    localStorage.setItem("status", "出勤中");
  } else if (action === "退勤") {
    localStorage.setItem("status", "退勤済");
  }

  updateButtons();
  alert(`${action} (${time}) を記録しました`);
}
