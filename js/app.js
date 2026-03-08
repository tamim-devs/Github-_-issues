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

function setActive(button){
console.log(button);

let buttons = document.querySelectorAll(".tab-btn")

buttons.forEach(btn => btn.classList.remove("active"))

button.classList.add("active")

}

async function fetchIssues(){
container.innerHTML = "Loading..."
const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
const result = await res.json()

issues = result.data

loadIssues(issues)

}

function filterIssues(type){

let filtered = []

if(type === "all"){
filtered = issues
}

else if(type === "open"){
filtered = issues.filter(issue => issue.status === "open")
}

else if(type === "closed"){
filtered = issues.filter(issue => issue.status === "closed")
}

loadIssues(filtered)

}function loadIssues(data){
console.log(data);

container.innerHTML = ""

data.forEach(issue => {

let borderColor = issue.status === "open" ? "green" : "purple"

container.innerHTML += `

<div class="card" onclick="showDetails(${issue.id})" style="border-top:4px solid ${borderColor}">

<h3>${issue.title}</h3>

<p>${issue.description}</p>

<span class="tag">${issue.status}</span>

<p>#${issue.id} by ${issue.author}</p>

<p>${new Date(issue.createdAt).toLocaleDateString()}</p>

</div>

`

})

}
fetchIssues()