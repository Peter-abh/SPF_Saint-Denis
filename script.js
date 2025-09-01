// ================================
// CONFIGURATION API SHEETDB
// ================================

// URLs de vos APIs SheetDB - À REMPLACER par vos vraies URLs
const API_CONFIG = {
    actualites: 'https://sheetdb.io/api/v1/u69brhpkwtkiu',
    evenements: 'https://sheetdb.io/api/v1/25xkcgecn7nka'
};

// ================================
// GESTION DE L'ÉTAT GLOBAL
// ================================

let currentDate = new Date();
let actualitesData = [];
let evenementsData = [];

// Variables pour le carrousel
let currentSlide = 0;
let totalSlides = 3;
let carouselInterval;

// ================================
// INITIALISATION DE L'APPLICATION
// ================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des composants
    initMobileMenu();
    initSmoothScroll();
    initCarousel();
    initCalendar();
    
    // Chargement des données
    loadActualites();
    loadEvenements();
    
    console.log('✅ Application Secours Populaire Saint-Denis initialisée');
});

// ================================
// GESTION DU CARROUSEL HERO
// ================================

function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    if (!slides.length || !dots.length) return;
    
    // Gestion des boutons précédent/suivant
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
        });
    }
    
    // Gestion des indicateurs (dots)
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
    // Démarrer le carrousel automatique
    startCarouselAutoplay();
    
    // Pause/reprise au survol
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', pauseCarousel);
        carouselContainer.addEventListener('mouseleave', startCarouselAutoplay);
    }
    
    // Gestion des touches clavier
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            goToSlide(currentSlide - 1);
        } else if (e.key === 'ArrowRight') {
            goToSlide(currentSlide + 1);
        }
    });
}

function goToSlide(slideIndex) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    
    if (!slides.length || !dots.length) return;
    
    // Gérer le bouclage
    if (slideIndex >= totalSlides) {
        currentSlide = 0;
    } else if (slideIndex < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = slideIndex;
    }
    
    // Mettre à jour les slides
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
    
    // Mettre à jour les indicateurs
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
    
    // Redémarrer l'autoplay
    pauseCarousel();
    startCarouselAutoplay();
}

function startCarouselAutoplay() {
    pauseCarousel(); // S'assurer qu'il n'y a pas d'interval en cours
    carouselInterval = setInterval(() => {
        goToSlide(currentSlide + 1);
    }, 5000); // Changer de slide toutes les 5 secondes
}

function pauseCarousel() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
        carouselInterval = null;
    }
}

// ================================
// GESTION DU MENU MOBILE
// ================================

function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            // Animation de l'icône hamburger
            const icon = mobileMenuBtn.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            } else {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
        });
        
        // Fermer le menu mobile lors du clic sur un lien
        const navLinks = mobileMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
}

// ================================
// NAVIGATION FLUIDE
// ================================

function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ================================
// CHARGEMENT DES ACTUALITÉS
// ================================

async function loadActualites() {
    const container = document.getElementById('actualites-container');
    // On ajoute une vérification : si le conteneur n'existe pas sur la page, on arrête la fonction.
    if (!container) return;
    
    try {
        // Pour la démo, nous utilisons des données factices
        // Remplacez cette section par un vrai fetch vers votre API
        
        const response = await fetch(API_CONFIG.actualites);
        if (!response.ok) throw new Error('Erreur lors du chargement des actualités');
        actualitesData = await response.json();
        
        
        // DONNÉES DE DÉMO - Remplacez par votre vraie API
        
        displayActualites(actualitesData);
        
    } catch (error) {
        console.error('❌ Erreur lors du chargement des actualités:', error);
        displayActualitesError();
    }
}

function displayActualites(actualites) {
    const container = document.getElementById('actualites-container');
    
    // Effacer les placeholders de chargement
    container.innerHTML = '';
    
    actualites.slice(0, 3).forEach((actualite, index) => {
        const actualiteCard = createActualiteCard(actualite, index);
        container.appendChild(actualiteCard);
    });
}

function createActualiteCard(actualite, index) {
    const card = document.createElement('div');
    card.className = 'actualite-card bg-white rounded-lg shadow-md overflow-hidden slide-in-up';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const formattedDate = new Date(actualite.date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    card.innerHTML = `
        <img src="${actualite.image}" alt="${actualite.titre}" class="actualite-image" 
             onerror="this.src='assets/images/placeholder.jpg'">
        <div class="p-6">
            <div class="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                <i class="fas fa-calendar"></i>
                <span>${formattedDate}</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">${actualite.titre}</h3>
            <p class="text-gray-600 mb-4">${actualite.description}</p>
            <div class="flex items-center space-x-4 text-sm text-gray-500">
                <button class="flex items-center space-x-1 hover:text-red-600 transition-colors">
                    <i class="far fa-heart"></i>
                    <span>0</span>
                </button>
                <button class="flex items-center space-x-1 hover:text-red-600 transition-colors">
                    <i class="far fa-comment"></i>
                    <span>0</span>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function displayActualitesError() {
    const container = document.getElementById('actualites-container');
    container.innerHTML = `
        <div class="col-span-full text-center py-8">
            <i class="fas fa-exclamation-triangle text-4xl text-gray-400 mb-4"></i>
            <p class="text-gray-600">Impossible de charger les actualités pour le moment.</p>
            <button onclick="loadActualites()" class="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors font-medium text-lg">
                Réessayer
            </button>
        </div>
    `;
}

// ================================
// CHARGEMENT DES ÉVÉNEMENTS
// ================================

async function loadEvenements() {
    try {
        const response = await fetch(API_CONFIG.evenements);
        if (!response.ok) throw new Error('Erreur lors du chargement des événements');
        evenementsData = await response.json();
        
         // Ligne de débogage à ajouter manuellement
         console.log('Données des événements reçues de l-API :', evenementsData);
        
        displayProchainEvenement();
        updateCalendarWithEvents();
        updateCarouselProchainEvenement(); // Nouvelle fonction
        
    } catch (error) {
        console.error('Erreur lors du chargement des événements:', error);
        displayEvenementsError();
        updateCarouselProchainEvenementError();
    }
}

function displayProchainEvenement() {
    const container = document.getElementById('prochaines-activites');
    
    // Vérifier si le conteneur existe avant de continuer
    if (!container) {
        console.log("Le conteneur 'prochaines-activites' n'a pas été trouvé sur cette page.");
        return; // Sortir de la fonction si le conteneur n'existe pas
    }
    
    const now = new Date();
    
    // Vérifier si evenementsData est défini et est un tableau
    if (!Array.isArray(evenementsData)) {
        container.innerHTML = '<p class="text-gray-500">Aucune donnée d\'événement disponible.</p>';
        return;
    }
    
    // Filtrer et trier les événements futurs
    const futureEvents = evenementsData
        .filter(event => event && event.date) // S'assurer que l'événement et sa date existent
        .filter(event => new Date(parseDate(event.date)) >= now)
        .sort((a, b) => new Date(parseDate(a.date)) - new Date(parseDate(b.date)))
        .slice(0, 4);
    
    container.innerHTML = '';
    
    if (futureEvents.length === 0) {
        container.innerHTML = '<p class="text-gray-500">Aucune activité à venir pour le moment.</p>';
        return;
    }
    
    futureEvents.forEach((event, index) => {
        const eventCard = createEventCard(event, index);
        container.appendChild(eventCard);
    });
}

function createEventCard(event, index) {
    const card = document.createElement('div');
    card.className = 'activite-card slide-in-up';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const formattedDate = new Date(parseDate(event.date)).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const typeColor = getEventTypeColor(event.type);
    
    card.innerHTML = `
        <div class="flex items-start space-x-3">
            <div class="w-3 h-3 ${typeColor} rounded-full mt-2 flex-shrink-0"></div>
            <div class="flex-1">
                <div class="activite-date">${formattedDate} - ${event.heure}</div>
                <div class="activite-titre">${event.titre}</div>
                <div class="activite-lieu">${event.lieu}</div>
            </div>
        </div>
    `;
    
    return card;
}

function displayEvenementsError() {
    const container = document.getElementById('prochaines-activites');
    container.innerHTML = `
        <div class="text-center py-4">
            <i class="fas fa-exclamation-triangle text-2xl text-gray-400 mb-2"></i>
            <p class="text-gray-600 text-sm">Impossible de charger les événements.</p>
        </div>
    `;
}

// Fonction utilitaire pour convertir la date de JJ-MM-AAAA en AAAA-MM-JJ
function parseDate(dateString) {
    const parts = dateString.split('-');
    if (parts.length === 3) {
        // Recompose la date en format AAAA-MM-JJ
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateString; // Retourne la chaîne originale si le format est inattendu
}

// ================================
// GESTION DU CALENDRIER
// ================================

function initCalendar() {
    const prevBtn = document.getElementById('prev-month');
    const nextBtn = document.getElementById('next-month');
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            generateCalendar();
        });
        
        nextBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            generateCalendar();
        });
    }
    
    generateCalendar();
}

function generateCalendar() {
    const monthYearElement = document.getElementById('calendar-month-year');
    const calendarGrid = document.getElementById('calendar-grid');
    
    if (!monthYearElement || !calendarGrid) return;
    
    // Mettre à jour le titre du mois
    const monthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    
    monthYearElement.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    
    // Vider la grille
    calendarGrid.innerHTML = '';
    
    // Ajouter les en-têtes des jours
    const dayHeaders = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-header';
        header.textContent = day;
        calendarGrid.appendChild(header);
    });
    
    // Calculer le premier jour du mois et le nombre de jours
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Ajuster pour que lundi soit le premier jour (0)
    let firstDayOfWeek = (firstDay.getDay() + 6) % 7;
    
    // Ajouter les jours du mois précédent
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const day = prevMonth.getDate() - i;
        const dayElement = createCalendarDay(day, true, false);
        calendarGrid.appendChild(dayElement);
    }
    
    // Ajouter les jours du mois actuel
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = today.getFullYear() === currentDate.getFullYear() &&
                       today.getMonth() === currentDate.getMonth() &&
                       today.getDate() === day;
        
        const dayElement = createCalendarDay(day, false, isToday);
        
        // Ajouter les événements pour ce jour
        const dayEvents = getEventsForDay(currentDate.getFullYear(), currentDate.getMonth(), day);
        dayEvents.forEach((event, index) => {
            if (index < 4) { // Limiter à 4 événements par jour
                const dot = document.createElement('div');
                dot.className = `event-dot ${getEventTypeColorClass(event.type)}`;
                dayElement.appendChild(dot);
            }
        });
        
        if (dayEvents.length > 0) {
            dayElement.classList.add('has-event');
        }
        
        calendarGrid.appendChild(dayElement);
    }
    
    // Compléter avec les jours du mois suivant
    const totalCells = calendarGrid.children.length - 7; // -7 pour les en-têtes
    const remainingCells = 42 - totalCells; // 6 semaines * 7 jours
    
    for (let day = 1; day <= remainingCells; day++) {
        const dayElement = createCalendarDay(day, true, false);
        calendarGrid.appendChild(dayElement);
    }
}

function createCalendarDay(day, isOtherMonth, isToday) {
    const dayElement = document.createElement('div');
    dayElement.className = `calendar-day ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`;
    
    const dayNumber = document.createElement('div');
    dayNumber.className = 'calendar-day-number';
    dayNumber.textContent = day;
    
    dayElement.appendChild(dayNumber);
    
    return dayElement;
}

function getEventsForDay(year, month, day) {
    const targetDate = new Date(year, month, day);
    const targetDateString = targetDate.toISOString().split('T')[0];
    
    return evenementsData.filter(event => parseDate(event.date) === targetDateString);
}

function updateCalendarWithEvents() {
    generateCalendar(); // Régénérer le calendrier avec les événements
}

// ================================
// UTILITAIRES POUR LES TYPES D'ÉVÉNEMENTS
// ================================

function getEventTypeColor(type) {
    const colors = {
        'Accès aux droits': 'bg-green-500',
        'Distribution Alimentaire': 'bg-orange-500', 
        'Cultures et Loisirs': 'bg-pink-500',
        'Aide Internationale': 'bg-blue-500',
        'Hygiène et Santé': 'bg-red-500',
        'Collecte/Braderie': 'bg-gray-900'
    };
    return colors[type] || 'bg-gray-400';
}

function getEventTypeColorClass(type) {
    const colors = {
        'Accès aux droits': 'green',
        'Distribution Alimentaire': 'orange',
        'Cultures et Loisirs': 'pink', 
        'Aide Internationale': 'blue',
        'Hygiène et Santé': 'red',
        'Collecte/Braderie': 'black'
    };
    return colors[type] || 'gray';
}

// ================================
// FONCTIONS HELPER POUR L'API
// ================================

// Fonction pour fetch les données depuis SheetDB
async function fetchFromSheetDB(url) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Erreur lors du fetch SheetDB:', error);
        throw error;
    }
}

// Fonction pour poster des données vers SheetDB (si nécessaire)
async function postToSheetDB(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
        
    } catch (error) {
        console.error('Erreur lors du post SheetDB:', error);
        throw error;
    }
}

// ================================
// GESTION DES ERREURS GLOBALES
// ================================

window.addEventListener('error', function(e) {
    console.error('❌ Erreur JavaScript:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('❌ Promesse rejetée:', e.reason);
});

// ================================
// MISE À JOUR DYNAMIQUE DU SLIDE 3
// ================================

function updateCarouselProchainEvenement() {
    // Premier emplacement possible (dans le carrousel principal)
    let slideContainer = document.getElementById('slide-prochaine-activite');
    
    // Deuxième emplacement possible (section dédiée)
    if (!slideContainer) {
        slideContainer = document.getElementById('prochaine-activite-carousel');
    }
    
    if (!slideContainer) return;
    
    const now = new Date();
    
    // Trouver la prochaine activité
    const futureEvents = evenementsData
        .filter(event => new Date(parseDate(event.date)) >= now)
        .sort((a, b) => new Date(parseDate(a.date)) - new Date(parseDate(b.date)));
    
    if (futureEvents.length === 0) {
        // Aucune activité future
        slideContainer.innerHTML = `
            <div class="mb-6">
                <span class="bg-gray-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Aucune activité prévue
                </span>
            </div>
            <h1 class="text-4xl md:text-6xl font-bold mb-6">
                Restez connectés
            </h1>
            <p class="text-xl md:text-2xl mb-8 text-gray-200">
                De nouvelles activités seront bientôt programmées
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button class="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium text-lg">
                    Devenir Bénévole
                </button>
                <button class="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-gray-900 transition-colors font-medium text-lg">
                    Nous contacter
                </button>
            </div>
        `;
        return;
    }
    
    const prochainEvent = futureEvents[0];
    
    // Formatage de la date
    const eventDate = new Date(parseDate(prochainEvent.date));
    const formattedDate = eventDate.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric', 
        month: 'long',
        day: 'numeric'
    });
    
    // Capitaliser la première lettre
    const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    
    // Déterminer la couleur du badge selon le type d'activité
    const badgeColor = getBadgeColorForEventType(prochainEvent.type);
    
    // Vérifier si on est dans le carrousel ou dans la section dédiée
    const isInCarousel = slideContainer.id === 'slide-prochaine-activite';
    
    // Générer le contenu dynamique
    if (isInCarousel) {
        // Version pour le carrousel
        slideContainer.innerHTML = `
            <div class="mb-6">
                <span class="${badgeColor} text-white px-4 py-2 rounded-full text-sm font-medium">
                    Prochaine activité
                </span>
            </div>
            <h1 class="text-4xl md:text-6xl font-bold mb-6">
                ${prochainEvent.titre}
            </h1>
            <p class="text-xl md:text-2xl mb-8 text-gray-200">
                ${capitalizedDate}<br>
                ${prochainEvent.heure}<br>
                <span class="text-lg"><i class="fas fa-map-marker-alt mr-2"></i>${prochainEvent.lieu}</span>
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button class="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium text-lg" onclick="scrollToCalendar()">
                    Participer
                </button>
                <button class="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-gray-900 transition-colors font-medium text-lg" onclick="scrollToCalendar()">
                    Voir le calendrier
                </button>
            </div>
        `;
    } else {
        // Version pour la section dédiée
        slideContainer.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-md">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold text-gray-900">${prochainEvent.titre}</h3>
                    <span class="${badgeColor} text-white px-3 py-1 rounded-full text-xs font-medium">
                        ${prochainEvent.type}
                    </span>
                </div>
                <div class="space-y-2 text-gray-700">
                    <p class="flex items-center">
                        <i class="far fa-calendar-alt w-5 mr-2 text-red-600"></i>
                        ${capitalizedDate}
                    </p>
                    <p class="flex items-center">
                        <i class="far fa-clock w-5 mr-2 text-red-600"></i>
                        ${prochainEvent.heure}
                    </p>
                    <p class="flex items-center">
                        <i class="fas fa-map-marker-alt w-5 mr-2 text-red-600"></i>
                        ${prochainEvent.lieu}
                    </p>
                </div>
                <div class="mt-6 flex justify-between items-center">
                    <button onclick="scrollToCalendar()" class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium">
                        Voir le calendrier complet
                    </button>
                </div>
            </div>
        `;
    }
}

function updateCarouselProchainEvenementError() {
    const slideContainer = document.getElementById('slide-prochaine-activite');
    if (!slideContainer) return;
    
    slideContainer.innerHTML = `
        <div class="mb-6">
            <span class="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                Erreur de chargement
            </span>
        </div>
        <h1 class="text-4xl md:text-6xl font-bold mb-6">
            Informations indisponibles
        </h1>
        <p class="text-xl md:text-2xl mb-8 text-gray-200">
            Impossible de charger les prochaines activités
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button class="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium text-lg" onclick="loadEvenements()">
                Réessayer
            </button>
            <button class="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-gray-900 transition-colors font-medium text-lg" onclick="scrollToContact()">
                Nous contacter
            </button>
        </div>
    `;
}

function getBadgeColorForEventType(type) {
    const badgeColors = {
        'Accès aux droits': 'bg-green-500',
        'Distribution Alimentaire': 'bg-orange-500',
        'Cultures et Loisirs': 'bg-pink-500',
        'Aide Internationale': 'bg-blue-500',
        'Hygiène et Santé': 'bg-red-500',
        'Collecte/Braderie': 'bg-gray-900'
    };
    return badgeColors[type] || 'bg-orange-500';
}

// Fonctions utilitaires pour les boutons
function scrollToCalendar() {
    const calendarSection = document.getElementById('calendrier');
    if (calendarSection) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = calendarSection.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = contactSection.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Fonction pour refresh les données
function refreshData() {
    console.log('🔄 Rechargement des données...');
    loadActualites();
    loadEvenements();
    // Le slide 3 sera automatiquement mis à jour après le chargement des événements
}

// Fonction pour déboguer
function debugInfo() {
    console.log('📊 Debug Info:');
    console.log('Current Date:', currentDate);
    console.log('Actualités Data:', actualitesData);
    console.log('Événements Data:', evenementsData);
}

// Export des fonctions principales pour le debugging
window.secourspopulaire = {
    refreshData,
    debugInfo,
    loadActualites,
    loadEvenements
};