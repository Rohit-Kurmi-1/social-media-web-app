import React, { useEffect, useState } from 'react'
import './emojisModal.scss'
import Searchbar from '../component/searchbar'
import { EMOJIS } from '../utils/constant'
interface EmojiProp {
	textRef: React.RefObject<HTMLTextAreaElement>
	setTextArea: any
	onClose?: any
}
const EmojiModal = ({ textRef, setTextArea, onClose }: EmojiProp) => {
	const [search, setSearch] = useState<string>('')
	const [result, setResult] = useState<any[]>([])
	//@ts-ignore
	const [perPage, setPerPage] = useState<number>(50)
	const [currPage, setCurrPage] = useState<number>(1)
	const [totalPages, setTotalPages] = useState<number>(
		Math.ceil(EMOJIS.length / perPage)
	)

	const handlePageChange = () => {
		const startIndex = (currPage - 1) * perPage
		const endIndex = startIndex + perPage
		setResult(EMOJIS.slice(startIndex, endIndex))
	}
	const handleSelectEmoji = (emoji: string) => {
		const textarea = textRef.current

		if (textarea) {
			console.log(emoji)
			const currentCursorPosition = textarea.selectionStart
			const emojiToInsert = emoji

			// Insert the emoji at the current cursor position
			const updatedText =
				textarea.value.substring(0, currentCursorPosition) +
				emojiToInsert +
				textarea.value.substring(textarea.selectionEnd)

			// Update the text area value and maintain the cursor position
			textarea.value = updatedText
			textarea.setSelectionRange(
				currentCursorPosition + emojiToInsert.length,
				currentCursorPosition + emojiToInsert.length
			)

			setTextArea(textarea.value)
		}

		onClose(false)
	}

	useEffect(() => {
		handlePageChange()
		setTotalPages(Math.ceil(EMOJIS.length / perPage))
	}, [currPage, perPage])

	useEffect(() => {
		const filteredEmojis = EMOJIS.filter((emoji) =>
			emoji.name.toLowerCase().includes(search.toLowerCase())
		)
		setResult(filteredEmojis.slice(0, perPage))
		setCurrPage(1) // Resetting current page when search changes
		setTotalPages(Math.ceil(filteredEmojis.length / perPage))
	}, [search, perPage])

	return (
		<div id="emojiModal">
			<div className="searchbar pl-40">
				<Searchbar
					onChange={(e: any) => setSearch(e.target.value)}
					value={search}
				/>
			</div>
			<div className="mt-12 d-flex justify-content-between w-100 pl-12 pr-12">
				<div
					className="light-gray cursor-pointer"
					onClick={() => {
						if (currPage > 1) {
							setCurrPage((pre) => pre - 1)
						}
					}}>
					Prev
				</div>
				<div
					className="light-gray cursor-pointer"
					onClick={() => {
						if (totalPages !== currPage) {
							setCurrPage((pre) => pre + 1)
						}
					}}>
					Next
				</div>
			</div>
			<div className="masonry-grid pt-24 pl-12 pr-12 pb-0">
				{result.length &&
					result.map((item: any, index: number) => (
						<div
							key={index}
							className="emoji"
							onClick={() => handleSelectEmoji(item.emoji)}>
							{item.emoji}
						</div>
					))}
			</div>
		</div>
	)
}

export default EmojiModal
