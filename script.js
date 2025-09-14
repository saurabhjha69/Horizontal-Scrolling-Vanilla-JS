function getAbsoluteTopWithMargin(el) {
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    const marginTop = parseFloat(style.marginTop) || 0;
    return rect.top + window.scrollY - marginTop;

}
const scrollingContainer = document.querySelector('.cards-container');
let targetLeft = 0;
let animationFrame = null;
let rect = scrollingContainer.getBoundingClientRect()
let distanceFromTop = getAbsoluteTopWithMargin(scrollingContainer)
function animateScroll() {
    const current = scrollingContainer.scrollLeft;
    const diff = targetLeft - current;

    if (Math.abs(diff) > 0.5) {
        // linear interpolation toward target
        scrollingContainer.scrollLeft = current + diff * 0.1;
        animationFrame = requestAnimationFrame(animateScroll);
    } else {
        // snap to final position & stop loop
        scrollingContainer.scrollTo({
            left: targetLeft,
            behavior: "smooth"
        })
        animationFrame = null;
    }
}

function scrollNow(isIntersecting) {
    let distanceScrolled = document.documentElement.scrollTop // when using smooth scroll use its event object to get y value
    let trigger = distanceScrolled + window.innerHeight;
    let startingPoint = Math.round(distanceFromTop + rect.height);
    let distance = Math.round(window.innerHeight - rect.height);
    let min = startingPoint;
    let max = startingPoint + distance;

    if (trigger <= min && !isIntersecting) {
        targetLeft = 0;
    } else if (trigger >= max && !isIntersecting) {
        targetLeft = Math.round(scrollingContainer.scrollWidth - scrollingContainer.clientWidth);
    } else {
        let perc = (trigger - min) / (distance);
        perc = Math.max(0, Math.min(1, perc));
        targetLeft = Math.round((scrollingContainer.scrollWidth - scrollingContainer.clientWidth) * perc);
    }

    // start animation if not already running
    if (!animationFrame) {
        animationFrame = requestAnimationFrame(animateScroll);
    }
}
window.addEventListener('scroll', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                scrollNow(true)
            } else {
                scrollNow(false)
            }
        });
    }, {
        root: null, // viewport
        threshold: 1 // fire when 10% of element is visible
    });
    
    observer.observe(scrollingContainer);
})
window.addEventListener('resize', () => {
    distanceFromTop = getAbsoluteTopWithMargin(scrollingContainer)
})