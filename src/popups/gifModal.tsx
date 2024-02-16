import { useEffect, useState } from 'react'
import './gifModal.scss'
import Searchbar from '../component/searchbar'

interface GifModalProp {
	onSelect?: any
	onClose?: any
}
const GifModal = ({ onSelect, onClose }: GifModalProp) => {
	const [gif, setGif] = useState<any[]>([])
	const [search, setSearch] = useState<string>('')
	const [loading, setLoading] = useState<boolean>(true)
	const grab_data = async (text: string) => {
		setLoading(true)
		const clientkey = 'my_test_app'
		const lmt = 8
		const searchTerm = text ? text : 'smile'
		const search_url =
			'https://tenor.googleapis.com/v2/search?q=' +
			searchTerm +
			'&key=' +
			import.meta.env.VITE_GIF_API +
			'&client_key=' +
			clientkey +
			'&limit=' +
			lmt

		const resp = await fetch(search_url)
		const data = await resp.json()
		setGif(data.results)
		setLoading(false)
	}

	useEffect(() => {
		const delayId = setTimeout(() => {
			grab_data(search)
		}, 800)

		return () => clearTimeout(delayId)
	}, [search])

	return (
		<div id="gifModal">
			<div className="searchbar pl-40">
				<Searchbar
					onChange={(e: any) => setSearch(e.target.value)}
					value={search}
				/>
			</div>
			{loading ? (
				<div className="text-center white pt-100 pb-100">loading...</div>
			) : (
				<div className="masonry-grid mt-24">
					{gif.length &&
						gif.map((item, index) => (
							<div
								key={index}
								className="masonry-item"
								onClick={() => {
									onSelect(item.media_formats.gif.url)
									onClose(false)
								}}>
								<img key={index} src={item.media_formats.gif.url} alt="" />
							</div>
						))}
				</div>
			)}
		</div>
	)
}

export default GifModal
