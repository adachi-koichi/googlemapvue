import GoogleMapVue from "./GoogleMapVue.vue";
import {defineCustomElement} from 'vue'

const GoogleMapVue3 = defineCustomElement(GoogleMapVue)

// console.log(GoogleMapVue.styles) // ['/* css content */']

// export individual elements
export {GoogleMapVue3}

export function register() {
    customElements.define('google-map-vue3', GoogleMapVue3)
}
