import { createApp } from 'vue'
import App from './App.vue'

import WaveUI from 'wave-ui'
import 'wave-ui/dist/wave-ui.css'

import AmplifyVue from '@aws-amplify/ui-vue'
import '@aws-amplify/ui-vue/styles.css'
import Amplify, { Auth } from 'aws-amplify';
import aws_exports from './aws-exports.js'

Amplify.configure(aws_exports);
Auth.configure(aws_exports);

const app = createApp(App)
app.use(AmplifyVue)
new WaveUI(app, {})

app.mount('#app')
