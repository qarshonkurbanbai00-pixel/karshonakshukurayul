/* ============================================================
   АНИМАЦИЯ МОДУЛІ — preloader, reveal, parallax, counters
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.__REDUCE_MOTION__ = reduceMotion;

  /* ---------------- Preloader ---------------- */
  function initPreloader() {
    var pl = document.getElementById("preloader");
    if (!pl) return;
    if (reduceMotion) {
      pl.classList.add("pl-done");
      setTimeout(function () { pl.remove(); }, 100);
      startHeroAnimations();
      return;
    }
    var lines = pl.querySelectorAll(".pl-line");
    var tl = window.gsap ? gsap.timeline() : null;
    if (tl) {
      tl.to(lines[0], { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.25 })
        .to(lines[1], { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.3")
        .to(lines[2], { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.35")
        .to(pl, {
          opacity: 0, duration: 0.8, delay: 0.55, ease: "power2.inOut",
          onComplete: function () {
            pl.classList.add("pl-done");
            setTimeout(function () { pl.remove(); }, 950);
            startHeroAnimations();
          }
        });
    } else {
      lines.forEach(function (l) { l.style.opacity = 1; l.style.transform = "none"; });
      setTimeout(function () {
        pl.classList.add("pl-done");
        setTimeout(function () { pl.remove(); }, 950);
        startHeroAnimations();
      }, 1600);
    }
  }

  /* ---------------- Hero кезекті анимациясы ---------------- */
  function startHeroAnimations() {
    var items = document.querySelectorAll(".hero-anim");
    items.forEach(function (el) { el.classList.add("hero-in"); });
  }
  // Ішкі беттерде preloader жоқ — hero-аниманы бірден қосамыз
  window.startHeroAnimations = startHeroAnimations;

  /* ---------------- Scroll reveal (IntersectionObserver) ---------------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("revealed"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("revealed");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- Hero parallax ---------------- */
  function initParallax() {
    var bg = document.getElementById("heroBg");
    if (!bg || reduceMotion) return;
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < window.innerHeight * 1.2) {
          bg.style.transform = "translateY(" + y * 0.28 + "px)";
        }
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------------- Counter animation ---------------- */
  function initCounters() {
    var counters = document.querySelectorAll(".counter[data-target]");
    if (!counters.length) return;
    function animate(el) {
      var target = parseInt(el.getAttribute("data-target"), 10) || 0;
      if (reduceMotion) { el.textContent = target; return; }
      var start = null;
      var dur = 1900;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    if (!("IntersectionObserver" in window)) {
      counters.forEach(animate);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animate(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- Navbar scroll күйі ---------------- */
  function initNavbar() {
    var nav = document.getElementById("navbar");
    if (!nav) return;
    function onScroll() {
      nav.classList.toggle("scrolled", window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    var burger = document.getElementById("burger");
    var menu = document.getElementById("mobileMenu");
    if (burger && menu) {
      burger.addEventListener("click", function () {
        var open = menu.classList.toggle("open");
        burger.classList.toggle("open", open);
        burger.setAttribute("aria-expanded", open ? "true" : "false");
        document.body.style.overflow = open ? "hidden" : "";
      });
      menu.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          menu.classList.remove("open");
          burger.classList.remove("open");
          burger.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        });
      });
    }
  }

  /* ---------------- Before/After slider ---------------- */
  function initCompare() {
    var box = document.getElementById("compareSlider");
    if (!box) return;
    var after = box.querySelector(".pane-after");
    var handle = box.querySelector(".handle");
    if (!after || !handle) return;

    // Нақты фотолар енгізілсе — қолданамыз
    var beforeImg = box.getAttribute("data-before-img");
    var afterImg = box.getAttribute("data-after-img");
    if (beforeImg) {
      var pb = box.querySelector(".pane-before");
      pb.style.backgroundImage = "url('" + beforeImg + "')";
      pb.style.backgroundSize = "cover";
      pb.style.backgroundPosition = "center";
    }
    if (afterImg) {
      after.style.backgroundImage = "url('" + afterImg + "')";
      after.style.backgroundSize = "cover";
      after.style.backgroundPosition = "center";
    }

    var dragging = false;
    function setPos(clientX) {
      var r = box.getBoundingClientRect();
      var x = Math.min(Math.max(clientX - r.left, 0), r.width);
      var pct = (x / r.width) * 100;
      after.style.clipPath = "inset(0 0 0 " + pct + "%)";
      handle.style.left = pct + "%";
      box.setAttribute("aria-valuenow", Math.round(pct));
    }
    handle.addEventListener("pointerdown", function (e) {
      dragging = true;
      handle.setPointerCapture(e.pointerId);
    });
    window.addEventListener("pointermove", function (e) {
      if (dragging) setPos(e.clientX);
    });
    window.addEventListener("pointerup", function () { dragging = false; });
    box.addEventListener("pointerdown", function (e) {
      if (e.target === handle) return;
      setPos(e.clientX);
    });
    // Keyboard қолдауы
    box.addEventListener("keydown", function (e) {
      var now = parseFloat(box.getAttribute("aria-valuenow")) || 50;
      var next = now;
      if (e.key === "ArrowLeft") next = Math.max(0, now - 4);
      if (e.key === "ArrowRight") next = Math.min(100, now + 4);
      if (next !== now) {
        e.preventDefault();
        after.style.clipPath = "inset(0 0 0 " + next + "%)";
        handle.style.left = next + "%";
        box.setAttribute("aria-valuenow", next);
      }
    });
  }

  /* ---------------- Архив: фильтр + modal ---------------- */
  function initArchive() {
    var grid = document.getElementById("archiveGrid");
    if (!grid) return;
    var btns = document.querySelectorAll(".filter-btn[data-filter]");
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        btns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var f = btn.getAttribute("data-filter");
        grid.querySelectorAll(".archive-card").forEach(function (card) {
          var show = f === "all" || card.getAttribute("data-category") === f;
          card.style.display = show ? "" : "none";
        });
      });
    });

    var backdrop = document.getElementById("modalBackdrop");
    var content = document.getElementById("modalContent");
    var closeBtn = document.getElementById("modalClose");
    if (!backdrop || !content) return;

    function closeModal() {
      backdrop.classList.remove("open");
      backdrop.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
    function openModal(html) {
      content.innerHTML = html;
      backdrop.classList.add("open");
      backdrop.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }
    window.__openModal = openModal;
    window.__closeModal = closeModal;

    grid.querySelectorAll(".archive-card").forEach(function (card) {
      function open() {
        var file = card.getAttribute("data-arc-file");
        var viewer;
        if (file && /\.(png|jpe?g|webp|gif)$/i.test(file)) {
          viewer = '<div class="viewer" style="border:none;padding:0;"><img src="' + file + '" alt="' + card.getAttribute("data-arc-title") + '" style="border-radius:10px;"></div>';
        } else if (file && /\.pdf$/i.test(file)) {
          viewer = '<div class="viewer" style="border:none;padding:0;height:60vh;"><iframe src="' + file + '" style="width:100%;height:100%;border:0;border-radius:10px;" title="PDF"></iframe></div>';
        } else {
          viewer = '<div class="viewer">' + (card.getAttribute("data-arc-placeholder") || "Материал енгізіледі") + "</div>";
        }
        openModal(
          "<h3>" + card.getAttribute("data-arc-title") + "</h3>" +
          '<div class="meta-row">' +
            '<span class="badge badge-' + card.getAttribute("data-arc-badgetype") + '">' + card.getAttribute("data-arc-badge") + "</span>" +
            '<span style="color:var(--muted);font-size:0.85rem;">' + (card.getAttribute("data-arc-year") || "жылы белгісіз") + " · " + card.getAttribute("data-arc-type") + "</span>" +
          "</div>" + viewer
        );
      }
      card.addEventListener("click", open);
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
      });
    });

    closeBtn.addEventListener("click", closeModal);
    backdrop.addEventListener("click", function (e) { if (e.target === backdrop) closeModal(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });
  }

  /* ---------------- init ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    initPreloader();
    // preloader болмаған беттерде hero-anim бірден қосылады
    if (!document.getElementById("preloader")) startHeroAnimations();
    initReveal();
    initParallax();
    initCounters();
    initNavbar();
    initCompare();
    initArchive();
  });
})();
