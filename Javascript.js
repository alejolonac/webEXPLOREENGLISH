document.addEventListener('DOMContentLoaded', () => {
    const trackInner = document.querySelector('.nosotros__track-inner');
    const slides = trackInner.querySelectorAll('.nosotros__carrusel-slide');
    const prevButton = document.querySelector('.carrusel-prev');
    const nextButton = document.querySelector('.carrusel-next');
    
    // Duplicar los slides necesarios para el carrusel infinito
    const slidesToClone = 3;
    const allSlides = Array.from(slides);
    
    // Agregar slides al inicio
    for (let i = allSlides.length - 1; i >= allSlides.length - slidesToClone; i--) {
        const clone = allSlides[i].cloneNode(true);
        trackInner.insertBefore(clone, trackInner.firstChild);
    }
    
    // Agregar slides al final
    for (let i = 0; i < slidesToClone; i++) {
        const clone = allSlides[i].cloneNode(true);
        trackInner.appendChild(clone);
    }
    
    let currentIndex = slidesToClone; // Comenzamos en el primer slide real
    const totalSlides = allSlides.length;
    
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
        if (currentIndex >= totalSlides + slidesToClone) {
            // Añadir clase no-transition a todos los slides
            trackInner.querySelectorAll('.nosotros__carrusel-slide').forEach(slide => {
                slide.classList.add('no-transition');
            });
            
            currentIndex = slidesToClone;
            updateCarousel(true);
            
            // Forzar reflow
            trackInner.offsetHeight;
            
            // Remover clase no-transition después de un momento
            setTimeout(() => {
                trackInner.querySelectorAll('.nosotros__carrusel-slide').forEach(slide => {
                    slide.classList.remove('no-transition');
                });
            }, 50);
        } else if (currentIndex < slidesToClone) {
            // Añadir clase no-transition a todos los slides
            trackInner.querySelectorAll('.nosotros__carrusel-slide').forEach(slide => {
                slide.classList.add('no-transition');
            });
            
            currentIndex = totalSlides + (slidesToClone - 1);
            updateCarousel(true);
            
            // Forzar reflow
            trackInner.offsetHeight;
            
            // Remover clase no-transition después de un momento
            setTimeout(() => {
                trackInner.querySelectorAll('.nosotros__carrusel-slide').forEach(slide => {
                    slide.classList.remove('no-transition');
                });
            }, 50);
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

    // Clonar slides para el carrusel infinito
    const slidesToClone = 6; // Número de slides visibles
    
    // Clonar slides al final
    for (let i = 0; i < slidesToClone; i++) {
        const clone = slides[i].cloneNode(true);
        track.appendChild(clone);
    }
    
    // Clonar slides al inicio
    for (let i = slides.length - 1; i >= slides.length - slidesToClone; i--) {
        const clone = slides[i].cloneNode(true);
        track.insertBefore(clone, track.firstChild);
    }

    const allSlides = Array.from(track.children);
    
    // Configurar el ancho de los slides
    const slideWidth = slides[0].getBoundingClientRect().width;
    
    // Posicionar los slides uno al lado del otro
    const setSlidePosition = (slide, index) => {
        slide.style.left = slideWidth * index + 'px';
    };
    allSlides.forEach(setSlidePosition);

    // Posicionar el carrusel en el primer slide real
    let currentIndex = slidesToClone;
    track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;

    const moveToSlide = (direction) => {
        track.style.transition = 'transform 0.5s ease-in-out';
        currentIndex += direction;
        track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;

        // Remover clase active del slide actual
        const currentActive = track.querySelector('.active');
        if (currentActive) currentActive.classList.remove('active');
        
        // Añadir clase active al nuevo slide
        allSlides[currentIndex].classList.add('active');
    };

    const resetPosition = () => {
        if (currentIndex >= allSlides.length - slidesToClone) {
            // Si llegamos al final, saltar al inicio
            track.style.transition = 'none';
            currentIndex = slidesToClone;
            track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
        } else if (currentIndex < slidesToClone) {
            // Si llegamos al inicio, saltar al final
            track.style.transition = 'none';
            currentIndex = allSlides.length - slidesToClone * 2;
            track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
        }
    };

    // Click en el botón siguiente
    nextButton.addEventListener('click', () => {
        moveToSlide(1);
    });

    // Click en el botón anterior
    prevButton.addEventListener('click', () => {
        moveToSlide(-1);
    });

    // Manejar el reset de posición después de la transición
    track.addEventListener('transitionend', resetPosition);

    // Activar el primer slide
    allSlides[currentIndex].classList.add('active');
});
