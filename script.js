let n = 0;
let b = 0;
let partie = 0;
let petite = 0;
let moyenne = 0;
let grosse = 0;
let results = [["Points", "Bulles éclatées"]];
const score = document.querySelector(".points");
const bulles = document.querySelector(".bulles");
const go = document.querySelector(".go");
score.innerHTML = 0 + " point";
bulles.innerHTML = 0 + " bulle éclatée";

go.innerHTML = "JOUER";

function jouer() {
  if (go.innerHTML == "JOUER") {
    go.textContent = "PAUSE";
    startStopTimer();
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

    partie = setInterval(creerBulle, 500);
  } else {
    pause();
    startStopTimer();
    nettoyer();
  }
}

function nettoyer() {
  const suppBulles = document.querySelectorAll("p");
  suppBulles.forEach((element) => {
    element.remove();
  });
}

function pause() {
  clearInterval(partie);
  go.textContent = "JOUER";
}

function reset() {
  if (partie !== 0) {
    n = 0;
    score.innerHTML = 0 + " point";
    b = 0;
    bulles.innerHTML = 0 + " bulle éclatée";
    pause();
    resetTimer();
    nettoyer();
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
    nettoyer();
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
  document.getElementById("chronometre").textContent = "00:10";
}

// POPUP
function popup() {
  const overlay = document.createElement("div");
  overlay.id = "popup-overlay";
  const popup = document.createElement("div");
  popup.id = "popup";
  let dps = n / b;

  const storedResults = localStorage.getItem("results");
  if (storedResults) {
    const results = JSON.parse(storedResults);
    results.sort(comparerPoints);
    popup.innerHTML =
      score.innerHTML +
      " " +
      bulles.innerHTML +
      "<br>PPS : " +
      (dps > 0 ? parseFloat(dps.toFixed(3)) : "0") +
      (petite > 1 ? "<br>Petites bulles : " : "<br>Petite bulle : ") +
      petite +
      (moyenne > 1 ? "<br>Moyennes bulles : " : "<br>Moyenne bulle : ") +
      moyenne +
      (grosse > 1 ? "<br>Grosses bulles : " : "<br>Grosse bulle : ") +
      grosse +
      "<br>" +
      genererContenuTableau(results);
  }
  const closeButton = document.createElement("button");
  closeButton.id = "closeButton";
  closeButton.textContent = "Fermer";
  closeButton.addEventListener("click", () => {
    overlay.style.display = "none";
    resetTimer();
    reset();
  });
  popup.appendChild(closeButton);
  overlay.appendChild(popup);
  document.body.appendChild(overlay);
  overlay.style.display = "block";
}

function genererContenuTableau(tableau) {
  let html = "<table>";
  html += "<tr>";
  html += "<th colspan='3'>Top 5</th>";
  html += "</tr>";
  for (let i = 0; i < Math.min(6, tableau.length); i++) {
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

function comparerPoints(a, b) {
  const pointsA = a[0];
  const pointsB = b[0];

  return pointsB - pointsA;
}
