document.addEventListener("DOMContentLoaded", function () {
  const track = document.getElementById("carousel-track");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const dotsContainer = document.getElementById("dots-container");

  if (!track) return;

  const slides = track.querySelectorAll(".carousel-slide");
  const totalSlides = slides.length;

  // Determine slides per view based on screen size
  const getSlidesPerView = () => {
    if (window.innerWidth >= 1024) return 3; // lg
    if (window.innerWidth >= 768) return 2; // md
    return 1; // sm
  };

  let currentSlide = 0;
  let slidesPerView = getSlidesPerView();
  let maxSlide = Math.max(0, totalSlides - slidesPerView);

  const updateDots = () => {
    if (dotsContainer) {
      dotsContainer.innerHTML = "";
      const numDots = maxSlide + 1;
      if (numDots > 1) {
        for (let i = 0; i < numDots; i++) {
          const button = document.createElement("button");
          button.className =
            "dot w-3 h-3 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors";
          button.dataset.slide = i.toString();
          button.setAttribute("aria-label", `Ir a página de slides ${i + 1}`);
          dotsContainer.appendChild(button);
        }
      }
    }
  };

  const updateCarousel = () => {
    const translateX = -(currentSlide * (100 / slidesPerView));
    (track as HTMLElement).style.transform = `translateX(${translateX}%)`;

    // Update navigation buttons
    if (prevBtn) (prevBtn as HTMLButtonElement).disabled = currentSlide === 0;
    if (nextBtn)
      (nextBtn as HTMLButtonElement).disabled = currentSlide >= maxSlide;

    // Update dots
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll(".dot");
      dots.forEach((dot, index) => {
        dot.classList.toggle("bg-blue-600", index === currentSlide);
        dot.classList.toggle("bg-gray-300", index !== currentSlide);
      });
    }
  };

  const goToSlide = (slideIndex: number, fromAutoplay: boolean = false) => {
    currentSlide = Math.max(0, Math.min(slideIndex, maxSlide));
    updateCarousel();
    if (!fromAutoplay) {
      stopAutoPlay();
      startAutoPlay();
    }
  };

  // Navigation buttons
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      goToSlide(currentSlide - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      goToSlide(currentSlide + 1);
    });
  }

  // Dots navigation
  if (dotsContainer) {
    dotsContainer.addEventListener("click", (e) => {
      const dot = (e.target as HTMLElement)?.closest(".dot") as HTMLElement;
      if (dot) {
        const slideIndex =
          parseInt((dot as HTMLElement).dataset.slide || "0") * slidesPerView;
        goToSlide(slideIndex);
      }
    });
  }

  // Handle window resize
  window.addEventListener("resize", () => {
    const newSlidesPerView = getSlidesPerView();
    if (newSlidesPerView !== slidesPerView) {
      slidesPerView = newSlidesPerView;
      maxSlide = Math.max(0, totalSlides - slidesPerView);
      currentSlide = Math.min(currentSlide, maxSlide);
      updateDots();
      updateCarousel();
    }
  });

  // Auto-play functionality (optional)
  let autoPlayInterval: ReturnType<typeof setInterval> | undefined;
  const startAutoPlay = () => {
    autoPlayInterval = setInterval(() => {
      if (currentSlide >= maxSlide) {
        goToSlide(0, true);
      } else {
        goToSlide(currentSlide + 1, true);
      }
    }, 5000);
  };

  const stopAutoPlay = () => {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
  };

  // Start auto-play and pause on hover
  if (totalSlides > slidesPerView) {
    startAutoPlay();
    track.addEventListener("mouseenter", stopAutoPlay);
    track.addEventListener("mouseleave", startAutoPlay);
  }

  // Initialize
  updateDots();
  updateCarousel();

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goToSlide(currentSlide - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goToSlide(currentSlide + 1);
    }
  });

  // Touch/swipe support
  let startX = 0;
  let startY = 0;
  let isDragging = false;

  track.addEventListener("touchstart", (e) => {
    startX = (e as TouchEvent).touches[0].clientX;
    startY = (e as TouchEvent).touches[0].clientY;
    isDragging = true;
  });

  track.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const currentX = (e as TouchEvent).touches[0].clientX;
    const currentY = (e as TouchEvent).touches[0].clientY;
    const diffX = Math.abs(startX - currentX);
    const diffY = Math.abs(startY - currentY);

    if (diffX > diffY) {
      e.preventDefault();
    }
  });

  track.addEventListener("touchend", (e) => {
    if (!isDragging) return;
    isDragging = false;

    const endX = (e as TouchEvent).changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToSlide(currentSlide + 1);
      } else {
        goToSlide(currentSlide - 1);
      }
    }
  });
});
