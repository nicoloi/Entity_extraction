
const checkbox = document.getElementById('tema');

if (localStorage.getItem('tema') === 'scuro') {
    document.getElementById('cssTema').href = 'temaScuro.css';
    checkbox.checked = true;
}

document.getElementById('bottone').addEventListener("click", () => {
    let lang = document.getElementById('lingua').value;
    let text = document.getElementById('testo').value;

    if (text.length == 0) {
        alert('Inserisci un testo prima di continuare.');
        return;
    }

    sessionStorage.setItem("lang", lang);
    sessionStorage.setItem("text", text);

    window.location.href = '/results';
});


checkbox.addEventListener('click', () => {
    if (checkbox.checked) {
        document.getElementById('cssTema').href = 'temaScuro.css';
        localStorage.setItem('tema', 'scuro');
    } else {
        document.getElementById('cssTema').href = 'temaChiaro.css';
        localStorage.setItem('tema', 'chiaro');
    }
});
