const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const orderForm = document.getElementById('orderForm');
const orderItem = document.getElementById('orderItem');
const orderPrice = document.getElementById('orderPrice');
const orderConfirmation = document.getElementById('orderConfirmation');

navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
});

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

function closeModal() {
    modalOverlay.classList.remove('open');
}

const fadeElements = document.querySelectorAll('.fade-in');
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

fadeElements.forEach(el => fadeObserver.observe(el));

window.addEventListener('load', () => {
    fadeElements.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
            el.classList.add('visible');
        }
    });
});

const heroOrderBtn = document.getElementById('heroOrderBtn');
const orderQty = document.getElementById('orderQty');
const orderTotal = document.getElementById('orderTotal');
const orderSummaryText = document.getElementById('orderSummaryText');

function updateOrderTotal() {
    const priceValue = parseInt(orderPrice.value.replace(/[₱,]/g, ''), 10) || 0;
    const quantity = Math.max(1, parseInt(orderQty.value, 10) || 1);
    const total = priceValue * quantity;
    orderTotal.textContent = `₱${total}`;
}

function openOrderModal(item, price) {
    orderItem.value = item;
    orderPrice.value = `₱${price}`;
    document.getElementById('orderModalLabel').textContent = `Ordering: ${item}`;
    orderQty.value = 1;
    updateOrderTotal();
    orderForm.hidden = false;
    orderSummaryText.hidden = true;
    orderConfirmation.hidden = true;
    modalOverlay.classList.add('open');
}

document.querySelectorAll('.order-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        openOrderModal(btn.dataset.item, btn.dataset.price);
    });
});

heroOrderBtn.addEventListener('click', () => {
    openOrderModal('Caramel Macchiato', '150');
});

orderQty.addEventListener('input', updateOrderTotal);

orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const quantity = Math.max(1, parseInt(orderQty.value, 10) || 1);
    const item = orderItem.value;
    const unitPrice = parseInt(orderPrice.value.replace(/[₱,]/g, ''), 10) || 0;
    const total = unitPrice * quantity;

    orderForm.hidden = true;
    orderSummaryText.textContent = `${quantity}× ${item} — ₱${total}`;
    orderSummaryText.hidden = false;
    orderConfirmation.hidden = false;
    setTimeout(() => {
        closeModal();
        orderForm.reset();
        orderSummaryText.hidden = true;
    }, 1800);
});
