let n = 0;
let b = 0;
let partie = 0;
let petite = 0;
let moyenne = 0;
let grosse = 0;
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
      const taille = Math.ceil(Math.random() * 300) + 20 + "px";
      bulle.style.width = taille;
      bulle.style.height = taille;
      const width = parseInt(bulle.style.width);
      width <= 50
        ? (info.innerHTML = 50)
        : width > 50 && width < 100
        ? (info.innerHTML = 10)
        : (info.innerHTML = 5);
      //position
      const postop = Math.ceil(Math.random() * 90) + "vh";
      const posleft = Math.ceil(Math.random() * 90) + "vw";
      bulle.style.top = postop;
      bulle.style.left = posleft;
      //éclater des bulles
      bulle.addEventListener("click", () => {
        if (width > 50 && width < 100) {
          n += 10;
          moyenne++;
        } else if (width <= 50) {
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
let seconds = 10;
let isRunning = false;

function updateTimer() {
  seconds--;
  if (seconds < 0) {
    clearInterval(timerInterval);
    isRunning = false;
    document.getElementById("chronometre").textContent = "00:00";
    nettoyer();
    pause();
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
  seconds = 10;
  isRunning = false;
  document.getElementById("chronometre").textContent = "00:10";
}

// Fonction pour créer le popup dynamiquement
function popup() {
  const overlay = document.createElement("div");
  overlay.id = "popup-overlay";
  const popup = document.createElement("div");
  popup.id = "popup";
  let dps = n / b;
  popup.innerHTML =
    score.innerHTML +
    " " +
    bulles.innerHTML +
    "<br>PPS : " +
    (dps > 0 ? parseFloat(dps.toFixed(3)) : "0") +
    "<br>Petites bulles : " +
    petite +
    "<br>Moyennes bulles : " +
    moyenne +
    "<br>Grosses bulles : " +
    grosse;
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
