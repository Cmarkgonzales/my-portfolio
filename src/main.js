import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import FontAwesome from './plugins/fontawesome'

const app = createApp(App)

FontAwesome(app)
app.mount('#app')
