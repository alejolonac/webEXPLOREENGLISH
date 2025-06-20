document.addEventListener('DOMContentLoaded', () => {
    const trackInner = document.querySelector('.nosotros__track-inner');
    const slides = trackInner.querySelectorAll('.nosotros__carrusel-slide');
    const prevButton = document.querySelector('.carrusel-prev');
    const nextButton = document.querySelector('.carrusel-next');
    
    // Duplicar los primeros slides al final y los últimos al inicio
    const firstSlides = Array.from(slides).slice(0, 3);
    const lastSlides = Array.from(slides).slice(-3);
    
    // Agregar los últimos slides al inicio
    lastSlides.forEach(slide => {
        const clone = slide.cloneNode(true);
        trackInner.insertBefore(clone, trackInner.firstChild);
    });
    
    // Agregar los primeros slides al final
    firstSlides.forEach(slide => {
        const clone = slide.cloneNode(true);
        trackInner.appendChild(clone);
    });
    
    let currentIndex = 3; // Comenzamos en el primer slide real (después de los clones)
    const totalSlides = slides.length;
    
    function getSlideWidth() {
        const slide = slides[0];
        const style = window.getComputedStyle(slide);
        const width = parseFloat(style.width);
        const gap = parseFloat(window.getComputedStyle(trackInner).gap) || 16;
        return width + gap;
    }
    
    function updateActiveSlide() {
        // Remover la clase active de todos los slides
        trackInner.querySelectorAll('.nosotros__carrusel-slide').forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Añadir la clase active al slide del medio (currentIndex + 1)
        const allSlides = trackInner.querySelectorAll('.nosotros__carrusel-slide');
        const middleSlide = allSlides[currentIndex + 1];
        if (middleSlide) {
            middleSlide.classList.add('active');
        }
    }
    
    function updateCarousel(instant = false) {
        const slideWidth = getSlideWidth();
        const offset = -currentIndex * slideWidth;
        
        if (instant) {
            trackInner.style.transition = 'none';
        } else {
            trackInner.style.transition = 'transform 0.5s ease';
        }
        
        trackInner.style.transform = `translateX(${offset}px)`;
        updateActiveSlide();
        
        // Forzar reflow
        trackInner.offsetHeight;
    }
    
    function resetPosition() {
        if (currentIndex >= totalSlides + 3) {
            currentIndex = 3;
            updateCarousel(true);
        } else if (currentIndex < 3) {
            currentIndex = totalSlides + 2;
            updateCarousel(true);
        }
    }
    
    // Inicializar posición
    updateCarousel(true);
    
    // Manejar transitionend solo una vez por transición
    trackInner.addEventListener('transitionend', () => {
        resetPosition();
    });
    
    // Actualizar carrusel cuando cambie el tamaño de la ventana
    window.addEventListener('resize', () => updateCarousel(true));
    
    prevButton.addEventListener('click', () => {
        currentIndex--;
        updateCarousel();
    });
    
    nextButton.addEventListener('click', () => {
        currentIndex++;
        updateCarousel();
    });
});

// Carrusel de Instalaciones
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carrusel-instalaciones__track-inner');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carrusel-next-instalaciones');
    const prevButton = document.querySelector('.carrusel-prev-instalaciones');
    const dotsContainer = document.querySelector('.carrusel-instalaciones-dots');

    // Crear los dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carrusel-instalaciones-dot');
        if (index === 0) dot.classList.add('active');
        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    // Configurar el ancho de los slides
    const slideWidth = slides[0].getBoundingClientRect().width;
    
    // Posicionar los slides uno al lado del otro
    const setSlidePosition = (slide, index) => {
        slide.style.left = slideWidth * index + 'px';
    };
    slides.forEach(setSlidePosition);

    const moveToSlide = (track, currentSlide, targetSlide) => {
        track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
        currentSlide.classList.remove('active');
        targetSlide.classList.add('active');

        // Actualizar estado de los botones
        const currentIndex = slides.findIndex(slide => slide === targetSlide);
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === slides.length - 1;

        // Actualizar estilos de los botones
        prevButton.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextButton.style.opacity = currentIndex === slides.length - 1 ? '0.5' : '1';
        prevButton.style.cursor = currentIndex === 0 ? 'not-allowed' : 'pointer';
        nextButton.style.cursor = currentIndex === slides.length - 1 ? 'not-allowed' : 'pointer';
    };

    const updateDots = (currentDot, targetDot) => {
        currentDot.classList.remove('active');
        targetDot.classList.add('active');
    };

    // Click en el botón siguiente
    nextButton.addEventListener('click', () => {
        const currentSlide = track.querySelector('.active');
        const nextSlide = currentSlide.nextElementSibling;
        if (nextSlide) {
            const currentDot = dotsContainer.querySelector('.active');
            const nextDot = currentDot.nextElementSibling;
            moveToSlide(track, currentSlide, nextSlide);
            updateDots(currentDot, nextDot);
        }
    });

    // Click en el botón anterior
    prevButton.addEventListener('click', () => {
        const currentSlide = track.querySelector('.active');
        const prevSlide = currentSlide.previousElementSibling;
        if (prevSlide) {
            const currentDot = dotsContainer.querySelector('.active');
            const prevDot = currentDot.previousElementSibling;
            moveToSlide(track, currentSlide, prevSlide);
            updateDots(currentDot, prevDot);
        }
    });

    // Click en los dots
    dotsContainer.addEventListener('click', e => {
        const targetDot = e.target.closest('button');
        if (!targetDot) return;

        const currentSlide = track.querySelector('.active');
        const currentDot = dotsContainer.querySelector('.active');
        const targetIndex = dots.findIndex(dot => dot === targetDot);
        const targetSlide = slides[targetIndex];

        moveToSlide(track, currentSlide, targetSlide);
        updateDots(currentDot, targetDot);
    });

    // Activar el primer slide y configurar estado inicial de los botones
    slides[0].classList.add('active');
    prevButton.disabled = true;
    prevButton.style.opacity = '0.5';
    prevButton.style.cursor = 'not-allowed';
});
