import { useEffect, useState } from 'react'

interface Snackbar {
	state?: 'success' | 'warning' | 'failed'
	title?: string
	description?: string
	active?: boolean
	setActive?: any
	duration?: number
}
const Snackbar = ({
	title,
	description,
	active,
	setActive,
	duration,
	state = 'success',
}: Snackbar) => {
	const [close, setClose] = useState<boolean>(active ? active : false)

	useEffect(() => {
		if (active) {
			setTimeout(
				() => {
					setActive(false)
					setClose(false)
				},
				duration ? duration * 1000 : 3000
			)
		}
	}, [active])
	return (
		close && (
			<div id="snackbar" className={state}>
				<i className="material-icons fs-22">
					{state === 'success'
						? 'check_circle'
						: state === 'warning'
						? 'info'
						: 'close'}
				</i>
				<div className="content">
					<div className="fs-17 font-700 lh-22">{title}</div>
					<div className="fs-13 font-300 lh-18" style={{ color: '#C8C5C5' }}>
						{description}
					</div>
				</div>
			</div>
		)
	)
}

export default Snackbar
