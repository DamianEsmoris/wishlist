import { loadYaml, getCategories, getProductsFromTag, getProducts, PRODUCTS_KEYS_PARSED  } from '/scripts/modules/yaml.js';
const cardsContainer = document.getElementById("cardsContainer");
const DIALOG = document.querySelector("dialog");
let originalRect = null;
let curretCard;

function updateProductDialog(product) {
    const dialogImg = DIALOG.querySelector('img');
    const dialogTitle = DIALOG.querySelector('h1');
    const dialogCurrency = DIALOG.querySelector('.prod-price span.currency');
    const dialogPrice = DIALOG.querySelector('.prod-price span:last-child');
    dialogImg.src = product.image || '#';
    dialogTitle.textContent = product.name;
    dialogCurrency.textContent = product.currency;
    dialogPrice.textContent = product.price;
    const detailsKeys = Object.keys(product).filter(key => !PRODUCTS_KEYS_PARSED.has(key));
    console.log(detailsKeys);
}

function createProduct(product) {
    product.image = `https://${product.img_url}`;
    delete product.img_url;
    product.url = `https://${product.url}`;
    [product.currency, product.price] = product.price.split(' ');
    const { name, image, url, price, currency } = product;
    const li = document.createElement('li');
    li.className = 'prod-card';
    li.innerHTML = `
  <img src="${image}" alt="${name}">
  <section class="preview">
    <h1 class="prod-name">${name}</h1>
    <a href="${url}" target="_blank">
        <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#e3e3e3">
            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z"/>
        </svg>
    </a>
  </section>
  <section class="prod-price">
    <span class="currency">${currency}</span>
    <span>${price}</span>
  </section>
      `;
    li.onclick = () => openProductCard(product, li);
    cardsContainer.appendChild(li);
}

function positionClone(clone, startY, startX, rect) {
    clone.style.setProperty("--start-top", `${startY}px`);
    clone.style.setProperty("--start-left", `${startX}px`);
    if (!rect) return;
    clone.style.setProperty("--end-top", `${rect.top}px`);
    clone.style.setProperty("--end-left", `${rect.left}px`);
}

function openProductCard(product, card) {
    updateProductDialog(product);
    curretCard = card;
    originalRect = card.getBoundingClientRect();
    const clone = card.cloneNode(true);
    clone.classList.add("zoom-clone");
    card.style.opacity = 0;
    const targetX = (window.innerWidth - originalRect.width * 1.5) / 2;
    const targetY = (window.innerHeight - originalRect.height * 1.5) / 2;
    positionClone(clone, originalRect.top, originalRect.left, {
        top: targetY,
        left: targetX,
        width: originalRect.width,
        height: originalRect.height
    });
    clone.classList.add("zoom-in");
    document.body.appendChild(clone);
    clone.addEventListener( "animationend", () => {
        document.body.removeChild(clone);
        DIALOG.showModal();
    }, { once: true });
}

function closeProductCard() {
    if (!originalRect) return;
    const clone = curretCard.cloneNode(true);
    clone.classList.add("zoom-clone");
    clone.style.opacity = 1;
    const centerX = (window.innerWidth - originalRect.width) / 2;
    const centerY = (window.innerHeight - originalRect.height) / 2;
    positionClone(clone, originalRect.top, centerX, {
        ...originalRect,
        top: centerY,
        left: centerX
    });
    clone.classList.add("zoom-out");
    document.body.appendChild(clone);
    DIALOG.close();
    clone.addEventListener( "animationend", () => {
        document.body.removeChild(clone);
        if (!curretCard) return;
        curretCard.style.opacity = 1;
        curretCard = null;
    }, { once: true });
}
DIALOG.querySelector(".close-bttn")
    .onclick = closeProductCard;
DIALOG.onclose = closeProductCard;
DIALOG.onclick = (e) =>
    e.target.tagName === "DIALOG" ? closeProductCard() : null;
const wishlist = loadYaml(localStorage.getItem('ymlSrc'));
const categories = getCategories(wishlist);

console.log(wishlist);
console.log(getProducts(wishlist, categories));

//console.log(getProductsFromTag(wishlist, categories, 'mouse'));
//const earphones = getProductsFromTag(wishlist, categories, 'earphones');

//if (earphones)
//    Object.entries(earphones)
//        .forEach(([name, prod]) => createProduct({...prod, name}))
//

Object.entries(getProducts(wishlist, categories))
    .forEach(([name, prod]) => createProduct({...prod, name}))
