import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import ElementTiptapPlugin from 'element-tiptap-vue3-fixed'
import 'element-plus/dist/index.css'
import 'element-tiptap-vue3-fixed/lib/style.css'
import './style.css'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'

// полифилл flatMap для vuedraggable
if (!Array.prototype.flatMap) {
  // @ts-ignore
  Array.prototype.flatMap = function <T, U>(
    fn: (v: T, i: number, a: T[]) => U | U[]
  ) {
    return this.reduce((acc: U[], x: T, i: number, arr: T[]) => {
      const r = fn(x, i, arr)
      return acc.concat(Array.isArray(r) ? r : [r])
    }, [])
  }
}

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.use(ElementTiptapPlugin)
app.mount('#app')
