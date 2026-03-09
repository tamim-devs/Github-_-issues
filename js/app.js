const tabs = document.querySelectorAll(".tab");
const container = document.getElementById("issues-container");
const search = document.getElementById("search");
const priorityColors = {
  low: "#9CA3AF",
  medium: "rgba(251, 255, 0, 0.38)",
  high: "rgba(255,0,0,0.5)",
};
const labelConfigs = {
  bug: {
    color: "bg-red-100 text-red-700 border-red-200",
    icon: "fa-bug",
  },
  feature: {
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: "fa-star",
  },
  documentation: {
    color: "bg-blue-100 text-blue-700 border-green-200",
    icon: "fa-book",
  },
  enhancement: {
    color: "bg-green-100 text-green-700 border-green-200",
    icon: "fa-wand-magic-sparkles",
  },
};
let issues = [];

search.addEventListener("input", searchIssue);

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => {
      t.classList.remove("tab-active", "bg-violet-600", "text-white");
      t.classList.add("bg-white", "text-gray-500");
    });

    tab.classList.add("tab-active", "bg-violet-600", "text-white");
    tab.classList.remove("bg-white", "text-gray-500");
  });
});

function setActive(button) {
  console.log(button);

  let buttons = document.querySelectorAll(".tab-btn");

  buttons.forEach((btn) => btn.classList.remove("active"));

  button.classList.add("active");
}

async function fetchIssues() {
  container.innerHTML = "Loading...";
  const res = await fetch(
    "https://phi-lab-server.vercel.app/api/v1/lab/issues",
  );
  const result = await res.json();

  issues = result.data;

  loadIssues(issues);
}

function filterIssues(type) {
  let filtered = [];

  if (type === "all") {
    filtered = issues;
  } else if (type === "open") {
    filtered = issues.filter((issue) => issue.status === "open");
  } else if (type === "closed") {
    filtered = issues.filter((issue) => issue.status === "closed");
  }

  loadIssues(filtered);
}
function loadIssues(data) {
  updateIssueCount(data);
  container.innerHTML = "";

  data.forEach((issue, index) => {
   console.log(issue);
   
    let modalId = `issue_modal_${index}`;

    let borderColor = issue.status === "open" ? "#00A96E" : "#A855F7";
    let priority = priorityColors[issue.priority];
    let priorityItem =
      issue.priority === "low"
        ? `<img src="assets/Closed- Status .png" class="w-4 h-4">`
        : `<img src="assets/Open-Status.png" class="w-4 h-4">`;

    container.innerHTML += `
      <label for="${modalId}" class="block bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 p-5 cursor-pointer" style="border-top:4px solid ${borderColor}">
        <div class="flex items-center justify-between gap-2 mb-4">
          <div>${priorityItem}</div>
          <div>
            <span class="flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full" style="background-color: ${priority};">
              ${issue.priority}
            </span>
          </div>
        </div>

        <h3 class="text-lg font-semibold text-gray-800 mb-2 leading-5">${issue.title}</h3>
        <p class="text-gray-600 text-sm mb-4">${issue.description}</p>
           <div class="flex items-center gap-2 mb-6 text-xs">
          ${issue.labels && issue.labels.length > 0 ? (() => {
  const labelName = issue.labels[0];
  const config = labelConfigs[labelName.toLowerCase()] || {
    color: "bg-gray-100 text-gray-700 border-gray-200",
    icon: "fa-tag"
  };

  return `
    <p class="${config.color} border inline-block py-1 px-2 rounded-full uppercase font-medium flex items-center gap-1">
      <i class="fa-solid ${config.icon}"></i> ${labelName}
    </p>
  `;
          })() : ""}
        </div>
        <div class="flex gap-2 mb-4">
          <span class="flex items-center gap-1 bg-red-100 text-red-700 text-xs font-medium px-3 py-1 rounded-full">
            <img src="assets/BugDroid.png" class="w-4 h-4">
            ${issue.priority}
          </span>
          <span class="flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs font-medium px-3 py-1 rounded-full">
            <img src="assets/Lifebuoy.png" class="w-4 h-4">
            Bug
          </span>
        </div>

        <div class="flex justify-between text-xs text-gray-400">
          <p>#${issue.author}</p>
          <p>${new Date(issue.createdAt).toLocaleDateString()}</p>
        </div>
      </label>

      <!-- Modal -->
      <input type="checkbox" id="${modalId}" class="modal-toggle" />
      <div class="modal" role="dialog">
        <div class="modal-box max-w-xl">
          <h3 class="text-lg font-semibold text-gray-800 mb-2 leading-5">${issue.title}</h3>
          <div class="text-sm text-gray-500 mb-3">
                        <span class="badge badge-success text-white font-bold">${issue.status}</span> <span class="font-medium">${issue.author}</span> • 22/03/2026
          </div>
          <div class="flex items-center gap-2 mb-6 text-xs">
${issue.labels?.slice(0,2).map(labelName => {
  const config = labelConfigs[labelName.toLowerCase()] || {
    color: "bg-gray-100 text-gray-700 border-gray-200",
    icon: "fa-tag"
  };

  return `
    <p class="${config.color} border inline-block py-1 px-2 rounded-full uppercase font-medium flex items-center gap-1">
      <i class="fa-solid ${config.icon}"></i> ${labelName}
    </p>
  `;
}).join("")}
</div>
         

          <p class="text-gray-600 mb-6">${issue.description}</p>
          <hr/>

          <div class="grid mt-3 grid-cols-2 bg-gray-100  gap-4 text-sm  py-4 px-5">
            <div>
              <p class="text-gray-400">Assignee:</p>
              <p class="font-medium">${issue.assignee}</p>
            </div>
            <div>
              <p class="text-gray-400">Priority:</p>
              <span class="flex items-center gap-1 bg-red-600 text-black w-28 text-xs font-medium px-3 py-1 rounded-full" style="background-color: ${priority};">
              
                ${issue.priority}
              </span>
            </div>
          </div>

          <div class="modal-action">
            <label for="${modalId}" class="btn btn-primary">Close</label>
          </div>
        </div>
      </div>
    `;
  });
}

async function searchIssue() {
  let value = document.getElementById("search").value.trim();

  if (value === "") {
    fetchIssues();
    return;
  }

  try {
    const res = await fetch(
      `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${value}`,
    );
    const result = await res.json();

    loadIssues(result.data);
  } catch (error) {
    console.log("Search error:", error);
  }
}
function updateIssueCount(data) {
  const countElement = document.getElementById("issue-count");
  countElement.innerText = `${data.length} Issues`;
}
fetchIssues();
