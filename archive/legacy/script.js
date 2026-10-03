/* ============================================================
   YummyFit — Homepage interactions
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sticky nav state ---------- */
  var nav = document.getElementById("nav");

  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  function closeMenu() {
    if (!toggle || !links) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    links.classList.remove("is-open");
  }

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      links.classList.toggle("is-open", !open);
    });

    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") closeMenu();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 880) closeMenu();
    });
  }

  /* ---------- Auto-stagger children of .stagger groups ---------- */
  document.querySelectorAll(".stagger").forEach(function (group) {
    group.querySelectorAll(".reveal").forEach(function (el, i) {
      if (!el.style.getPropertyValue("--d")) {
        el.style.setProperty("--d", (i * 0.09).toFixed(2) + "s");
      }
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -6% 0px" }
    );

    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Count-up stats ---------- */
  function formatNumber(value, decimals) {
    if (decimals > 0) return value.toFixed(decimals);
    return Math.round(value).toLocaleString("en-US");
  }

  function runCount(el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1500;
    var start = null;

    if (reduceMotion) {
      el.textContent = formatNumber(target, decimals) + suffix;
      return;
    }

    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = formatNumber(target * eased, decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll("[data-count]");

  if ("IntersectionObserver" in window) {
    var counterIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCount(entry.target);
            counterIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) { counterIO.observe(el); });
  } else {
    counters.forEach(runCount);
  }

  /* ---------- Hero background video ---------- */
  var video = document.getElementById("heroVideo");

  if (video) {
    var showVideo = function () {
      video.classList.add("is-ready");
      var p = video.play();
      if (p && typeof p.catch === "function") p.catch(function () {});
    };

    if (video.readyState >= 2) showVideo();
    video.addEventListener("canplay", showVideo, { once: true });
    video.addEventListener("error", function () {
      video.classList.remove("is-ready"); // fall back to the animated gradient
    });
  }

  /* ---------- Waitlist form ---------- */
  var form = document.getElementById("waitlistForm");
  var success = document.getElementById("waitlistSuccess");
  var successName = document.getElementById("successName");
  var resetBtn = document.getElementById("resetForm");

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setError(input, message) {
    var field = input.closest(".field");
    if (!field) return;
    var slot = field.querySelector(".field__error");
    field.classList.toggle("is-invalid", Boolean(message));
    if (slot) slot.textContent = message || "";
  }

  function validate() {
    if (!form) return false;
    var ok = true;

    var name = form.elements.namedItem("name");
    if (!name.value.trim()) {
      setError(name, "Please tell us your name.");
      ok = false;
    } else {
      setError(name, "");
    }

    var email = form.elements.namedItem("email");
    if (!EMAIL_RE.test(email.value.trim())) {
      setError(email, "Enter a valid email address.");
      ok = false;
    } else {
      setError(email, "");
    }

    var price = form.elements.namedItem("willingness");
    if (!price.value) {
      setError(price, "Pick a range — it shapes our pricing.");
      ok = false;
    } else {
      setError(price, "");
    }

    if (!ok) {
      var firstInvalid = form.querySelector(".field.is-invalid input, .field.is-invalid select");
      if (firstInvalid) firstInvalid.focus();
    }

    return ok;
  }

  if (form) {
    form.addEventListener("input", function (e) {
      if (e.target && e.target.closest(".field.is-invalid")) setError(e.target, "");
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) return;

      var payload = {
        name: form.elements.namedItem("name").value.trim(),
        email: form.elements.namedItem("email").value.trim(),
        willingness: form.elements.namedItem("willingness").value,
        joinedAt: new Date().toISOString()
      };

      // Persist locally so the signal survives a refresh (pre-launch placeholder).
      try {
        var list = JSON.parse(localStorage.getItem("yummyfit_waitlist") || "[]");
        list.push(payload);
        localStorage.setItem("yummyfit_waitlist", JSON.stringify(list));
      } catch (err) {
        /* storage unavailable — still show success */
      }

      if (successName) successName.textContent = payload.name.split(" ")[0];
      form.hidden = true;
      if (success) success.hidden = false;
    });
  }

  if (resetBtn && form && success) {
    resetBtn.addEventListener("click", function () {
      form.reset();
      form.hidden = false;
      success.hidden = true;
      var first = form.querySelector("input");
      if (first) first.focus();
    });
  }
})();
