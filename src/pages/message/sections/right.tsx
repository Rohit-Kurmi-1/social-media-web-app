import { useEffect, useRef, useState } from 'react'
import Modal from '../../../component/modal'
import EmojiModal from '../../../popups/emojisModal'
import GifModal from '../../../popups/gifModal'
import { useMyContext } from '../../../App'
import { checkUser, doChat, getUserChats } from '../../../utils/api'
import { useNavigate, useSearchParams } from 'react-router-dom'

interface Right {
	setShowModal?: any
}
const Right = ({ setShowModal }: Right) => {
	const navigate = useNavigate()
	const { userData } = useMyContext()
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const fileRef = useRef<HTMLInputElement>(null)
	const [searchParams, setSearchParams] = useSearchParams()
	const [text, setText] = useState('')
	const [img, setImg] = useState('')
	const [showGifModal, setShowGifModal] = useState<boolean>(false)
	const [showEmojiModal, setShowEmojiModal] = useState<boolean>(false)
	const [chats, setChats] = useState<any[]>([])
	const [userDetails, setUserDetails] = useState<any>({})
	const [otherUser, setOtherUser] = useState('')
	const recipientUser = searchParams.get('u')

	const fetchUserDetails = async () => {
		try {
			if (recipientUser) {
				const user = await checkUser(recipientUser)
				if (user.data && user.data.email) {
					setUserDetails(user.data)
				}
			}
		} catch (error) {
			console.log(error)
		}
	}

	const handleSubmit = async () => {
		const payload = {
			sender: userData.email,
			text,
			img,
			timeStamp: Date.now(),
		}
		try {
			const resp = await doChat(
				{
					email: userData.email,
					profilePic: userData.profilePic,
					name: userData.name,
				},
				userDetails.email,
				payload
			)
			setChats([...chats, payload])
		} catch (error) {
			console.log(error)
		}
		setText('')
		setImg('')
	}

	const fetchChats = async () => {
		try {
			const resp = await getUserChats(userData.email, userDetails.email)
			if (resp && resp.length) {
				setChats(resp)
			}
		} catch (error) {
			console.log(error)
		}
	}

	const handleImgInput = (e: any) => {
		if (e.target.files && e.target.files[0]) {
			const raw = e.target.files[0]
			const Image = URL.createObjectURL(raw)
			setImg(Image)
		}
	}

	useEffect(() => {
		if (textareaRef.current && text.length) {
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
		} else if (textareaRef.current && !text.length) {
			textareaRef.current.style.height = 'auto'
		}
	}, [text])

	useEffect(() => {
		setOtherUser(recipientUser)
		if (!userData.messageFriend?.some((item) => item.email === recipientUser)) {
			return
		}

		if (recipientUser) {
			fetchUserDetails()
		}
	}, [recipientUser])

	useEffect(() => {
		if (userDetails.email) {
			fetchChats()
		}
	}, [userDetails])

	return (
		<div
			className={`col-md-7 col-12 rightPart ${!otherUser && 'hide-on-mobile'}`}>
			{showGifModal ? (
				<Modal
					children={<GifModal onSelect={setImg} onClose={setShowGifModal} />}
					closeIconColor="white"
					iconPlacement="left"
				/>
			) : (
				<></>
			)}
			{showEmojiModal ? (
				<Modal
					children={
						<EmojiModal
							textRef={textareaRef}
							onClose={setShowEmojiModal}
							setTextArea={setText}
						/>
					}
					closeIconColor="white"
					iconPlacement="left"
				/>
			) : (
				<></>
			)}
			{!userDetails.email ? (
				<div className="NoMessageContainer">
					<div>
						<div className="fs-40 lh-52 font-700">Add a Message</div>
						<div className="fs-14 lh-20 font-500 dark-gray mt-6 w-75">
							Choose from your existing conversations, start a new conversation,
							or just enjoy the conversation.
						</div>
						<button
							className="cylinderical-p mt-24"
							onClick={() => setShowModal(true)}>
							<span className="ml-4 mr-4">New Message</span>
						</button>
					</div>
				</div>
			) : (
				<div className="p-8 messagesContainer">
					<div className="d-flex jutify-content-between align-items-center userDetails">
						<div className="d-flex align-items-center">
							<i
								className="material-icons align-middle fs-20 font-600 show-on-mobile mr-8"
								onClick={() => navigate('/message')}>
								arrow_back
							</i>
							<img src={userDetails.profilePic} width={40} height={40} />
							<div className="fs-18 font-600 lh-24 ml-12 mr-4">
								{userDetails.name}
							</div>
							<img src="/icons/blue-tick.png" width={21} height={21} />
						</div>
					</div>
					<div className="scrollableDiv">
						<div className="messages">
							{chats.map((message, index) => (
								<div
									className={` ${
										message.sender == userData.email ? 'myChat' : 'yourChat'
									}`}
									key={message.text + index}>
									<div className="fs-14 lh-18 font-300">{message.text}</div>
									{message.img ? (
										<img src={message.img} alt="" className="messageImg" />
									) : (
										<></>
									)}
								</div>
							))}
						</div>
					</div>
					<div className="richInput">
						<input
							type="file"
							className="d-none"
							ref={fileRef}
							onChange={handleImgInput}
						/>
						<div className="">
							{img ? (
								<div className="pl-55">
									<img src={img} style={{ maxHeight: 300 }} />
								</div>
							) : (
								<></>
							)}
							<div className="d-flex align-items-end">
								<div className="d-flex justify-content-between">
									<i
										className="material-symbols-outlined fs-20 primary"
										onClick={() => fileRef.current?.click()}>
										image
									</i>
									<i
										className="material-symbols-outlined fs-20 primary ml-4"
										onClick={() => setShowGifModal((pre) => !pre)}>
										gif_box
									</i>
									<i
										className="material-symbols-outlined fs-20 primary ml-4"
										onClick={() => setShowEmojiModal(!showEmojiModal)}>
										sentiment_satisfied
									</i>
								</div>
								<textarea
									ref={textareaRef}
									className="comment-input w-100 ml-8"
									value={text}
									placeholder="Write Here"
									rows={1}
									onChange={(e) => {
										if (e.target.value.length < 375) {
											setText(e.target.value)
										}
									}}
								/>
								<i
									className="material-icons fs-20 primary"
									onClick={handleSubmit}>
									send
								</i>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default Right
