
if (localStorage.getItem("tema") === 'scuro') {
    document.getElementById('cssTema').href = 'temaScuro.css'
}

const lang = sessionStorage.getItem("lang");
const text = sessionStorage.getItem("text");

document.getElementById('testo').innerText = text;
document.getElementById('lingua').innerText = lang;

const host = window.location.host;
fetch(`http://${host}/search?lang=${lang}&text=${text}`, {method: "GET"})
    .then(response => response.json())
    .then(jsonObj => {
        creaPagina(jsonObj);
    });



function creaPagina(jsonObj) {
    console.log(jsonObj);

    //prendo l'elemento main del file html
    let mainElement = document.getElementById('main');

    //controllo che l'oggetto json sia effettivamente quello che si aspetta
    if (!jsonObj['annotations']) {
        let h3 = document.createElement('h3');
        h3.classList.add('center');
        h3.innerText = 'Errore nella gestione della richiesta. Riprova più tardi.';
        mainElement.appendChild(h3);
        return;
    }

    //controllo se non è stata estratta alcuna entità
    if (jsonObj['annotations'].length == 0) {
        let h3 = document.createElement('h3');
        h3.classList.add('center');
        h3.innerText = 'Non è stato trovato alcun elemento';
        mainElement.appendChild(h3);
        return;
    }

    let spots = document.getElementById('parole_chiave');

    //ciclo su tutte le entità estratte
    for (let e in jsonObj['annotations']) {
        let entita = jsonObj['annotations'][e];

        //metto lo spot sul paragrafo a inizio pagina
        spots.innerHTML += `<a href="#${entita.title}">${entita.spot}</a>`;
        spots.innerHTML += " "; //aggiungo uno spazio

        //creo la card da appendere poi al main
        let divCard = document.createElement('div');
        divCard.classList.add("center", "card", "mb-3");
        divCard.id = `${entita.title}`;

        //creo l'immagine della card
        let img = document.createElement('img');
        img.src = entita.image.full;
        img.classList.add('card-img-top');
        img.alt = entita.title;

        //creo il div del titolo e descrizione card
        let divDescr = document.createElement('div');
        divDescr.classList.add('card-body');
        let titolo = document.createElement('h2');
        titolo.classList.add('card-title');
        titolo.innerText = entita.title;
        divDescr.appendChild(titolo);

        let abstract = document.createElement('p');
        abstract.classList.add('card-text');
        abstract.innerText = entita.abstract;
        divDescr.appendChild(abstract);
        
        //creo l'elemento ul che contiene lista categorie
        let ul = document.createElement('ul');
        ul.classList.add('list-group', 'list-group-flush');
        for (let categ in entita['categories']) {
            let li = document.createElement('li');
            li.classList.add('list-group-item');
            li.innerText = entita.categories[categ];
            ul.appendChild(li);
        }

        //creo un altro div contenente il link alla pagina wikipedia dell'entità
        let divLink = document.createElement('div');
        divLink.classList.add('card-body');
        let link = document.createElement('a');
        link.classList.add('card-link');
        link.href = entita.uri;
        link.innerText = "Link a Wikipedia";
        divLink.appendChild(link);

        //appendo tutti gli elementi creati all'elemento div della card e poi lo appendo al main
        divCard.appendChild(img);
        divCard.appendChild(divDescr);
        divCard.appendChild(ul);
        divCard.appendChild(divLink);

        mainElement.appendChild(divCard);
    }
}