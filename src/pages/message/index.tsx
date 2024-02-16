import { useState } from 'react'
import Left from './sections/left'
import Right from './sections/right'
import Modal from '../../component/modal'
import NewMessage from '../../popups/newMessage'

const Message = () => {
	// @ts-ignore
	const [showAddPeopleModal, setShowAddPeopleModal] = useState<boolean>(false)
	return (
		<div id="message" className="col-md-9 col-12 row m-0">
			{showAddPeopleModal ? (
				<Modal
					children={<NewMessage />}
					iconPlacement="left"
					closeIconColor="white"
					modalClass="mt-20"
					onClose={() => setShowAddPeopleModal(false)}
				/>
			) : (
				<></>
			)}
			<Left setShowModal={setShowAddPeopleModal} />
			<Right setShowModal={setShowAddPeopleModal} />
		</div>
	)
}

export default Message
