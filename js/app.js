const tabs = document.querySelectorAll(".tab");
const container = document.getElementById("issues-container")

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => {
      t.classList.remove("tab-active","bg-violet-600","text-white");
      t.classList.add("bg-white","text-gray-500");
    });

    tab.classList.add("tab-active","bg-violet-600","text-white");
    tab.classList.remove("bg-white","text-gray-500");
  });
});


async function fetchIssues(){
container.innerHTML = "Loading..."
const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
const result = await res.json()

issues = result.data

loadIssues(issues)

}

fetchIssues()