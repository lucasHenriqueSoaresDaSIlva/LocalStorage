// Utilitários
const form = document.getElementById('contactForm');
const formInfo = document.getElementById('formInfo');
const sessionData = document.getElementById('sessionData');

// Chaves usadas
const LOCAL_KEY = "contactFormData";
const SESSION_KEY = "sentContactFormData";
const THEME_KEY = "tema"; // chave para tema

// Função para aplicar tema
function aplicarTema(tema) {
    if (tema === "escuro") {
        document.body.classList.add("dark-theme");
        document.body.classList.remove("light-theme");
    } else {
        document.body.classList.add("light-theme");
        document.body.classList.remove("dark-theme");
    }
}

// Carrega do localStorage ao iniciar
window.addEventListener('DOMContentLoaded', () => {
    // Restaura dados do formulário
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) {
        try {
            const data = JSON.parse(saved);
            form.name.value = data.name || "";
            form.email.value = data.email || "";
            form.message.value = data.message || "";
        } catch(e) { /* ignora erro */ }
    }

    // Restaura dados da sessionStorage
    const sessionSaved = sessionStorage.getItem(SESSION_KEY);
    if (sessionSaved) {
        try {
            const obj = JSON.parse(sessionSaved);
            sessionData.textContent = `Nome: ${obj.name}\nE-mail: ${obj.email}\nMensagem: ${obj.message}`;
        } catch(e) { sessionData.textContent = ""; }
    }

    // Restaura tema salvo
    const temaSalvo = localStorage.getItem(THEME_KEY) || "claro";
    aplicarTema(temaSalvo);
});

// Salva no localStorage ao digitar (autosalvamento)
form.addEventListener('input', () => {
    const data = {
        name: form.name.value,
        email: form.email.value,
        message: form.message.value
    };
    localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
    formInfo.textContent = "Salvo localmente!";
});

// Detecta alterações em localStorage entre abas
window.addEventListener('storage', (event) => {
    // Se for alteração no formulário
    if (event.key === LOCAL_KEY) {
        formInfo.textContent = "Alteração detectada em outra aba!";
        if (event.newValue) {
            try {
                const data = JSON.parse(event.newValue);
                form.name.value = data.name || "";
                form.email.value = data.email || "";
                form.message.value = data.message || "";
            } catch(e) {}
        }
    }

    // Se for alteração no tema
    if (event.key === THEME_KEY) {
        aplicarTema(event.newValue);
        alert("O tema foi alterado em outra aba para: " + event.newValue);
    }
});

// Envia o formulário
form.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = {
        name: form.name.value,
        email: form.email.value,
        message: form.message.value
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
    localStorage.removeItem(LOCAL_KEY);
    formInfo.textContent = "Dados enviados e salvos nesta sessão!";
    sessionData.textContent = `Nome: ${data.name}\nE-mail: ${data.email}\nMensagem: ${data.message}`;
    form.reset();
});

// Botões de troca de tema
const btnClaro = document.getElementById("btnClaro");
const btnEscuro = document.getElementById("btnEscuro");

if (btnClaro && btnEscuro) {
    btnClaro.addEventListener("click", () => {
        localStorage.setItem(THEME_KEY, "claro");
        aplicarTema("claro");
    });

    btnEscuro.addEventListener("click", () => {
        localStorage.setItem(THEME_KEY, "escuro");
        aplicarTema("escuro");
    });
}
