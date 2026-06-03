document.addEventListener('DOMContentLoaded', () => {
    const intro = document.querySelector('.intro');
    const logoSpans = document.querySelectorAll('.logo');

    logoSpans.forEach((span, idx) => {
        setTimeout(() => {
            span.classList.add('active');
        }, (idx + 1) * 300);
    });

    setTimeout(() => {
        if (intro) {
            intro.style.transform = 'translateY(-100vh)';
        }
    }, 2000);
});
