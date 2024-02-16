import { useEffect, useRef, useState } from 'react'
import GifModal from '../../../popups/gifModal'
import Modal from '../../../component/modal'
import EmojiModal from '../../../popups/emojisModal'
import { createAPost, uploadImage } from '../../../utils/api'
import { useMyContext } from '../../../App'
import './tweet.scss'

interface I {
	setPosts: any
	posts: any[]
}
const TweetInput = ({ setPosts, posts }: I) => {
	const { userData } = useMyContext()
	const { MyToast } = useMyContext()
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const fileRef = useRef<HTMLInputElement>(null)
	const [text, setText] = useState('')
	const [img, setImg] = useState('')
	const [showGifModal, setShowGifModal] = useState<boolean>(false)
	const [showEmojiModal, setShowEmojiModal] = useState<boolean>(false)
	const [buttonloading, setButtonLoading] = useState<boolean>(false)
	useEffect(() => {
		if (textareaRef.current && text.length) {
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
		} else if (textareaRef.current && !text.length) {
			textareaRef.current.style.height = 'auto'
		}
	}, [text])

	const handleSubmit = async () => {
		if (!text) {
			MyToast.error({
				title: 'Write Some Text Content',
			})
			return
		}
		if (buttonloading) {
			return
		}
		setButtonLoading(true)
		try {
			const payload: any = {
				userName: userData.name,
				text,
				img,
				profilePic: userData.profilePic,
			}
			const resp = await createAPost(payload)
			if (!resp?.id) {
				MyToast.error({
					title: 'Something went wrong',
					description: 'Check Your Internet Connection',
				})
			} else {
				payload.id = resp.id
				setPosts([payload, ...posts])
			}
		} catch (error) {
			MyToast.error({
				title: 'Something went wrong',
			})
		}
		setText('')
		setImg('')
		setButtonLoading(false)
	}

	const handleImgInput = async (e: any) => {
		if (e.target.files && e.target.files[0]) {
			const img = await uploadImage(e.target.files[0])
			if (img) {
				setImg(img)
			}
		}
	}
	return (
		<div id="tweetSection">
			{showGifModal ? (
				<Modal
					onClose={() => setShowGifModal(false)}
					modalClass="mt-60"
					children={<GifModal onSelect={setImg} onClose={setShowGifModal} />}
					closeIconColor="white"
					iconPlacement="left"
				/>
			) : (
				<></>
			)}
			{showEmojiModal ? (
				<Modal
					modalClass="mt-60"
					onClose={() => setShowEmojiModal(false)}
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
			<input
				type="file"
				className="d-none"
				ref={fileRef}
				onChange={handleImgInput}
			/>
			<div className="p-12 pt-0">
				<div className=" d-flex align-items-start mt-3">
					<div className="profile-container">
						<img src={userData.profilePic} />
					</div>
					<div className="ml-16 pt-6 w-100">
						<textarea
							ref={textareaRef}
							className="comment-input w-100"
							value={text}
							placeholder="Write Here"
							onChange={(e) => {
								if (e.target.value.length < 375) {
									setText(e.target.value)
								}
							}}
						/>
					</div>
				</div>

				{img ? (
					<div className="pl-55">
						<img src={img} style={{ maxHeight: 400, maxWidth: '100%' }} />
					</div>
				) : (
					<></>
				)}
				<div className="tools ml-8 mt-8">
					<div className=" w-30 d-flex justify-content-between">
						<i
							className="material-symbols-outlined fs-24 primary"
							onClick={() => fileRef.current?.click()}>
							image
						</i>
						<i
							className="material-symbols-outlined fs-24 primary"
							onClick={() => setShowGifModal((pre) => !pre)}>
							gif_box
						</i>
						<i className="material-symbols-outlined fs-24 primary">
							format_list_bulleted
						</i>
						<i
							className="material-symbols-outlined fs-24 primary"
							onClick={() => setShowEmojiModal(!showEmojiModal)}>
							sentiment_satisfied
						</i>
						<i className="material-symbols-outlined fs-24 primary">
							location_on
						</i>
					</div>
					<div className="d-flex justify-content-center align-items-center">
						{text.length > 300 ? (
							<div className="text-count mr-8 font-500">
								{375 - text.length}
							</div>
						) : (
							''
						)}
						<button className="cylinderical-p size-m" onClick={handleSubmit}>
							<span className="ml-8 mr-8">Post</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default TweetInput
