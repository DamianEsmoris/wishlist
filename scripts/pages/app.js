if (!('ymlSrc' in localStorage)) {
    console.info('no yml loaded');
    setTimeout(() => window.location = '/', 400);
}

const cardsContainer = document.getElementById("cardsContainer");
const DIALOG = document.querySelector("dialog");
let originalRect = null;
let curretCard;
function updateProductDialog(product) {
  const dialogImg = DIALOG.querySelector("img");
  const dialogTitle = DIALOG.querySelector("h1");
  const dialogPrice = DIALOG.querySelector(".prod-price span:last-child");
  dialogImg.src = product.image;
  dialogTitle.textContent = product.name;
  dialogPrice.textContent = product.price;
}

function createProduct(product) {
  const { name, image, link, currency = "us$", price } = product;
  const li = document.createElement("li");
  li.className = "prod-card";
  li.innerHTML = `
        <img src="${image}" alt="${name}">
        <section class="preview">
          <h1 class="prod-name">${name}</h1>
          <a href="${link}" target="_blank">
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
  clone.addEventListener(
    "animationend",
    () => {
      document.body.removeChild(clone);
      DIALOG.showModal();
    },
    { once: true }
  );
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
  clone.addEventListener(
    "animationend",
    () => {
      document.body.removeChild(clone);
      if (!curretCard) return;
      curretCard.style.opacity = 1;
      curretCard = null;
    },
    { once: true }
  );
}

document.querySelector(".close-bttn").onclick = closeProductCard;
DIALOG.onclose = closeProductCard;
DIALOG.onclick = (e) => {
  if (e.target.tagName === "DIALOG") closeProductCard();
};


const products = [
  {
    name: "Tuppers",
    price: "100",
    image:
      "https://www.tupperware.com/cdn/shop/files/impressions-classic-bowl-set-2401-13018.jpg?v=1724688178",
    link: "https://www.google.com"
  },
  {
    name: "PC Gamer",
    price: "150",
    image:
      "https://http2.mlstatic.com/D_NQ_NP_908735-MLU72930687215_112023-O.webp",
    link: "https://www.google.com"
  }
];

products.forEach(createProduct);
