const track = document.querySelector(".carousel-track");
const revealTargets = document.querySelectorAll(".reveal-section, .reveal-item");

document.body.classList.add("js-ready");

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

const forceScrollTop = () => {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  window.requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  });
};

window.addEventListener("DOMContentLoaded", forceScrollTop);
window.addEventListener("load", forceScrollTop);
window.addEventListener("pageshow", forceScrollTop);
window.addEventListener("beforeunload", () => {
  window.scrollTo(0, 0);
});

if ("IntersectionObserver" in window && revealTargets.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        } else {
          entry.target.classList.remove("is-visible");
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealTargets.forEach((target) => {
    revealObserver.observe(target);
  });
} else {
  revealTargets.forEach((target) => {
    target.classList.add("is-visible");
  });
}

if (track) {
  const originalSlides = Array.from(track.children);
  let offset = 0;
  let previousTime = 0;
  let loopPoint = 0;
  let animationFrame = 0;
  let resizeTimeout = 0;

  const buildLoop = () => {
    track.innerHTML = "";

    originalSlides.forEach((slide) => {
      track.appendChild(slide.cloneNode(true));
    });

    originalSlides.forEach((slide) => {
      track.appendChild(slide.cloneNode(true));
    });

    const duplicateStart = track.children[originalSlides.length];
    loopPoint = duplicateStart ? duplicateStart.offsetLeft : 0;
    offset = 0;
    track.style.transform = "translateX(0)";
  };

  const animate = (time) => {
    animationFrame = window.requestAnimationFrame(animate);

    if (!previousTime) {
      previousTime = time;
    }

    const delta = time - previousTime;
    previousTime = time;

    if (loopPoint > 0) {
      offset += delta * 0.024;

      if (offset >= loopPoint) {
        offset -= loopPoint;
      }

      track.style.transform = `translateX(-${offset}px)`;
    }
  };

  const resetCarousel = () => {
    window.cancelAnimationFrame(animationFrame);
    previousTime = 0;
    buildLoop();
    animationFrame = window.requestAnimationFrame(animate);
  };

  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(resetCarousel, 120);
  });

  resetCarousel();
}
