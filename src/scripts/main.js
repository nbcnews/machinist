import {sayHello} from './modules/a'
// import './vendor/ai2html-resizer'

const element = document.createElement('h1')

element.innerHTML = sayHello('World')

document.body.appendChild(element)
