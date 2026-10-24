window.addEventListener("load", () => {
  setTimeout(() => document.getElementById("loader").classList.add("hide"), 600);
});

const nav = document.getElementById("nav");
const progress = document.getElementById("progress");
const toTop = document.getElementById("toTop");
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".links a");
const heroImg = document.getElementById("heroImg");
const quoteBg = document.querySelector(".quote-bg");

window.addEventListener("scroll", () => {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (y / max) * 100 + "%";
  nav.classList.toggle("scrolled", y > 60);
  toTop.classList.toggle("show", y > 600);
  heroImg.style.top = y * 0.35 + "px";
  const qRect = quoteBg.parentElement.getBoundingClientRect();
  quoteBg.style.transform = `translateY(${qRect.top * -0.2 - 60}px)`;
  sections.forEach((sec) => {
    const top = sec.offsetTop - 140;
    if (y >= top && y < top + sec.offsetHeight) {
      navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + sec.id));
    }
  });
});

toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const burger = document.getElementById("burger");
const links = document.getElementById("links");
burger.addEventListener("click", () => {
  links.classList.toggle("open");
  burger.innerHTML = links.classList.contains("open") ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
});
navLinks.forEach((a) => a.addEventListener("click", () => {
  links.classList.remove("open");
  burger.innerHTML = '<i class="fa-solid fa-bars"></i>';
}));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.target;
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / 2000, 1);
      el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3))) + "+";
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll(".count").forEach((el) => counterObserver.observe(el));

const filterBtns = document.querySelectorAll("#filters button");
const cards = document.querySelectorAll(".card");
filterBtns.forEach((btn) => btn.addEventListener("click", () => {
  filterBtns.forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  const f = btn.dataset.filter;
  cards.forEach((c) => c.classList.toggle("hidden", f !== "all" && c.dataset.cat !== f));
}));

cards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-8px)`;
  });
  card.addEventListener("mouseleave", () => (card.style.transform = ""));
});

document.querySelectorAll(".like").forEach((btn) => {
  btn.addEventListener("click", () => {
    const count = btn.querySelector("b");
    const icon = btn.querySelector("i");
    const liked = btn.classList.toggle("liked");
    count.textContent = +count.textContent + (liked ? 1 : -1);
    icon.className = liked ? "fa-solid fa-heart" : "fa-regular fa-heart";
    showToast(liked ? "Sevimlilarga qo'shildi ❤" : "Sevimlilardan olib tashlandi");
  });
});

const quotes = [
  "Shirin hayot bir qoshiq asaldan boshlanadi.",
  "Bir qoshiq sabr — bir qozon baxt.",
  "Qoshiq kichik, lekin dasturxonni u boshqaradi.",
  "Har bir taomning ta'mi qoshiqdan boshlanadi.",
];
const quoteEl = document.getElementById("quote");
const dotsWrap = document.getElementById("dots");
let qIndex = 0;
quotes.forEach((_, i) => {
  const d = document.createElement("span");
  if (i === 0) d.classList.add("active");
  d.addEventListener("click", () => showQuote(i));
  dotsWrap.appendChild(d);
});

function showQuote(i) {
  qIndex = i;
  quoteEl.classList.add("fade");
  setTimeout(() => {
    quoteEl.textContent = quotes[i];
    quoteEl.classList.remove("fade");
  }, 450);
  dotsWrap.querySelectorAll("span").forEach((d, j) => d.classList.toggle("active", j === i));
}
setInterval(() => showQuote((qIndex + 1) % quotes.length), 4500);

const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbCap = document.getElementById("lbCap");
document.querySelectorAll(".g-item").forEach((img) => {
  img.addEventListener("click", () => {
    lbImg.src = img.src;
    lbCap.textContent = img.alt;
    lightbox.classList.add("open");
  });
});
document.getElementById("lbClose").addEventListener("click", () => lightbox.classList.remove("open"));
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.classList.remove("open");
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") lightbox.classList.remove("open");
});

const facts = [
  "\"Spoon\" so'zi qadimgi ingliz tilida \"yog'och bo'lagi\" degan ma'noni bildiradi.",
  "Uelsda sevgi belgisi sifatida o'yma yog'och qoshiq sovg'a qilingan.",
  "Kumush qoshiq bakteriyalarni kamaytiruvchi xususiyatga ega.",
  "\"Og'zida kumush qoshiq bilan tug'ilgan\" iborasi boy oilada tug'ilganni anglatadi.",
  "Choy qoshig'i taxminan 5 ml, osh qoshig'i esa 15 ml sig'adi.",
  "Qadimgi Misrda qoshiqlar ma'buda tasvirlari bilan bezatilgan.",
];
const factText = document.getElementById("factText");
let lastFact = 0;
document.getElementById("factBtn").addEventListener("click", () => {
  let n;
  do n = Math.floor(Math.random() * facts.length); while (n === lastFact);
  lastFact = n;
  factText.style.opacity = 0;
  setTimeout(() => {
    factText.textContent = facts[n];
    factText.style.opacity = 1;
  }, 350);
});

document.querySelectorAll(".faq-item").forEach((item) => {
  item.querySelector(".faq-q").addEventListener("click", () => {
    const answer = item.querySelector(".faq-a");
    const open = item.classList.toggle("open");
    answer.style.maxHeight = open ? answer.scrollHeight + "px" : 0;
  });
});

const form = document.getElementById("form");
const formMsg = document.getElementById("formMsg");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  formMsg.textContent = `Rahmat, ${name}! Xabaringiz qabul qilindi.`;
  showToast("Xabar yuborildi ✔");
  form.reset();
});

const toast = document.getElementById("toast");
let toastTimer;
function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

document.getElementById("year").textContent = new Date().getFullYear();
