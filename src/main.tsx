import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter as Router } from 'react-router-dom'
import './styles/index.scss'

document.addEventListener('contextmenu', (e: any) => {
	e.preventDefault()
})

document.addEventListener('copy', (e: any) => {
	e.preventDefault()
	alert('Copy is Disabled')
})

ReactDOM.createRoot(document.getElementById('root')!).render(
	<Router>
		<React.StrictMode>
			<App />
		</React.StrictMode>
	</Router>
)
