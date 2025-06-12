import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

createApp(App).mount('#app')

// Initialize AOS after mount
AOS.init({
    once: true,
    duration: 1000,
    easing: 'ease-out-cubic',
     offset: 100
})
