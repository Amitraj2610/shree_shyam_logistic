import { addRecord, fetchRecords } from "./database.js";

document.addEventListener("DOMContentLoaded", () => {
  // ---------------------------
  // TRACK BUTTON
  // ---------------------------
  const trackBtn = document.querySelector(".track-btn");
  trackBtn?.addEventListener("click", () =>
    alert("🚚 Tracking system coming soon!")
  );

  // ---------------------------
  // HERO SLIDER
  // ---------------------------
  const slidesContainer = document.querySelector(".slides");
  const slides = Array.from(document.querySelectorAll(".slide"));
  const nextBtn = document.getElementById("next");
  const prevBtn = document.getElementById("prev");
  const sliderEl = document.querySelector(".hero-slider");

  let index = 0,
    autoplayDelay = 6000,
    autoplay,
    touchStartX = 0,
    hoverCooldown = false;

  if (slidesContainer && slides.length) {
    slidesContainer.style.width = `${slides.length * 100}%`;
    slides.forEach((slide) => (slide.style.flex = "0 0 100%"));

    const goToSlide = (i) => {
      index = (i + slides.length) % slides.length;
      slidesContainer.style.transform = `translateX(-${index * 100}%)`;
      slides.forEach((s, idx) => s.classList.toggle("active", idx === index));
    };

    const startHero = () => {
      clearInterval(autoplay);
      autoplay = setInterval(() => goToSlide(index + 1), autoplayDelay);
    };
    const stopHero = () => clearInterval(autoplay);

    // Buttons
    nextBtn?.addEventListener("click", () => {
      stopHero();
      goToSlide(index + 1);
      startHero();
    });
    prevBtn?.addEventListener("click", () => {
      stopHero();
      goToSlide(index - 1);
      startHero();
    });

    // Pause on hover
    sliderEl?.addEventListener("mouseenter", stopHero);
    sliderEl?.addEventListener("mouseleave", startHero);

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        stopHero();
        goToSlide(index + 1);
        startHero();
      }
      if (e.key === "ArrowLeft") {
        stopHero();
        goToSlide(index - 1);
        startHero();
      }
    });

    // Touch navigation
    sliderEl?.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].clientX;
    });
    sliderEl?.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (dx > 50) goToSlide(index - 1);
      else if (dx < -50) goToSlide(index + 1);
      startHero();
    });

    // Hover zones navigation
    const hoverLeft = document.querySelector(".prev-hover");
    const hoverRight = document.querySelector(".next-hover");

    const hoverChange = (direction) => {
      if (hoverCooldown) return;
      hoverCooldown = true;
      stopHero();
      goToSlide(index + direction);
      startHero();
      setTimeout(() => (hoverCooldown = false), 800);
    };

    hoverLeft?.addEventListener("mouseenter", () => hoverChange(-1));
    hoverRight?.addEventListener("mouseenter", () => hoverChange(1));

    // Init
    goToSlide(0);
    startHero();
  }

  // ---------------------------
  // SERVICES SLIDER
  // ---------------------------
  const serviceSlider = document.querySelector(".services-slider");
  const serviceNext = document.querySelector(".next-btn");
  const servicePrev = document.querySelector(".prev-btn");

  if (serviceSlider) {
    serviceNext?.addEventListener("click", () =>
      serviceSlider.scrollBy({ left: 320, behavior: "smooth" })
    );
    servicePrev?.addEventListener("click", () =>
      serviceSlider.scrollBy({ left: -320, behavior: "smooth" })
    );

    // Auto-scroll on hover
    let scrollInterval;
    serviceSlider.addEventListener("mouseenter", () => {
      scrollInterval = setInterval(() => {
        serviceSlider.scrollBy({ left: 1, behavior: "smooth" });
      }, 20);
    });
    serviceSlider.addEventListener("mouseleave", () =>
      clearInterval(scrollInterval)
    );
  }

  // ---------------------------
  // SMOOTH NAVIGATION
  // ---------------------------
  document.querySelectorAll('.nav-links a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (targetId && targetId !== "#") {
        e.preventDefault();
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          window.scrollTo({
            top: targetEl.offsetTop - 60,
            behavior: "smooth",
          });
        }
      }
    });
  });

  // ---------------------------
  // TOGGLE MOBILE MENU
  // ---------------------------
  const toggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector("nav ul");

  toggle?.addEventListener("click", () => {
    navMenu?.classList.toggle("active");
    toggle.classList.toggle("open");
  });

  // ---------------------------
  // ADD HEADER SHADOW ON SCROLL
  // ---------------------------
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    header?.classList.toggle("scrolled", window.scrollY > 50);
  });

  // ---------------------------
  // CERTIFYING AGENCIES SWIPER
  // ---------------------------
  new Swiper(".swiper-container", {
    slidesPerView: 5,
    spaceBetween: 30,
    loop: true,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },
    speed: 3000,
    allowTouchMove: false,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      1200: { slidesPerView: 5 },
      992: { slidesPerView: 4 },
      768: { slidesPerView: 3 },
      576: { slidesPerView: 2 },
      0: { slidesPerView: 1 },
    },
  });

  // ---------------------------
  // QUOTE FORM (DATABASE PART)
  // ---------------------------
    const quoteForm = document.getElementById("quoteForm");
  const submitBtn = quoteForm?.querySelector("button[type=submit]");

  if (quoteForm) {
    quoteForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const Name = document.getElementById("name").value.trim();
      const Email = document.getElementById("email").value.trim();
      const subject = document.getElementById("subject").value.trim();
      const Description = document.getElementById("description").value.trim();

      // Disable button while saving
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Saving...";
      }

      const result = await addRecord(Name, Email, subject, Description);

      if (result.success) {
        alert("✅ Record saved successfully!");
        e.target.reset();
        loadRecords();
      } else {
        alert("❌ Failed to save record: " + result.error.message);
      }

      // Re-enable button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit";
      }
    });
  }

  // ---------------------------
  // LOAD RECORDS
  // ---------------------------
  async function loadRecords() {
    const container = document.getElementById("recordsList");
    if (!container) return;

    container.innerHTML = "<p>⏳ Loading records...</p>";

    const result = await fetchRecords();

    container.innerHTML = ""; // Clear old content

    if (!result.success || !result.data || result.data.length === 0) {
      container.innerHTML = "<p>No records yet.</p>";
      return;
    }

    result.data.forEach((r) => {
      const item = document.createElement("div");
      item.classList.add("record-item");
      item.innerHTML = `
        <p><strong>${r.Name}</strong> (${r.Email})</p>
        <p>${r.subject} - ${r.Description}</p>
        <small>${r.created_at ? new Date(r.created_at).toLocaleString() : "No timestamp"}</small>
        <hr>
      `;
      container.appendChild(item);
    });
  }

  loadRecords(); // Load on page start
});
