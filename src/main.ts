import { createApp } from 'vue'
import App from './App.vue'

import WaveUI from 'wave-ui'
import 'wave-ui/dist/wave-ui.css'

import Amplify from 'aws-amplify'
import '@aws-amplify/ui-vue'
import aws_exports from './aws-exports'
import '@aws-amplify/ui-vue/styles.css';

Amplify.configure(aws_exports)

const app = createApp(App)
// app.use(AmplifyVue)
new WaveUI(app, {})

app.mount('#app')
