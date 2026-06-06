import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import AOS from 'aos'
import 'aos/dist/aos.css'
import FontAwesome from './plugins/fontawesome'

const app = createApp(App)

FontAwesome(app)
app.mount('#app')

// Initialize AOS after mount
AOS.init({
    once: false,
    mirror: false,
    duration: 620,
    easing: 'ease-out-cubic',
    offset: 72,
    delay: 40,
    anchorPlacement: 'top-bottom',
    disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
});

window.addEventListener('resize', () => {
    AOS.refreshHard();
}, { passive: true });
