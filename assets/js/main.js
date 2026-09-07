// LeadersWayPro — interactions front-end (sans dépendance)
document.addEventListener("DOMContentLoaded", () => {
  // Menu mobile
  const toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("nav-open");
    });
  }

  // Ferme le menu mobile après un clic sur un lien
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => document.body.classList.remove("nav-open"));
  });

  // Marque le lien de nav actif selon la page courante
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === current || (current === "" && href === "index.html")) {
      link.classList.add("is-active");
    }
  });

  // Animation d'apparition au scroll
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // N'autoriser qu'un seul <details> ouvert à la fois dans une FAQ
  document.querySelectorAll(".faq").forEach((faq) => {
    const items = faq.querySelectorAll("details");
    items.forEach((item) => {
      item.addEventListener("toggle", () => {
        if (item.open) {
          items.forEach((other) => {
            if (other !== item) other.open = false;
          });
        }
      });
    });
  });

  // Validation légère + message de confirmation pour les formulaires (contact, inscription)
  document.querySelectorAll("#contact-form, #lead-form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const feedback = form.querySelector(".form-feedback");
      if (feedback) {
        feedback.textContent =
          "Merci ! Votre demande a bien été enregistrée. Ilhem ou son équipe vous recontacte sous 24 à 48h ouvrées.";
        feedback.hidden = false;
      }
      form.reset();
    });
  });

  // Année automatique dans le footer
  document.querySelectorAll(".current-year").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
});
