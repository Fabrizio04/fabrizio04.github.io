let slideIndex = 1;
let touchstartX = 0;
let touchendX = 0;

const handleSwipe = () => {
    const threshold = 50;
    if (touchendX < touchstartX - threshold) {
        plusSlides(1);
    }
    if (touchendX > touchstartX + threshold) {
        plusSlides(-1);
    }
}

const imgModal = document.getElementById("imgModal");

imgModal.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX;
}, {passive: true});

imgModal.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX;
    handleSwipe();
}, {passive: true});

const toggleModal = (id) => {
    const modal = document.getElementById(id);
    const isOpening = modal.style.display !== "flex";
    modal.style.display = isOpening ? "flex" : "none";

    if (!isOpening && id === 'videoModal') {
        const iframe = document.getElementById('ytPlayer');
        iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    }
}

// const openImgModal = () => { toggleModal('imgModal'); showSlides(slideIndex); }

const openImgModal = (projectId) => {
    const images = projectData[projectId];
    
    if (!images || images.length === 0) {
        console.error("Errore: Nessuna immagine trovata per il progetto", projectId);
        return;
    }


    const modalContent = document.querySelector("#imgModal .slides-container");
    const dotContainer = document.querySelector("#imgModal .dot-container");
    const slideTemplate = document.getElementById('slide-template');
    const dotTemplate = document.getElementById('dot-template');

    
    if (!modalContent || !slideTemplate) {
        console.error("Errore: Struttura della modale o template non trovati nel DOM.");
        return;
    }

    
    const oldSlides = modalContent.querySelectorAll('.mySlides');
    oldSlides.forEach(el => el.remove());
    
    
    dotContainer.innerHTML = "";

    
    images.forEach((imgSrc, index) => {
        
        const slideClone = slideTemplate.content.cloneNode(true);
        const imgTag = slideClone.querySelector('img');
        
        imgTag.src = imgSrc;
        imgTag.alt = imgSrc.replace(/^.*[\\/]/, '').split(".")[0];
        imgTag.title = "Zoom";
        // zoomBtn.href = imgSrc;
        
        imgTag.onclick = () => {
            window.open(imgSrc, '_blank');
        };
        
        
        modalContent.insertBefore(slideClone, modalContent.querySelector('.prev'));
        
        const dotClone = dotTemplate.content.cloneNode(true);
        const dotSpan = dotClone.querySelector('.dot');
        dotSpan.onclick = () => currentSlide(index + 1);
        
        dotContainer.appendChild(dotClone);
    });

    
    slideIndex = 1;
    toggleModal('imgModal');
    showSlides(slideIndex);
};

const plusSlides = n => showSlides(slideIndex += n);
const currentSlide = n => showSlides(slideIndex = n);

// const showSlides = n => {
//     let slides = document.getElementsByClassName("mySlides");
//     let dots = document.getElementsByClassName("dot");
//     if (n > slides.length) { slideIndex = 1 }
//     if (n < 1) { slideIndex = slides.length }
//     for (let i = 0; i < slides.length; i++) { slides[i].style.display = "none"; }
//     for (let i = 0; i < dots.length; i++) { dots[i].className = dots[i].className.replace(" active", ""); }
//     slides[slideIndex - 1].style.display = "block";
//     dots[slideIndex - 1].className += " active";
// }

const showSlides = n => {
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        slides[i].classList.remove("fade-in");
    }
    
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    slides[slideIndex - 1].style.display = "block";
    
    setTimeout(() => {
        slides[slideIndex - 1].classList.add("fade-in");
    }, 20);

    dots[slideIndex - 1].className += " active";
}

// document.addEventListener('keydown', event => {
//     if (document.getElementById('imgModal').style.display === "block") {
//         if (event.key === "ArrowLeft") plusSlides(-1);
//         else if (event.key === "ArrowRight") plusSlides(1);
//         else if (event.key === "Escape") toggleModal('imgModal');
//     } else if (document.getElementById('videoModal').style.display === "block") {
//         if (event.key === "Escape") toggleModal('videoModal');
//     }
// });

document.addEventListener('keydown', event => {
    
    const imgModal = document.getElementById('imgModal');
    const videoModal = document.getElementById('videoModal');

    if (imgModal && imgModal.style.display !== "none" && imgModal.style.display !== "") {
        if (event.key === "ArrowLeft") plusSlides(-1);
        else if (event.key === "ArrowRight") plusSlides(1);
        else if (event.key === "Escape") toggleModal('imgModal');
    } 
    else if (videoModal && videoModal.style.display !== "none" && videoModal.style.display !== "") {
        if (event.key === "Escape") toggleModal('videoModal');
    }
});

window.onclick = event => {
    if (event.target.classList.contains('modal')) {
        const modalId = event.target.id;
        toggleModal(modalId);
    }
}



document.addEventListener('DOMContentLoaded', () => {
    if (!sessionStorage.getItem('languagePreference')) {
        const userLang = navigator.language || navigator.userLanguage;

        if (!userLang.startsWith('it')) {
            sessionStorage.setItem('languagePreference', 'en');
            window.location.href = './en/';
        }
    }
});

const backToTopBtn = document.getElementById("backToTop");

const scrollFunction = () => {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
}

backToTopBtn.onclick = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

window.onscroll = () => {
    scrollFunction();
};