import React, { useLayoutEffect, useState } from 'react'
import Modal from './modal'
import NewPostModal from '../popups/commentModal'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { likePost, saveToBookmark } from '../utils/api'
import { useMyContext } from '../App'
import { useNavigate } from 'react-router-dom'
import { truncateString } from '../utils'

interface Post {
	data?: any
}

const Post: React.FC<Post> = ({ data }: Post) => {
	const navigate = useNavigate()
	const { MyToast, userData, setUserData } = useMyContext()
	const [showCommentModal, setShowCommentModal] = useState<boolean>(false)
	const [imageWidth, setImageWidth] = useState<any>(0)
	const [imageHeight, setImageHeight] = useState<any>(0)
	const [postDetails, setPostDetails] = useState<any>({
		isLiked: false,
		isSaved: false,
		totalLikes: 0,
	})
	const [imageLoading, setImageLoading] = useState<boolean>(true)

	const handleLike = async () => {
		const resp = await likePost(data.id, postDetails.isLiked)
		if (resp) {
			const user = {
				...userData,
				liked: userData.liked.includes(data.id)
					? userData.liked.filter((item) => item !== data.id)
					: [...userData.liked, data.id],
			}
			setUserData(user)
			setPostDetails({
				...postDetails,
				isLiked: !postDetails.isLiked,
				totalLikes: postDetails.isLiked
					? postDetails.totalLikes - 1
					: postDetails.totalLikes + 1,
			})
		}
	}

	const handleBookmark = async () => {
		const resp = await saveToBookmark(data.id, postDetails.isSaved)
		if (resp) {
			MyToast.success({
				title: `Post ${
					postDetails.isSaved ? 'removed from Bookmarks' : 'added to Bookmarks'
				}`,
			})
			const user = {
				...userData,
				bookmarks: userData.bookmarks.includes(data.id)
					? userData.bookmarks.filter((item) => item !== data.id)
					: [...userData.bookmarks, data.id],
			}
			setUserData(user)
			setPostDetails({
				...postDetails,
				isSaved: !postDetails.isSaved,
			})
		}
	}
	const getImageSize = () => {
		const img = new Image()
		img.src = data.img
		setImageHeight(img.height)
		setImageWidth(img.width)
	}

	const handleImageLoad = () => {
		setImageLoading(false)
	}

	const handleImageError = () => {
		setImageLoading(false)
	}

	const checkUserProfile = () => {
		if (data.user === userData.email) {
			navigate('/profile?s=posts')
		} else {
			navigate(`/user?id=${data.user}&s=posts`)
		}
	}

	useLayoutEffect(() => {
		getImageSize()
		if (data && data.id) {
			const isLiked = userData.liked.includes(data.id)
			const isSaved = userData.bookmarks.includes(data.id)
			const totalLikes = data.totalLikes
			setPostDetails({ isLiked, isSaved, totalLikes })
		}
	}, [])

	return (
		<div id="post">
			{showCommentModal ? (
				<Modal
					modalClass="mt-20"
					iconPlacement="left"
					closeIconColor="white"
					children={<NewPostModal />}
					onClose={() => setShowCommentModal(false)}
				/>
			) : (
				<></>
			)}
			<div className="mr-12">
				<div className="post-header d-flex align-items-center justify-content-between">
					<div
						className="d-flex align-items-center cursor-pointer"
						onClick={checkUserProfile}>
						<div className="profile-container cursor-pointer">
							<img src={data.profilePic} alt="" width={48} height={48} />
						</div>
						<div className="ml-12">
							<div className="fs-15 font-700 lh-20 d-flex align-items-center">
								<span className="mr-4">{data.userName}</span>
								<img src="/icons/blue-tick.png" width={16} />
							</div>
							<div className="fs-15 font-400 lh-20 dark-gray">
								{truncateString(data.user, 35)}
							</div>
						</div>
					</div>
					<i className="material-icons fs-20 dark-gray ml-16">more_horiz</i>
				</div>
				<main className="pl-55 pr-55">
					<div className="post-main fs-17 font-400 lh-24  mt-12 ml-7">
						{data.text}
					</div>
					<div className="image">
						{imageLoading ? (
							// Skeleton or loading indicator while the image is loading
							<Skeleton
								baseColor="#2e2c2c"
								className="postImage"
								highlightColor="#433e3e"
								width={imageWidth}
								height={imageHeight}
							/>
						) : (
							<></>
						)}
						<img
							className="postImage"
							src={data.img}
							alt=""
							onLoad={handleImageLoad}
							onError={handleImageError}
							style={{ display: imageLoading ? 'none' : 'block' }}
						/>
					</div>
					<div className="action-container pl-8 pr-8 mt-16">
						<i
							className="material-symbols-outlined fs-20"
							onClick={() => setShowCommentModal(!showCommentModal)}>
							chat_bubble
						</i>
						<i className="material-symbols-outlined fs-22">cached</i>
						<div className="d-flex align-items-center">
							<i
								className={`material-${
									postDetails.isLiked ? 'icons like' : 'symbols-outlined'
								} fs-22 `}
								onClick={handleLike}>
								favorite
							</i>
							{postDetails.totalLikes ? (
								<div className="fs-16 font-500 lh-22 ml-4">
									{postDetails.totalLikes}
								</div>
							) : (
								''
							)}
						</div>

						<div className="d-flex align-items-center cursor-pointer">
							<i className="material-symbols-outlined fs-22 mr-6">monitoring</i>
							<span className="fs-14 font-500 dark-gray">500</span>
						</div>
						<i
							className={`material-${
								postDetails.isSaved ? 'icons bookmark' : 'symbols-outlined'
							} fs-22 ml-8`}
							onClick={handleBookmark}>
							bookmark
						</i>
					</div>
				</main>
			</div>
		</div>
	)
}

export default Post
