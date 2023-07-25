let n = 0;
let b = 0;
let partie = 0;
let petite = 0;
let moyenne = 0;
let grosse = 0;
let results = [];
const score = document.querySelector(".points");
const bulles = document.querySelector(".bulles");
const go = document.querySelector(".go");
score.innerHTML = 0 + " point";
bulles.innerHTML = 0 + " bulle éclatée";

go.innerHTML = "JOUER";

function jouer() {
  startStopTimer();
  if (go.innerHTML == "JOUER") {
    go.textContent = "PAUSE";
    partie = setInterval(creerBulle, 500);
  } else {
    pause();
  }
}

function creerBulle() {
  const bulle = document.createElement("p");
  const info = document.createElement("p");
  document.body.appendChild(bulle);
  bulle.appendChild(info);
  bulle.classList.add("bulle");
  //taille des bulles
  const taille = Math.ceil(Math.random() * 300) + 50 + "px";
  bulle.style.width = taille;
  bulle.style.height = taille;
  const width = parseInt(bulle.style.width);
  width <= 80
    ? (info.innerHTML = 50)
    : width > 80 && width < 150
    ? (info.innerHTML = 20)
    : (info.innerHTML = 5);
  //position
  const postop = Math.ceil(Math.random() * 90) + "vh";
  const posleft = Math.ceil(Math.random() * 90) + "vw";
  bulle.style.top = postop;
  bulle.style.left = posleft;
  //éclater des bulles
  bulle.addEventListener("click", () => {
    if (width > 80 && width < 150) {
      n += 20;
      moyenne++;
    } else if (width <= 80) {
      n += 50;
      petite++;
    } else {
      n += 5;
      grosse++;
    }
    b++;
    bulle.remove();
    score.innerHTML = n + " points";
    if (b > 1) {
      bulles.innerHTML = b + " bulles éclatées";
    } else {
      bulles.innerHTML = b + " bulle éclatée";
    }
  });
  setTimeout(() => {
    bulle.remove();
  }, 5000);
}

function pause() {
  clearInterval(partie);
  go.textContent = "JOUER";
  const suppBulles = document.querySelectorAll("p");
  suppBulles.forEach((element) => {
    element.remove();
  });
}

function reset() {
  if (partie !== 0) {
    n = 0;
    score.innerHTML = 0 + " point";
    b = 0;
    bulles.innerHTML = 0 + " bulle éclatée";
    pause();
    resetTimer();
  }
}

// COMPTE A REBOURS
let timerInterval;
let seconds = 5;
let isRunning = false;

function updateTimer() {
  seconds--;
  if (seconds < 0) {
    clearInterval(timerInterval);
    isRunning = false;
    document.getElementById("chronometre").textContent = "00:00";
    pause();
    const storedResults = localStorage.getItem("results");
    if (storedResults) {
      results = JSON.parse(storedResults);
    }
    let resultatPartie = [n, b];
    results.push(resultatPartie);
    localStorage.setItem("results", JSON.stringify(results));
    popup();
  } else {
    const formattedTime = seconds.toString().padStart(2, "0");
    document.getElementById("chronometre").textContent = `00:${formattedTime}`;
  }
}

function startStopTimer() {
  if (isRunning) {
    clearInterval(timerInterval);
    isRunning = false;
  } else {
    timerInterval = setInterval(updateTimer, 1000);
    isRunning = true;
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  seconds = 5;
  isRunning = false;
  document.getElementById("chronometre").textContent = "00:05";
}

// POPUP
const overlay = document.createElement("div");
overlay.id = "popup-overlay";
document.body.appendChild(overlay);
$("#popup-overlay").hide();

const popupScores = document.createElement("div");
popupScores.id = "popup";
overlay.appendChild(popupScores);
$("#popup").hide();

function popup() {
  $("#popup-overlay").show("");
  $("#popup").delay(500).show("slow");
  let dps = n / b;
  const storedResults = localStorage.getItem("results");
  if (storedResults) {
    const results = JSON.parse(storedResults);
    results.sort(trierPoints);
    popupScores.innerHTML =
      "<p><b>" +
      score.innerHTML +
      " " +
      bulles.innerHTML +
      "</b>" +
      "<br>PPS : " +
      (dps > 0 ? parseFloat(dps.toFixed(3)) : "0") +
      (petite > 1 ? "<br>Petites bulles : " : "<br>Petite bulle : ") +
      petite +
      (moyenne > 1 ? "<br>Moyennes bulles : " : "<br>Moyenne bulle : ") +
      moyenne +
      (grosse > 1 ? "<br>Grosses bulles : " : "<br>Grosse bulle : ") +
      grosse +
      "</p><br>" +
      genererContenuTableau(results);
  }
  boutonEffacer();
  boutonFermer();
}

function boutonEffacer() {
  const boutonEffacer = document.createElement("button");
  boutonEffacer.id = "boutonEffacer";
  boutonEffacer.textContent = "Effacer les scores";
  popupScores.appendChild(boutonEffacer);
  boutonEffacer.addEventListener("click", () => {
    overlay.style.display = "none";
    $("#popup").fadeToggle("");
    reset();
    localStorage.clear();
    results = [];
  });
}

function boutonFermer() {
  const closeButton = document.createElement("button");
  closeButton.id = "closeButton";
  closeButton.textContent = "✖";
  popupScores.appendChild(closeButton);
  closeButton.addEventListener("click", () => {
    overlay.style.display = "none";
    $("#popup").fadeToggle("fast");
    reset();
  });
}

//SCORES
function genererContenuTableau(tableau) {
  let html = "<table id='tableauScores'>";
  html += "<caption><b>Top 5 des meilleurs scores</b></caption>";
  html += "<tr><th>Points</th><th>Bulles éclatées</th><tr>";
  for (let i = 0; i < Math.min(5, tableau.length); i++) {
    const ligne = tableau[i];
    html += "<tr>";
    ligne.forEach((cellule) => {
      html += "<td>" + cellule + "</td>";
    });
    html += "</tr>";
  }
  html += "</table>";
  return html;
}

function trierPoints(a, b) {
  const pointsA = a[0];
  const pointsB = b[0];
  return pointsB - pointsA;
}

function afficherScores() {
  if (go.innerHTML == "JOUER") {
    overlay.style.display = "block";
    $("#popup").slideToggle("");
    const storedResults = localStorage.getItem("results");
    if (storedResults) {
      const results = JSON.parse(storedResults);
      results.sort(trierPoints);
      popupScores.innerHTML = genererContenuTableau(results);
      boutonEffacer();
    } else {
      popupScores.innerHTML = "Aucun score enregistré.";
    }
    const closeButton = document.createElement("button");
    closeButton.id = "closeButton";
    closeButton.textContent = "✖";
    popupScores.appendChild(closeButton);
  } else {
    pause();
    resetTimer();
    afficherScores();
  }
  boutonFermer();
}
