//You can edit ALL of the code here
function setup() {
  const card = document.getElementById("container");
  const allEpisodes = getAllEpisodes();
  const filmCards = [];
  for (const episode of allEpisodes) {
    filmCards.push(createFilmCard(episode));
  }
  card.append(...filmCards);
  makePageForEpisodes(allEpisodes);
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

window.onload = setup;
