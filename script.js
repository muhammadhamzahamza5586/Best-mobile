const filterButtons = document.querySelectorAll(".filter-chip");
const productGrid = document.querySelector("#product-grid");
const productCards = [...productGrid.querySelectorAll(".product-card")];
const emptyState = document.querySelector("#empty-state");
const sortSelect = document.querySelector("#sort-select");
const savedNote = document.querySelector("#saved-note");
const detailsDialog = document.querySelector("#details-dialog");
const mobileMenuButton = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");

const productDetails = {
  air: {
    title: "MacBook Air 13-inch",
    description: "A polished, lightweight laptop for notes, research, writing, and everyday creative projects.",
    reasons: [
      "A quiet design that won't distract in lectures.",
      "Strong battery life for long days away from an outlet.",
      "A great fit if your course already uses macOS."
    ],
    tip: "Check that the apps you need for your course run on macOS, and compare student pricing before you buy."
  },
  acer: {
    title: "Acer Aspire 14",
    description: "A sensible Windows option for students who want enough memory and storage without stretching their budget.",
    reasons: [
      "16 GB memory gives you room for lots of browser tabs.",
      "512 GB storage leaves space for coursework and downloads.",
      "Windows works with a wide range of school and campus software."
    ],
    tip: "Aspire configurations vary by retailer. Confirm the exact processor, memory, and screen in the listing."
  },
  asus: {
    title: "ASUS Zenbook 14 OLED",
    description: "A portable, premium-feeling option for students who spend extra time with visual projects and media.",
    reasons: [
      "The OLED display makes photos and video look vivid.",
      "A 14-inch size balances workspace and portability.",
      "A roomy SSD helps keep project files close at hand."
    ],
    tip: "OLED models can vary in battery life and configuration. Compare the precise model number and display specs."
  }
};

function sortProducts() {
  const sortBy = sortSelect.value;
  const sortedCards = [...productCards].sort((a, b) => {
    if (sortBy === "price-low") return Number(a.dataset.price) - Number(b.dataset.price);
    if (sortBy === "price-high") return Number(b.dataset.price) - Number(a.dataset.price);
    return Number(a.dataset.order) - Number(b.dataset.order);
  });
  sortedCards.forEach((card) => productGrid.append(card));
}

function applyFilter(filter) {
  let visibleCount = 0;
  productCards.forEach((card) => {
    const matches = filter === "all" || card.dataset.tags.split(" ").includes(filter);
    card.hidden = !matches;
    if (matches) visibleCount += 1;
  });
  emptyState.hidden = visibleCount > 0;
  sortProducts();
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    applyFilter(button.dataset.filter);
  });
});

sortSelect.addEventListener("change", sortProducts);

document.querySelectorAll(".save-button").forEach((button) => {
  button.addEventListener("click", () => {
    const isSaved = button.getAttribute("aria-pressed") !== "true";
    button.setAttribute("aria-pressed", String(isSaved));
    const laptopName = button.closest(".product-card").querySelector("h3").textContent;
    savedNote.textContent = isSaved ? `${laptopName} saved to your shortlist.` : `${laptopName} removed from your shortlist.`;
  });
});

document.querySelectorAll(".details-button").forEach((button) => {
  button.addEventListener("click", () => {
    const details = productDetails[button.dataset.product];
    detailsDialog.querySelector("#dialog-title").textContent = details.title;
    detailsDialog.querySelector(".dialog-description").textContent = details.description;
    detailsDialog.querySelector(".dialog-tip").textContent = details.tip;
    const reasons = detailsDialog.querySelector(".dialog-best-for ul");
    reasons.replaceChildren(...details.reasons.map((reason) => {
      const item = document.createElement("li");
      item.textContent = reason;
      return item;
    }));
    detailsDialog.showModal();
  });
});

detailsDialog.querySelector(".dialog-close").addEventListener("click", () => detailsDialog.close());
detailsDialog.addEventListener("click", (event) => {
  if (event.target === detailsDialog) detailsDialog.close();
});

mobileMenuButton.addEventListener("click", () => {
  const isOpen = mobileMenuButton.getAttribute("aria-expanded") !== "true";
  mobileMenuButton.setAttribute("aria-expanded", String(isOpen));
  primaryNav.classList.toggle("is-open", isOpen);
});
primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenuButton.setAttribute("aria-expanded", "false");
    primaryNav.classList.remove("is-open");
  });
});
