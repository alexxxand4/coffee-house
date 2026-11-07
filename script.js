// ==========================================
// COFFEE HOUSE
// КОРЗИНА И ОФОРМЛЕНИЕ ЗАКАЗА
// ==========================================


// 1. ЗАГРУЗКА КОРЗИНЫ

function loadCart() {

    try {

        const savedCart = JSON.parse(
            localStorage.getItem("coffeeCart")
        );

        if (!Array.isArray(savedCart)) {
            return [];
        }

        return savedCart
            .filter(item =>
                item &&
                typeof item.name === "string" &&
                Number.isFinite(Number(item.price)) &&
                Number(item.price) > 0
            )
            .map(item => ({
                name: item.name,
                price: Number(item.price),
                quantity: Math.max(
                    1,
                    Math.floor(Number(item.quantity) || 1)
                )
            }));

    } catch (error) {

        console.error("Ошибка загрузки корзины:", error);

        return [];
    }
}


// Создаём корзину

let cart = loadCart();


// 2. СОХРАНЕНИЕ КОРЗИНЫ

function saveCart() {

    localStorage.setItem(
        "coffeeCart",
        JSON.stringify(cart)
    );
}


// 3. ДОБАВЛЕНИЕ ТОВАРА

function addToCart(name, price) {

    price = Number(price);

    if (
        !name ||
        !Number.isFinite(price) ||
        price <= 0
    ) {

        alert("Ошибка добавления товара!");

        return;
    }

    const existingItem = cart.find(
        item => item.name === name
    );

    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    saveCart();

    updateCart();
}


// 4. ИЗМЕНЕНИЕ КОЛИЧЕСТВА

function changeQuantity(index, amount) {

    if (!cart[index]) {
        return;
    }

    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart();

    updateCart();
}


// 5. УДАЛЕНИЕ ТОВАРА

function removeFromCart(index) {

    if (index < 0 || index >= cart.length) {
        return;
    }

    cart.splice(index, 1);

    saveCart();

    updateCart();
}


// 6. ОБНОВЛЕНИЕ КОРЗИНЫ

function updateCart() {

    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    if (!cartItems || !cartTotal) {

        console.error("Не найдены элементы корзины!");

        return;
    }

    cartItems.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p>Ваша корзина пока пуста.</p>";

        cartTotal.textContent = "0";

        return;
    }

    cart.forEach((item, index) => {

        const itemTotal = item.price * item.quantity;

        total += itemTotal;

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        const productInfo = document.createElement("div");
        productInfo.className = "cart-product-info";

        const productName = document.createElement("h3");
        productName.textContent = item.name;

        const productDescription = document.createElement("p");
        productDescription.textContent = item.price + " ₽ за штуку";

        productInfo.appendChild(productName);
        productInfo.appendChild(productDescription);

        const quantityControls = document.createElement("div");
        quantityControls.className = "quantity-controls";

        const minusButton = document.createElement("button");
        minusButton.type = "button";
        minusButton.textContent = "−";
        minusButton.setAttribute("aria-label", "Уменьшить количество");
        minusButton.onclick = () => changeQuantity(index, -1);

        const quantity = document.createElement("strong");
        quantity.textContent = item.quantity;

        const plusButton = document.createElement("button");
        plusButton.type = "button";
        plusButton.textContent = "+";
        plusButton.setAttribute("aria-label", "Увеличить количество");
        plusButton.onclick = () => changeQuantity(index, 1);

        quantityControls.appendChild(minusButton);
        quantityControls.appendChild(quantity);
        quantityControls.appendChild(plusButton);

        const productPrice = document.createElement("div");
        productPrice.className = "cart-product-price";

        const priceText = document.createElement("strong");
        priceText.textContent = itemTotal + " ₽";

        productPrice.appendChild(priceText);

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "remove-button";
        removeButton.textContent = "Удалить";
        removeButton.onclick = () => removeFromCart(index);

        cartItem.appendChild(productInfo);
        cartItem.appendChild(quantityControls);
        cartItem.appendChild(productPrice);
        cartItem.appendChild(removeButton);

        cartItems.appendChild(cartItem);
    });

    cartTotal.textContent = total;
}


// 7. ОФОРМЛЕНИЕ ЗАКАЗА

function checkoutOrder(event) {

    event.preventDefault();

    // Проверяем, есть ли товары в корзине

    if (cart.length === 0) {

        alert("Сначала добавьте товары в корзину!");

        return;
    }

    // Получаем данные покупателя

    const name = document
        .getElementById("customer-name")
        .value.trim();

    const phone = document
        .getElementById("customer-phone")
        .value.trim();

    const comment = document
        .getElementById("customer-comment")
        .value.trim();

    if (!name || !phone) {

        alert("Заполните имя и телефон!");

        return;
    }

    // Подсчитываем стоимость заказа

    let total = 0;

    cart.forEach(item => {

        total += item.price * item.quantity;

    });

    // Формируем список товаров

    const orderDetails = cart.map(item => {

        return `${item.name} × ${item.quantity}`;

    }).join(", ");

    // Показываем информацию о покупателе

    document.getElementById("success-name").textContent =
        "Покупатель: " + name;

    document.getElementById("success-products").textContent =
        "Ваш заказ: " + orderDetails;

    document.getElementById("success-phone").textContent =
        "Телефон: " + phone;

    document.getElementById("success-comment").textContent =
        comment
            ? "Комментарий: " + comment
            : "Комментарий: отсутствует";

    document.getElementById("success-total").textContent =
        total;

    // Скрываем форму

    document.getElementById("checkout-form").hidden = true;

    // Показываем карточку благодарности

    document.getElementById("order-success").hidden = false;

    // Очищаем корзину

    cart = [];

    saveCart();

    updateCart();

    // Очищаем форму

    document.getElementById("checkout-form").reset();

    // Прокручиваем страницу к подтверждению

    document.getElementById("order-success").scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


// 8. НАЧАТЬ НОВЫЙ ЗАКАЗ

function startNewOrder() {

    // Скрываем подтверждение

    document.getElementById("order-success").hidden = true;

    // Показываем форму снова

    document.getElementById("checkout-form").hidden = false;

    // Очищаем старые данные подтверждения

    document.getElementById("success-name").textContent = "";
    document.getElementById("success-products").textContent = "";
    document.getElementById("success-phone").textContent = "";
    document.getElementById("success-comment").textContent = "";
    document.getElementById("success-total").textContent = "0";

    // Возвращаемся к меню

    document.getElementById("menu").scrollIntoView({
        behavior: "smooth"
    });
}


// 9. ПОКАЗЫВАЕМ КОРЗИНУ ПРИ ЗАПУСКЕ

updateCart();