import React, { ReactNode } from 'react'

interface ModalProps {
	children: ReactNode
	hasClose?: boolean
	iconPlacement?: 'left' | 'right'
	onClose?: any
	modalClass?: string
	closeIconColor?: string
}

const Modal: React.FC<ModalProps> = ({
	children,
	hasClose = true,
	iconPlacement = 'right',
	onClose = () => {},
	modalClass,
	closeIconColor,
}: ModalProps) => {
	return (
		<div id="modal">
			<main className={`${modalClass}`}>
				{hasClose ? (
					<i
						className={`close-icon material-icons fs-20 ${iconPlacement}`}
						style={{ color: closeIconColor ? closeIconColor : 'black' }}
						onClick={onClose}>
						close
					</i>
				) : (
					<></>
				)}
				{children}
			</main>
		</div>
	)
}

export default Modal
