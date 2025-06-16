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
    once: true,
    duration: 800,
    easing: 'ease-out-cubic',
     offset: 100
})
