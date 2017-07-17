import {sayHello} from './modules/a'

const element = document.createElement('h1')

element.innerHTML = sayHello('World')

document.body.appendChild(element)
