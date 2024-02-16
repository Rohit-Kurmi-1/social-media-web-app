import { useLayoutEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Post from '../component/post'
import { getBookmarks } from '../utils/api'
import { useMyContext } from '../App'

const Bookmarks = () => {
	const { userData } = useMyContext()
	const navigate = useNavigate()
	const [bookmarks, setBookmarks] = useState<any[]>([])
	const [loading, setLoading] = useState<boolean>(true)

	const fetchPosts = async () => {
		setLoading(true)
		try {
			const resp = await getBookmarks(userData.bookmarks)
			if (resp) {
				setBookmarks(resp)
			}
		} catch (error) {
			console.log(error)
		}
		setLoading(false)
	}
	useLayoutEffect(() => {
		fetchPosts()
	}, [userData.bookmarks])
	return (
		<div id="bookmarks" className="col-md-6 p-0">
			<div className="header p-8 pl-18 pr-16 d-flex align-items-center">
				<i className="material-icons fs-20" onClick={() => navigate('/home')}>
					arrow_back
				</i>
				<div className="ml-24">
					<div className="fs-20 font-700 lh-28">Bookmarks</div>
					<div className="fs-14 font-400 lh-16 dark-gray mt-1">
						{userData.email}
					</div>
				</div>
			</div>
			<div className="hr"></div>
			{!bookmarks.length ? (
				<div
					className="d-flex justify-content-center"
					style={{ margin: '50% auto' }}>
					{loading ? (
						<>
							<img
								src="/icons/loading.png"
								width={50}
								height={50}
								alt="Loading..."
							/>
						</>
					) : (
						<div>
							<div className="fs-38 lh-46 font-700 font-lora">
								Save posts for later
							</div>
							<div className="fs-14 lh-20 dark-gray mt-8">
								Bookmark posts to find them easily in the future.
							</div>
						</div>
					)}
				</div>
			) : (
				<div className="posts  mb-60">
					{bookmarks.map((bookmark, index: number) => (
						<Post data={bookmark} key={index} />
					))}
				</div>
			)}
		</div>
	)
}

export default Bookmarks
