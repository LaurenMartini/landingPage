/**
 * 
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 * 
 * Dependencies: None
 * 
 * JS Version: ES2015/ES6
 * 
 * JS Standard: ESlint
 * 
 * SOURCES AND CREDITS
 * Mutation Observer Code based on this example:
 * https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
 * 
 * Scroll to Top Button Code based on this guide:
 * https://www.w3schools.com/howto/howto_js_scroll_to_top.asp
*/

/**
 * Define Global Variables
 * 
*/
// nav bar elements
const navListElems = document.getElementById("navbar__list");
// store the first element with class name of section__container
// this holds the elements that will populate the nav bar
const sectionElem = document.querySelector('.section__container');
// mutation observer options
const observeElem = { attributes: true, childList: true, subtree: true };
// initialize observer
const observer = new MutationObserver(buildNav);
// scroll button
const scrollBtn = document.querySelector('.scrollBtn');

/**
 * End Global Variables
 * Start Helper Functions
 * 
*/
// remove all children helper
// based on tutorial: https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/
function removeAllChildren(parentElem) {
    while (parentElem.firstChild) {
        parentElem.removeChild(parentElem.firstChild);
    }
}

// add list elements to document fragment
function addElemsToFragment(fragmentElem, numberOfLoops, childElems) {
    for(let i = 0; i < numberOfLoops; i++) {
        // create both elements needed, the list element and the anchor
        const listElem = document.createElement('li');
        const anchorElem = document.createElement('a');
        const anchorLink = '#section' + (i + 1);

        // build anchor element up
        anchorElem.setAttribute('href', anchorLink);
        anchorElem.setAttribute('class', 'menu__link');
        anchorElem.innerText = childElems[i].dataset.nav;

        // add click event to the anchor
        anchorElem.addEventListener('click', function(event) {
            event.preventDefault();
            scrollToAnchor(anchorLink);
        })

        // add class to list element
        listElem.setAttribute('class', 'navbar__listElem');

        // append anchor to the list elem
        listElem.appendChild(anchorElem);

        // add list elem to fragment
        fragmentElem.appendChild(listElem);
    }
}
/**
 * End Helper Functions
 * Begin Main Functions
 * 
*/

// build the nav
function buildNav() {
    // hide current nav elems
    navListElems.style.display = 'none';

    //remove old nav elems
    removeAllChildren(navListElems);

    // get the number of children that the sectionElem has
    const numChildren = sectionElem.childElementCount;

    // children elems
    const sectionChildren = sectionElem.children;

    // create document fragment
    const fragment = document.createDocumentFragment();

    // add the elements to the fragment
    addElemsToFragment(fragment,numChildren,sectionChildren);

    // append the fragment with list items to the unordered list
    navListElems.appendChild(fragment);

    // now render the elements
    navListElems.style.display = "block";
}

// Add class 'active' to section when near top of viewport
function addActiveClass(anchorElem) {
    const noHashAnchor = anchorElem.substring(1);
    
    // go through the section container elements
    for (let i = 0; i < sectionElem.childElementCount; i++){
        const currentChild = sectionElem.children[i];
        if (currentChild.id === noHashAnchor && !currentChild.classList.contains('your-active-class')) {
            currentChild.classList.add('your-active-class');
        } else if (currentChild.classList.contains('your-active-class')) {
            currentChild.classList.remove('your-active-class');
        }
    }
}

// Add class 'selected' to link when clicked on or top of viewport
function addSelectedClass(anchorElem) {
    for (let i = 0; i < navListElems.childElementCount; i++) {
        const currentChild = navListElems.children[i];
        const currentLink = currentChild.firstChild;
        console.log('current link: ', currentLink);
        console.log('current link hash: ', currentLink.hash);
        if(currentLink.hash === anchorElem && !currentLink.classList.contains('selected')) {
            currentLink.classList.add('selected');
        } else if(currentLink.classList.contains('selected')) {
            currentLink.classList.remove('selected');
        }
    }
}

// Scroll to anchor ID using scrollTO event
function scrollToAnchor(anchorElem) {
    document.querySelector(anchorElem).scrollIntoView({
        behavior: 'smooth'
    });
    addActiveClass(anchorElem);
    // addSelectedClass(anchorElem); //- doesn't work...
}

// Scroll to top of page upon button click
function scrollToTop() {
    document.body.scrollTop = 0; // for safari
    document.documentElement.scrollTop = 0; // for all other browsers

    // remove active class from all sections as none are active
    
}

// Show scroll to top button when page is scrolled
function uponScroll() {
    if(document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollBtn.style.display = "block";
    } else {
        scrollBtn.style.display = "none";
    }
}

/**
 * End Main Functions
 * Begin Events
 * 
*/

// Build menu
// Upon load
document.onload = buildNav();

// Update when new sections are added
observer.observe(sectionElem, observeElem);

// Note when page scrolled
window.onscroll = function(){uponScroll()};