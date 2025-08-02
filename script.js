//You can edit ALL of the code here
let allEpisodes = [];
async function setup() {
  const card = document.getElementById("container");
  allEpisodes = await getAllEpisodes();

  render(allEpisodes); // Show all episodes initially
  makePageForEpisodes(allEpisodes);
  populateEpisodeSelect(allEpisodes);

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
const select = document.getElementById("episode-select");
select.addEventListener("change", function () {
  const selected = select.value;

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
    }
  }
});

async function getAllEpisodes() {
  const url = "https://api.tvmaze.com/shows/82/episodes";
  const response = await fetch(url);     
  const data = await response.json(); 
  return data;                    
}

function render(episodeList) {
  const card = document.getElementById("container");
  card.innerHTML = "";
  const filmCards = episodeList.map(createFilmCard);

  card.append(...filmCards);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
}

function createFilmCard(film) {
  const card = document.getElementById("film-card").content.cloneNode(true);
  const combineSeasonEpisode = `S${String(film.season).padStart(
    2,
    "0"
  )}E${String(film.number).padStart(2, "0")}`;

  card.querySelector("h3").textContent = film.name;
  card.querySelector("#season-number").textContent = combineSeasonEpisode;
  card.querySelector("img").src = film.image.medium;
  card.querySelector("img").alt = film.name;
  card.querySelector("[summary]").innerHTML = film.summary;

  return card;
}
function populateEpisodeSelect(episodes) {
  const select = document.getElementById("episode-select");

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
}

window.onload = setup;
