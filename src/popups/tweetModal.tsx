import { useEffect, useRef, useState } from 'react'
import './commentModal.scss'
import { Link } from 'react-router-dom'
const TweetModal = () => {
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const [text, setText] = useState('')
	useEffect(() => {
		if (textareaRef.current && text.length) {
			textareaRef.current.style.height = 'auto'
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
		}
	}, [text])
	return (
		<div id="commentModal">
			<div className="p-16">
				<div className="d-flex justify-content-end align-items-center">
					<Link to={'#'} className="primary font-600">
						Format
					</Link>
				</div>
				<div className="mt-12">
					<div className=" d-flex align-items-start mt-3">
						<img src="/icons/avatar.png" alt="" width={40} height={40} />
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
					<div className="tools ml-8">
						<div className=" w-30 d-flex justify-content-between">
							<i className="material-symbols-outlined fs-24 primary">image</i>
							<i className="material-symbols-outlined fs-24 primary">gif_box</i>
							<i className="material-symbols-outlined fs-24 primary">
								format_list_bulleted
							</i>
							<i className="material-symbols-outlined fs-24 primary">
								sentiment_satisfied
							</i>
							<i className="material-symbols-outlined fs-24 primary">
								location_on
							</i>
						</div>
						<div className="d-flex justify-content-center align-items-center">
							{text.length > 300 ? (
								<div className="text-count mr-8 font-500">
									{374 - text.length}
								</div>
							) : (
								''
							)}
							<button className="cylinderical-p size-m">
								<span className="ml-8 mr-8">Post</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default TweetModal
