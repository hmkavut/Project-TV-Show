//You can edit ALL of the code here
let allShows = []; // storing fetched data globally to avoid multiple fetches.
let allEpisodesByShow = {};
let allEpisodes = [];

//setup function runs when the page loads.
async function setup() {
  allShows = await getAllShows();
  allShows.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  renderShows(allShows);
  populateShowSelect(allShows);


  //Select For Shows
const showSelect = document.getElementById("show-select");
showSelect.addEventListener("change", async (event) => {
  const selectedShowId = event.target.value;

   if (!selectedShowId) return;

    // Fetch episodes only once per show
    if (!allEpisodesByShow[selectedShowId]) {
      const episodes = await getAllEpisodes(selectedShowId);
      allEpisodesByShow[selectedShowId] = episodes;

  }
   allEpisodes = allEpisodesByShow[selectedShowId];
    render(allEpisodes);
    makePageForEpisodes(allEpisodes);
    populateEpisodeSelect(allEpisodes);
  });


// Episode selection 
const selectEpisode = document.getElementById("episode-select");
selectEpisode.addEventListener("change", function () {
  const selected = selectEpisode.value;

  if (selected === "all") {
    render(allEpisodes);
    makePageForEpisodes(allEpisodes);
  } else {
    const found = allEpisodes.find((ep) => {
      const code = `S${String(ep.season).padStart(2, "0")}E${String(
        ep.number
      ).padStart(2, "0")}`;
      return code === selected;
    });

    if (found) {
      render([found]); // Wrap in array so render can loop it
      makePageForEpisodes([found]);
      console.log("Episode selected:", selected);
    }
  }
});
  //search
  const searchBox = document.getElementById("search");
  searchBox.addEventListener("input", function handleSearchInput(event) {
    const searchTerm = event.target.value.toLowerCase();

    const filteredEpisodes = allEpisodes.filter((ep) => {
      const nameMatch = ep.name.toLowerCase().includes(searchTerm);
      const summaryMatch = ep.summary.toLowerCase().includes(searchTerm);
      return nameMatch || summaryMatch;
    });

    render(filteredEpisodes); // Show filtered episodes
    makePageForEpisodes(filteredEpisodes);
  });
}
 // Fetch shows
async function getAllShows() {
  const url = "https://api.tvmaze.com/shows";
  const response = await fetch(url);     
  const data = await response.json(); 
  return data;                    
}
// Fetch episodes for a show
async function getAllEpisodes(showId) {
  const url = `https://api.tvmaze.com/shows/${showId}/episodes`;
  const response = await fetch(url);     
  const data = await response.json(); 
  return data;                    
}

 // Render episodes (unchanged)
function render(episodeList) {
  const card = document.getElementById("episode-container");
  document.getElementById("shows-container").hidden=true;
  card.innerHTML = "";
  const filmCards = episodeList.map(createFilmCard);

  card.append(...filmCards);
}
  // Count episodes
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
}
 //Create episode card
function createFilmCard(film) {
  const card = document.getElementById("episode-card").content.cloneNode(true);
  const combineSeasonEpisode = `S${String(film.season)
    .padStart(2,"0")}E${String(film.number).padStart(2, "0")}`;

  card.querySelector("h3").textContent = film.name;
  card.querySelector("#season-number").textContent = combineSeasonEpisode;
  card.querySelector("img").src = film.image?.medium || "";
  card.querySelector("img").alt = film.name;
  card.querySelector("[summary]").innerHTML = film.summary || "";

  return card;
}
// Render shows in separate container
function renderShows(showList){
const container=document.getElementById("shows-container");
container.innerHTML = "";
showList.forEach((show) => {
  const card = document.getElementById("show-card").content.cloneNode(true);
  card.querySelector("h3").textContent = show.name;
  card.querySelector("img").src = show.image?.medium || "";
  card.querySelector("img").alt = show.name;
  card.querySelector(".summary").innerHTML = show.summary || "";
  card.querySelector(".rate").textContent = `Rating: ${show.rating.average || "N/A"}`;
  card.querySelector(".genres").textContent = `Genres: ${show.genres.join(", ")}`;
  card.querySelector(".status").textContent = `Status: ${show.status}`;
  card.querySelector(".runtime").textContent = `Runtime: ${show.runtime || "N/A"} min`;
  container.appendChild(card); 
});
}
 //Populate show dropdown
async function populateShowSelect(shows) {
  const select = document.getElementById("show-select");
  select.innerHTML = "";

  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    select.appendChild(option);
  });
}
 //populate episode dropdown
async function populateEpisodeSelect(episodes) {
  const select = document.getElementById("episode-select");
    select.innerHTML = ""; // Clear old options

  // Add a default option to show all episodes
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "Show All Episodes";
  select.appendChild(allOption);

  episodes.forEach((ep) => {
    const code = `S${String(ep.season).padStart(2, "0")}E${String(
      ep.number
    ).padStart(2, "0")}`;
    const option = document.createElement("option");
    option.value = code;
    option.textContent = `${code} - ${ep.name}`;
    select.appendChild(option);
  });
  select.selectedIndex=0;
}

window.addEventListener("DOMContentLoaded", setup);

