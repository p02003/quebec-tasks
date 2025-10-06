const API = "/api/tasks";

function renderTaskItem(t) {
  return $(`
    <div class="list-group-item">
      <input class="form-check-input me-2" type="checkbox" ${t.done ? "checked" : ""} data-action="toggle" data-id="${t._id}">
      <div class="flex-grow-1">
        <div class="fw-semibold ${t.done ? 'text-decoration-line-through text-muted' : ''}">${t.title}</div>
        ${t.notes ? `<div class="small text-muted">${t.notes}</div>` : ""}
        <div class="small text-secondary">#${t._id} · ${new Date(t.createdAt).toLocaleString()}</div>
      </div>
      <button class="btn btn-sm btn-outline-secondary" data-action="edit" data-id="${t._id}">Edit</button>
      <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${t._id}">Delete</button>
    </div>
  `);
}

async function list() {
  const res = await fetch(API);
  const data = await res.json();
  const $list = $("#tasksList").empty();
  if (data.length === 0) {
    $list.append('<div class="list-group-item text-muted">No tasks yet. Add one above!</div>');
  }
  data.forEach(t => $list.append(renderTaskItem(t)));
}

async function create(body) {
  const res = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return res.json();
}

async function update(id, body) {
  const res = await fetch(`${API}/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return res.json();
}

async function remove(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
}

function fillForm(t) {
  $("#taskId").val(t._id);
  $("#title").val(t.title);
  $("#notes").val(t.notes || "");
  $("#done").prop("checked", !!t.done);
}

async function getOne(id) {
  const res = await fetch(`${API}/${id}`);
  return res.json();
}

$(document).ready(() => {
  list();

  $("#refreshBtn").on("click", list);

  $("#resetBtn").on("click", () => {
    $("#taskId").val("");
    $("#title").val("");
    $("#notes").val("");
    $("#done").prop("checked", false);
  });

  $("#taskForm").on("submit", async (e) => {
    e.preventDefault();
    const id = $("#taskId").val();
    const body = {
      title: $("#title").val().trim(),
      notes: $("#notes").val().trim(),
      done: $("#done").is(":checked")
    };
    if (!body.title) { alert("Title is required"); return; }
    if (id) await update(id, body); else await create(body);
    $("#resetBtn").click();
    list();
  });

  $("#tasksList").on("click", async (e) => {
    const action = e.target.dataset.action;
    const id = e.target.dataset.id;
    if (!action) return;

    if (action === "edit") {
      const t = await getOne(id);
      fillForm(t);
    } else if (action === "delete") {
      if (confirm("Delete this task?")) { await remove(id); list(); }
    } else if (action === "toggle") {
      const t = await getOne(id);
      await update(id, { ...t, done: !t.done });
      list();
    }
  });
});
