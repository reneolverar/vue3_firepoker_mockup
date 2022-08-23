import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

const pinia = createPinia()

const requireComponent = require.context(
    './components/baseComponents',
    false,
    /Base[A-Z]\w+\.(vue|js)$/
)

const app = createApp(App)

requireComponent.keys().forEach(fileName => {
    // console.log(fileName)
    const componentConfig = requireComponent(fileName)

    const componentName = upperFirst(
      camelCase(fileName.replace(/^\.\/(.*)\.\w+$/, '$1'))
    )

    app.component(componentName, componentConfig.default || componentConfig)
})

app
    .use(pinia)
    .use(router)
    .mount('#app')