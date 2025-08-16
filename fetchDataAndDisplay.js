//You can edit ALL of the code here
let allShows = []; // storing fetched data globally to avoid multiple fetches.
let allEpisodesByShow = {};
let allEpisodes = [];
let isShow = true;
//setup function runs when the page loads.
async function setup() {
  allShows = await getAllShows();
  allShows.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );
  renderShows(allShows);
  populateShowSelect(allShows);

  //Select For Shows
  const showSelect = document.getElementById("show-select");
  showSelect.addEventListener("change", async (event) => {
    document.getElementById("episode-container").hidden = false;
    const selectedShowId = event.target.value;
    isShow = false;
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
    if (isShow) {
      const searchTerm = event.target.value.toLowerCase();

      const filteredShows = allShows.filter((ep) => {
        const nameMatch = ep.name.toLowerCase().includes(searchTerm);
        const summaryMatch = ep.summary.toLowerCase().includes(searchTerm);
        return nameMatch || summaryMatch;
      });
      if (filteredShows.length == 0) {
        alert("There is no show");
      }
      filteredShows.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      renderShows(filteredShows);
      populateShowSelect(filteredShows);
    } else {
      console.log(isShow);
      const searchTerm = event.target.value.toLowerCase();
      const filteredEpisodes = allEpisodes.filter((ep) => {
        console.log(allEpisodes + "df");
        const nameMatch = ep.name.toLowerCase().includes(searchTerm);
        const summaryMatch = ep.summary.toLowerCase().includes(searchTerm);
        return nameMatch || summaryMatch;
      });
      if (filteredEpisodes.length == 0) {
        alert("There is no episode");
      }
      render(filteredEpisodes); // Show filtered episodes
      makePageForEpisodes(filteredEpisodes);
    }
  });

  //Display Button
  const displayShows = document.getElementById("btnVisible");
  displayShows.addEventListener("click", function handleDisplayShows() {
    allShows.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );
    renderShows(allShows);
    populateShowSelect(allShows);
    document.getElementById("display-shows").hidden = false;
    document.getElementById("btnVisible").hidden = true;
    document.getElementById("shows-container").hidden = false;
    document.getElementById("episode-container").hidden = true;
  });
}
// Fetch shows
async function getAllShows() {
  if (allShows.length === 0) {
    // fetch only if not already fetched
    const url = "https://api.tvmaze.com/shows";

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `HTTP error! Status: ${response.status} - ${response.statusText}`
        );
      }

      allShows = await response.json();
    } catch (error) {
      console.error("Failed to fetch shows:", error.message);
      allShows = []; // fallback so it doesn’t stay undefined
    }
  }

  return allShows;
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
  document.getElementById("shows-container").hidden = true;
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
  const combineSeasonEpisode = `S${String(film.season).padStart(
    2,
    "0"
  )}E${String(film.number).padStart(2, "0")}`;

  card.querySelector("h3").textContent = film.name;
  card.querySelector("#season-number").textContent = combineSeasonEpisode;
  card.querySelector("img").src = film.image?.medium || "";
  card.querySelector("img").alt = film.name;
  card.querySelector("p").innerHTML = film.summary || "";

  return card;
}
// Render shows in separate container
function renderShows(showList) {
  const container = document.getElementById("shows-container");
  container.innerHTML = "";
  showList.forEach((show) => {
    const card = document.getElementById("show-card").content.cloneNode(true);
    card.querySelector("h3").textContent = show.name;
    card.querySelector("h3").addEventListener("click", async function () {
      document.getElementById("display-shows").hidden = true;
      document.getElementById("btnVisible").hidden = false;
      const selectedShowId = show.id;
      console.log("serie no" + show.id);
      isShow = false;
      if (!allEpisodesByShow[selectedShowId]) {
        const episodes = await getAllEpisodes(selectedShowId);
        allEpisodesByShow[selectedShowId] = episodes;
      }

      allEpisodes = allEpisodesByShow[selectedShowId];
      render(allEpisodes);
      makePageForEpisodes(allEpisodes);
      populateEpisodeSelect(allEpisodes);
    });
    card.querySelector("img").src = show.image?.medium || "";
    card.querySelector("img").alt = show.name;
    card.querySelector("p").innerHTML = show.summary || "";
    card.querySelector(".rate").textContent = `Rating: ${
      show.rating.average || "N/A"
    }`;
    card.querySelector(".genres").textContent = `Genres: ${show.genres.join(
      ", "
    )}`;
    card.querySelector(".status").textContent = `Status: ${show.status}`;
    card.querySelector(".runtime").textContent = `Runtime: ${
      show.runtime || "N/A"
    } min`;
    container.appendChild(card);
  });
}
//Populate show dropdown
async function populateShowSelect(shows) {
  const select = document.getElementById("show-select");
  select.innerHTML = "";
  isShow = true;
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
  isShow = false;
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
  select.selectedIndex = 0;
}

window.addEventListener("DOMContentLoaded", setup);
