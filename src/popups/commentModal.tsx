import { useEffect, useRef, useState } from 'react'
import './commentModal.scss'
import { Link } from 'react-router-dom'
const NewPostModal = () => {
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
					<div className="d-flex align-items-start">
						<div className="d-grid ">
							<img src="/icons/avatar.png" alt="" width={40} height={40} />
							<div className="text-center vertical-strip">
								<div className="vr mt-1"></div>
							</div>
						</div>
						<div className="ml-12">
							<div className="fs-15 font-700 lh-20 white">
								Andrew Diete-Koki{' '}
								<span className="fs-15 font-300 lh-20 light-gray ml-4 uppercase">
									@andrewdietekoki
								</span>
							</div>
							<div
								className="fs-14 lh-20 font-400 white mt-12 w-75"
								style={{ letterSpacing: '1.1px' }}>
								World Bank forecasts 2024 global growth to fall to 2.4% https://
								news.cgtn.com/news/2024-01-0
								9/World-Bank-forecasts-2024-global-growth-to-fall-to-2-
								4--1qep5tgjvck/p.html
							</div>
							<div className="regardingTO font-300 light-gray mt-12">
								<span className="fs-14 lh-20">Regarding to</span>
								<span className="fs-14 lh-20 font-500 uppercase primary ml-5">
									@andrewdietekoki
								</span>
							</div>
						</div>
					</div>
					<div className=" d-flex align-items-start mt-3">
						<img src="/icons/avatar.png" alt="" width={40} height={40} />
						<div className="ml-16 pt-6 w-100">
							<textarea
								ref={textareaRef}
								className="comment-input w-100"
								value={text}
								placeholder="Post Your Answer"
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
							<button className="cylinderical-p size-m">reply To</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default NewPostModal
