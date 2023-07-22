let n = 0;
const score = document.querySelector('h1 span');
score.innerHTML = 0
function creerBulle() {
    const bulle = document.createElement('p');
    document.body.appendChild(bulle);
    bulle.classList.add("bulle");
    //taille des bulles
    const taille = Math.ceil(Math.random() * 300) + 5 + 'px';
    bulle.style.width = taille;
    bulle.style.height = taille;
    //position
    const postop = Math.ceil(Math.random() * 90) + '%';
    const posleft = Math.ceil(Math.random() * 80) + '%';
    bulle.style.top = postop;
    bulle.style.left = posleft;
    //éclater des bulles
    bulle.addEventListener('click', () => {
        n++
        bulle.remove();
        score.innerHTML = n * 10;
    });
    setTimeout(() => {
        bulle.remove();
    }, 5000);
}

setInterval(creerBulle, 500);