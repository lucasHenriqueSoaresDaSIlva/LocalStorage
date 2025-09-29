document.addEventListener('DOMContentLoaded', () => {
    const lightThemeBtn = document.getElementById('lightThemeBtn');
    const darkThemeBtn = document.getElementById('darkThemeBtn');
    const body = document.body;

    // Função para aplicar o tema
    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark-theme');
            body.classList.remove('light-theme');
        } else {
            body.classList.add('light-theme');
            body.classList.remove('dark-theme');
        }
        localStorage.setItem('theme', theme); // Salva a escolha no localStorage
    }

    // Carrega o tema salvo ao carregar a página
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme('light'); // Tema padrão se não houver nada salvo
    }

    // Event Listeners para os botões de tema
    lightThemeBtn.addEventListener('click', () => applyTheme('light'));
    darkThemeBtn.addEventListener('click', () => applyTheme('dark'));

    // 🔥 Detecta alterações no tema em outras abas
    window.addEventListener("storage", (event) => {
        if (event.key === "theme") {
            applyTheme(event.newValue);
            alert("O tema foi alterado em outra aba para: " + event.newValue);
        }
    });

    // --- Lógica do Carrinho de Compras ---
    const productButtons = document.querySelectorAll('.product-item button');
    const cartItemsList = document.getElementById('cartItems');
    const cartTotalSpan = document.getElementById('cartTotal');
    const clearCartBtn = document.getElementById('clearCartBtn');

    let cart = []; // Array para armazenar os produtos no carrinho

    // Função para salvar o carrinho no sessionStorage
    function saveCart() {
        sessionStorage.setItem('cart', JSON.stringify(cart));
    }

    // Função para carregar o carrinho do sessionStorage
    function loadCart() {
        const savedCart = sessionStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            renderCart();
        }
    }

    // Função para renderizar os itens do carrinho na UI
    function renderCart() {
        cartItemsList.innerHTML = ''; // Limpa a lista antes de renderizar novamente
        let total = 0;

        if (cart.length === 0) {
            cartItemsList.innerHTML = '<li>Carrinho vazio.</li>';
        } else {
            cart.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${item.name} (x${item.quantity}) - R$ ${(item.price * item.quantity).toFixed(2)}</span>
                    <button data-product-id="${item.id}">Remover</button>
                `;
                cartItemsList.appendChild(li);
                total += item.price * item.quantity;
            });
        }
        cartTotalSpan.textContent = total.toFixed(2);
        saveCart(); // Garante que o carrinho é salvo após cada renderização
    }

    // Adicionar produto ao carrinho
    productButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.productId;
            const productName = event.target.dataset.productName;
            const productPrice = parseFloat(event.target.dataset.productPrice);

            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    quantity: 1
                });
            }
            renderCart();
        });
    });

    // Remover produto do carrinho
    cartItemsList.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            const productIdToRemove = event.target.dataset.productId;
            const itemIndex = cart.findIndex(item => item.id === productIdToRemove);

            if (itemIndex > -1) {
                if (cart[itemIndex].quantity > 1) {
                    cart[itemIndex].quantity--;
                } else {
                    cart.splice(itemIndex, 1); // Remove o item se a quantidade for 1
                }
            }
            renderCart();
        }
    });

    // Limpar todo o carrinho
    clearCartBtn.addEventListener('click', () => {
        cart = [];
        renderCart();
    });

    // Carrega o carrinho quando a página é carregada
    loadCart();
});
