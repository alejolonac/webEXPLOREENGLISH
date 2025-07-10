document.addEventListener('DOMContentLoaded', () => {
    const trackInner = document.querySelector('.nosotros__track-inner');
    const slides = trackInner.querySelectorAll('.nosotros__carrusel-slide');
    const prevButton = document.querySelector('.carrusel-prev');
    const nextButton = document.querySelector('.carrusel-next');
    
    let isButtonEnabled = true;
    const buttonCooldown = 500;
    
    // Solo clonar slides si no estamos en móvil
    const isMobile = window.innerWidth <= 768;
    let currentIndex = 0;
    let totalSlides;
    
    if (!isMobile) {
        // Código del carrusel desktop...
        const slidesToClone = 3;
        const allSlides = Array.from(slides);
        
        for (let i = allSlides.length - 1; i >= allSlides.length - slidesToClone; i--) {
            const clone = allSlides[i].cloneNode(true);
            trackInner.insertBefore(clone, trackInner.firstChild);
        }
        
        for (let i = 0; i < slidesToClone; i++) {
            const clone = allSlides[i].cloneNode(true);
            trackInner.appendChild(clone);
        }
        
        currentIndex = slidesToClone;
        totalSlides = allSlides.length;
    } else {
        totalSlides = slides.length;
    }
    
    // Variables para el touch
    let touchStartX = 0;
    let startTranslate = 0;
    let isDragging = false;

    function getCurrentTranslate() {
        const style = window.getComputedStyle(trackInner);
        const matrix = new WebKitCSSMatrix(style.transform);
        return matrix.m41;
    }

    function touchStart(event) {
        touchStartX = event.touches[0].clientX;
        startTranslate = getCurrentTranslate();
        isDragging = true;
        trackInner.style.transition = 'none';
    }

    function touchMove(event) {
        if (!isDragging) return;
        
        event.preventDefault();
        const currentX = event.touches[0].clientX;
        const diff = currentX - touchStartX;
        const newTranslate = startTranslate + diff;
        
        // Limitar el scroll con un poco más de margen
        const maxScroll = 100; // Permitir un poco de scroll hacia la derecha
        const minScroll = -(trackInner.scrollWidth - trackInner.clientWidth + 100); // Permitir un poco más de scroll hacia la izquierda
        
        if (newTranslate <= maxScroll && newTranslate >= minScroll) {
            trackInner.style.transform = `translateX(${newTranslate}px)`;
        }
    }

    function touchEnd() {
        isDragging = false;
    }

    // Funciones del carrusel
    function getSlideWidth() {
        const slide = slides[0];
        const style = window.getComputedStyle(slide);
        const width = parseFloat(style.width);
        const gap = parseFloat(window.getComputedStyle(trackInner).gap) || 16;
        return width + gap;
    }
    
    function updateActiveSlide() {
        if (!isMobile) {
            trackInner.querySelectorAll('.nosotros__carrusel-slide').forEach(slide => {
                slide.classList.remove('active');
            });
            
            const allSlides = trackInner.querySelectorAll('.nosotros__carrusel-slide');
            const middleSlide = allSlides[currentIndex + 1];
            if (middleSlide) {
                middleSlide.classList.add('active');
            }
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
        if (!isMobile) {
            updateActiveSlide();
        }
        
        trackInner.offsetHeight;
    }
    
    function resetPosition() {
        if (!isMobile) {
            if (currentIndex >= totalSlides + 3) {
                trackInner.querySelectorAll('.nosotros__carrusel-slide').forEach(slide => {
                    slide.classList.add('no-transition');
                });
                
                currentIndex = 3;
                updateCarousel(true);
                
                trackInner.offsetHeight;
                
                setTimeout(() => {
                    trackInner.querySelectorAll('.nosotros__carrusel-slide').forEach(slide => {
                        slide.classList.remove('no-transition');
                    });
                }, 50);
            } else if (currentIndex < 3) {
                trackInner.querySelectorAll('.nosotros__carrusel-slide').forEach(slide => {
                    slide.classList.add('no-transition');
                });
                
                currentIndex = totalSlides + 2;
                updateCarousel(true);
                
                trackInner.offsetHeight;
                
                setTimeout(() => {
                    trackInner.querySelectorAll('.nosotros__carrusel-slide').forEach(slide => {
                        slide.classList.remove('no-transition');
                    });
                }, 50);
            }
        }
    }
    
    // Inicialización y eventos
    if (!isMobile) {
        updateCarousel(true);
        trackInner.addEventListener('transitionend', resetPosition);
    }
    
    if (isMobile) {
        // Eventos touch para móvil
        trackInner.addEventListener('touchstart', touchStart, { passive: true });
        trackInner.addEventListener('touchmove', touchMove, { passive: false });
        trackInner.addEventListener('touchend', touchEnd);
    }
    
    window.addEventListener('resize', () => {
        const newIsMobile = window.innerWidth <= 768;
        if (newIsMobile !== isMobile) {
            location.reload();
        }
        if (!isMobile) {
            updateCarousel(true);
        }
    });
    
    // Botones de navegación
    prevButton.addEventListener('click', () => {
        if (!isButtonEnabled) return;
        
        isButtonEnabled = false;
        if (isMobile) {
            const currentTranslate = getCurrentTranslate();
            const slideWidth = getSlideWidth();
            trackInner.style.transition = 'transform 0.5s ease';
            trackInner.style.transform = `translateX(${currentTranslate + slideWidth}px)`;
        } else {
            currentIndex--;
            updateCarousel();
        }
        
        setTimeout(() => {
            isButtonEnabled = true;
        }, buttonCooldown);
    });
    
    nextButton.addEventListener('click', () => {
        if (!isButtonEnabled) return;
        
        isButtonEnabled = false;
        if (isMobile) {
            const currentTranslate = getCurrentTranslate();
            const slideWidth = getSlideWidth();
            trackInner.style.transition = 'transform 0.5s ease';
            trackInner.style.transform = `translateX(${currentTranslate - slideWidth}px)`;
        } else {
            currentIndex++;
            updateCarousel();
        }
        
        setTimeout(() => {
            isButtonEnabled = true;
        }, buttonCooldown);
    });
});

// Carrusel de Instalaciones
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carrusel-instalaciones__track-inner');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carrusel-next-instalaciones');
    const prevButton = document.querySelector('.carrusel-prev-instalaciones');

    let isButtonEnabled = true;
    const buttonCooldown = 500; // medio segundo de espera entre clicks

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
        if (!isButtonEnabled) return;
        
        isButtonEnabled = false;
        moveToSlide(1);
        
        setTimeout(() => {
            isButtonEnabled = true;
        }, buttonCooldown);
    });

    // Click en el botón anterior
    prevButton.addEventListener('click', () => {
        if (!isButtonEnabled) return;
        
        isButtonEnabled = false;
        moveToSlide(-1);
        
        setTimeout(() => {
            isButtonEnabled = true;
        }, buttonCooldown);
    });

    // Manejar el reset de posición después de la transición
    track.addEventListener('transitionend', resetPosition);

    // Activar el primer slide
    allSlides[currentIndex].classList.add('active');
});


window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav');
    if (window.scrollY > 80) { 
        nav.classList.add('nav-scrolled');
    } else {
        nav.classList.remove('nav-scrolled');
    }
});

// Menú hamburguesa
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('nav-hamburguer');
    const navList = document.querySelector('.nav__list');
    
    if (hamburger && navList) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navList.classList.toggle('active');
        });
        
        // Cerrar menú al hacer clic en un enlace
        const navLinks = document.querySelectorAll('.nav__link, .nav__link-activo');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navList.classList.remove('active');
            });
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navList.contains(event.target)) {
                hamburger.classList.remove('active');
                navList.classList.remove('active');
            }
        });
    }
});

// Carrusel táctil
let touchStartX = 0;
let touchEndX = 0;
let startTranslate = 0;
let isDragging = false;

// Seleccionar el elemento del carrusel
const track = document.querySelector('.nosotros__track-inner');

if (track) {
    // Obtener la posición actual del transform
    function getCurrentTranslate() {
        const style = window.getComputedStyle(track);
        const matrix = new WebKitCSSMatrix(style.transform);
        return matrix.m41; // La posición X del transform
    }

    function touchStart(event) {
        touchStartX = event.touches[0].clientX;
        startTranslate = getCurrentTranslate();
        isDragging = true;
    }

    function touchMove(event) {
        if (!isDragging) return;
        
        event.preventDefault();
        const currentX = event.touches[0].clientX;
        const diff = currentX - touchStartX;
        const newTranslate = startTranslate + diff;
        
        // Limitar el scroll
        const maxScroll = 0;
        const minScroll = -((track.scrollWidth - track.clientWidth));
        
        if (newTranslate <= maxScroll && newTranslate >= minScroll) {
            track.style.transform = `translateX(${newTranslate}px)`;
        }
    }

    function touchEnd() {
        isDragging = false;
    }

    track.addEventListener('touchstart', touchStart, { passive: true });
    track.addEventListener('touchmove', touchMove, { passive: false });
    track.addEventListener('touchend', touchEnd);
}