import './newMessage.scss'
const NewMessage = () => {
	return (
		<div id="newMessage" className="bg-dark text-light">
			<div className="p-20 pb-0 pl-45 d-flex justify-content-between align-items-center">
				<div className="fs-18 lh-24 font-500">New Message</div>
				<div className="button-naked text-dark size-s">
					<span className="ml-4 mr-4 fs-6">Next</span>
				</div>
			</div>
			<div className="peopleSearch mt-12">
				<i className="material-icons fs-20 align-middle ml-8">search</i>
				<input
					type="text"
					placeholder="Search For People"
					style={{ width: '90%' }}
				/>
			</div>
			<div className="hr"></div>
			<div className="p-12 makeAGroup">
				<div className="icon-container">
					<i className="material-icons fs-20 primary">diversity_1</i>
				</div>
				<div className="fs-16 font-500 lh-20 primary ml-8">
					Make a Community
				</div>
			</div>
			<div className="hr"></div>
		</div>
	)
}

export default NewMessage
