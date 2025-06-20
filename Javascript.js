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
