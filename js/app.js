const tabs = document.querySelectorAll(".tab");
const container = document.getElementById("issues-container");
const search = document.getElementById("search");
const priorityColors = {
  low: "#9CA3AF",
  medium: "rgba(251, 255, 0, 0.38)",
  high: "rgba(255,0,0,0.5)",
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
  console.log(data);
  updateIssueCount(data);
  container.innerHTML = "";

  data.forEach((issue) => {
    let borderColor = issue.status === "open" ? "#00A96E" : "#A855F7";

    let priority = priorityColors[issue.priority];
    let priorityItem =
      issue.priority === "low"
        ? `<img src="assets/Closed- Status .png" class="w-4 h-4">`
        : `<img src="assets/Open-Status.png" class="w-4 h-4">`;
    container.innerHTML += `

<label for="issue_modal" class="block bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300  p-5 cursor-pointer" style="border-top:4px solid ${borderColor}">
   <div class="flex items-center justify-between gap-2 mb-4">
   <div>
 ${priorityItem}
   </div>
   <div> 
   <span class="flex items-center gap-1   text-xs font-medium px-3 py-1 rounded-full" style="background-color: ${priority}; ">
     ${issue.priority}
    </span></div>
   </div>
  <h3 class="text-lg font-semibold text-gray-800 mb-2 leading-5">
    ${issue.title}
  </h3>

  <p class="text-gray-600 text-sm mb-4">
  ${issue.description}
  </p>

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
    <p>#12 by Tanvir</p>
    <p>07/03/2026</p>
  </div>

</label>


<!-- Modal -->
<input type="checkbox" id="issue_modal" class="modal-toggle" />

<div class="modal" role="dialog">
  <div class="modal-box">

    <h3 class="text-xl leading-7 font-bold mb-2">
      ${issue.title}
    </h3>

    <p class="text-gray-600 mb-4">
      ${issue.description}
    </p>
    </p>

    <div class="flex gap-2 mb-4">

      <span class="badge badge-error">Open</span>
      <span class="badge badge-warning">Bug</span>

    </div>

    <div class="text-sm text-gray-400 mb-4">
      Issue #12 • Created by Tanvir • 07/03/2026
    </div>

    <div class="modal-action">
      <label for="issue_modal" class="btn">Close</label>
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
