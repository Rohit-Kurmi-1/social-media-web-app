import { useEffect, useLayoutEffect, useState } from 'react'
import Stepper from '../../component/stepper'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
	checkUser,
	doFollow,
	getAllLikedPosts,
	getUserPosts,
} from '../../utils/api'
import Post from '../../component/post'
import Skeleton from 'react-loading-skeleton'
import { UserSchema } from '../../utils/schema'
import { useMyContext } from '../../App'
const UserProfile = () => {
	const { userData, setUserData } = useMyContext()
	const navigate = useNavigate()
	const [otherUser, setOtherUser] = useState<UserSchema>({
		name: '',
		email: '',
		password: '',
		phoneNumber: '',
		profilePic: '',
		profileBanner: '',
		userName: '',
		country: '',
		address1: '',
		address2: '',
		joinData: '',
		totalFollowing: 0,
		totalFollower: 0,
		dob: '',
		bio: '',
		bookmarks: [],
		liked: [],
	})
	const [activeTab, setActiveTab] = useState('')
	const tabs = ['Posts', 'Liked']
	const [searchParam, setSearchParams] = useSearchParams()
	const [userPosts, setUserPosts] = useState<any[]>([])
	const [likedPosts, setLikedPosts] = useState<any[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [buttonLoading, setButtonLoading] = useState<boolean>(true)
	const [alreadyFollowed, setAlreadyFollowed] = useState<boolean>(false)
	const tab = searchParam.get('s')
	const userId = searchParam.get('id')

	const fetchUserPosts = async () => {
		setLoading(true)
		try {
			const resp = await getUserPosts(otherUser.email)
			if (resp) {
				setUserPosts(resp)
			}
			console.log
		} catch (error) {
			console.log(error)
		}
		setLoading(false)
	}
	const fetchLikedPosts = async () => {
		setLoading(true)
		try {
			if (otherUser.liked?.length) {
				const resp = await getAllLikedPosts(otherUser.email, otherUser.liked)
				if (resp) {
					setLikedPosts(resp)
				}
			}
		} catch (error) {
			console.log(error)
		}
		setLoading(false)
	}

	const fetchUserData = async () => {
		try {
			const resp = await checkUser(userId as string)
			if (resp) {
				setOtherUser(resp.data as UserSchema)
			} else {
				console.log('error')
			}
		} catch (error) {
			console.log(error)
		}
	}

	// For Tab And Params Matching
	useLayoutEffect(() => {
		if (
			tab &&
			tabs.map((tab) => tab.toLowerCase()).includes(tab.toLowerCase())
		) {
			if (tab !== activeTab) {
				setActiveTab(tab.toLowerCase())
			}
		} else {
			setActiveTab(tabs[0].toLocaleLowerCase())
		}
	}, [tab])

	useLayoutEffect(() => {
		if (activeTab) {
			setSearchParams(
				(searchParams) => {
					searchParams.set('s', activeTab)
					return searchParams
				},
				{ replace: true }
			)
		}
	}, [activeTab])

	useEffect(() => {
		if (activeTab) {
			if (userId && !otherUser.email) {
				fetchUserData()
			} else if (activeTab === 'posts' && !userPosts.length) {
				fetchUserPosts()
			} else if (activeTab === 'liked' && !likedPosts.length) {
				fetchLikedPosts()
			}
		}
	}, [activeTab, otherUser])

	const handleFollow = async (recipientEmail: string) => {
		setButtonLoading(true)
		try {
			const resp = await doFollow(
				userData.email,
				recipientEmail,
				!alreadyFollowed
			)
			if (resp) {
				if (alreadyFollowed) {
					const filteredData = userData.following.map(
						(item) => item !== recipientEmail
					)
					setUserData({
						...userData,
						following: filteredData,
						totalFollowing: userData.totalFollowing - 1,
					})
				} else {
					setUserData({
						...userData,
						following: [...userData.following, recipientEmail],
						totalFollowing: userData.totalFollowing + 1,
					})
				}
				setAlreadyFollowed(!alreadyFollowed)
			}
		} catch (error) {
			console.log(error)
		}
		setButtonLoading(false)
	}

	useEffect(() => {
		if (userData && otherUser && userData.following && otherUser.email) {
			setAlreadyFollowed(userData.following.includes(otherUser.email))
		} else {
			setAlreadyFollowed(false)
		}
	}, [userData, otherUser])
	return (
		<div id="profile" className="col-md-6 p-0">
			<div id="herosection">
				<div className="header p-6 pr-16 pl-16 d-flex align-items-center">
					<i className="material-icons fs-20" onClick={() => navigate(-1)}>
						arrow_back
					</i>
					<div className="ml-36">
						<div className="fs-16 font-700 lh-22">{otherUser.name}</div>
						<div className="fs-14 font-400 lh-16 dark-gray mt-1">
							743 Tweets
						</div>
					</div>
				</div>
				<div className="hero-section">
					<div className="banner-container">
						<img
							src={
								otherUser.profileBanner
									? otherUser.profileBanner
									: '/other/cover.avif'
							}
							className="w-100 mt-1"
							alt=""
						/>
					</div>
					<div className="profile-container">
						<img src={otherUser.profilePic} alt="" className="userImage" />
					</div>
				</div>
				<div className="p-12 pl-24 pr-24">
					<div className="d-flex justify-content-end align-items-center">
						<button className="button-icon-s p-8">
							<i className="material-icons fs-20">more_horiz </i>
						</button>
						<Link
							target="_blank"
							to={`mailto:${otherUser.email}`}
							className="button-icon-p p-8 ml-8">
							<i className="material-symbols-outlined font-500 fs-20">email</i>
						</Link>
						{otherUser.email && (
							<>
								{alreadyFollowed ? (
									<button
										className="cylinderical-p size-m font-500 ml-8"
										onClick={() => handleFollow(otherUser.email)}>
										<span className="ml-4 mr-4">UnFollow</span>
									</button>
								) : (
									<button
										className="cylinderical-s size-m font-500 ml-8"
										onClick={() => handleFollow(otherUser.email)}>
										<span className="ml-4 mr-4">Follow</span>
									</button>
								)}
							</>
						)}
					</div>
					<div className="mt-6">
						<div className="d-flex align-items-center">
							<div className="fs-20 font-700 lh-24">{otherUser.name}</div>
							<img
								src="/icons/blue-tick.png"
								width={20}
								alt=""
								className="ml-4"
							/>
						</div>
						<div className="dark-gray fs-15 font-400 lh-20 mt-2">
							{otherUser.email}
						</div>
						<div className="mt-14 fs-15 font-200 lh-20 extra-light-gray">
							{otherUser.bio}
						</div>
						<div className="mt-14 d-flex align-items-center">
							<div className="location d-flex align-items-center">
								<i className="material-icons fs-20 dark-gray">location_on</i>
								<div className="fs-15 font-400 lh-12 ml-4 font-400 dark-gray">
									{otherUser.country?.toUpperCase()}
								</div>
							</div>
							<div className="linkField d-flex align-items-center ml-18">
								<i className="material-icons fs-20 dark-gray">insert_link</i>
								<Link
									to={'#'}
									target="_blank"
									className="fs-15 font-400 lh-12 ml-4 font-400  primary underline">
									{otherUser.name}
								</Link>
							</div>
							<div className="joinedDate d-flex align-items-center ml-18">
								<i className="material-icons fs-18 dark-gray font-500">
									calendar_month
								</i>
								<div className="fs-15 font-400 lh-12 ml-4 font-400 dark-gray">
									{otherUser.country?.toUpperCase()}
								</div>
							</div>
						</div>
						<div className="mt-14 d-flex align-items-center">
							<span className="font-700 lh-16 fs-14">
								{' '}
								{otherUser.totalFollowing}
							</span>
							<span className="font-500 lh-16 fs-14 dark-gray ml-6">
								Following
							</span>
							<span className="font-700 lh-16 fs-14 ml-20">
								{otherUser.totalFollower}
							</span>
							<span className="font-500 lh-16 fs-14 dark-gray ml-6">
								Followers
							</span>
						</div>
						<div className="mt-14 d-flex align-items-center">
							<img src="/other/some-follower.png" alt="" height={20} />
							<div className="fs-14 font-400 lh-18  ml-12">
								Followed by Amanda, Efemena, and 7 others
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="mt-12 stepper">
				<Stepper setStep={setActiveTab} activeStep={activeTab} steps={tabs} />
			</div>
			{activeTab === 'posts' ? (
				<div className="mt-12 ">
					{userPosts.length
						? userPosts.map((post) => <Post data={post} key={post.id} />)
						: loading &&
						  //@ts-ignore
						  Array.from(new Array(2)).map((item: any, index: number) => (
								<div id="post" key={index}>
									<div className="post-header d-flex align-items-center justify-content-between">
										<div className="d-flex align-items-center">
											<Skeleton borderRadius={50} width={50} height={50} />
											<div className="ml-12">
												<div className="d-flex align-items-center">
													<Skeleton width={150} />
												</div>
												<div>
													<Skeleton width={50} />
												</div>
											</div>
										</div>
									</div>
									<div className="pl-55 pr-55">
										<div className="post-main  mt-12">
											<Skeleton />
										</div>
										<Skeleton height={400} className="skeletonForImg" />
									</div>
								</div>
						  ))}
				</div>
			) : (
				<div className="mt-12">
					{likedPosts.length
						? //@ts-ignore
						  likedPosts.map((post) => <Post data={post} key={post.id} />)
						: loading &&
						  //@ts-ignore
						  Array.from(new Array(2)).map((item: any, index: number) => (
								<div id="post" key={index}>
									<div className="post-header d-flex align-items-center justify-content-between">
										<div className="d-flex align-items-center">
											<Skeleton borderRadius={50} width={50} height={50} />
											<div className="ml-12">
												<div className="d-flex align-items-center">
													<Skeleton width={150} />
												</div>
												<div>
													<Skeleton width={50} />
												</div>
											</div>
										</div>
									</div>
									<div className="pl-55 pr-55">
										<div className="post-main  mt-12">
											<Skeleton />
										</div>
										<Skeleton height={400} className="skeletonForImg" />
									</div>
								</div>
						  ))}
				</div>
			)}
		</div>
	)
}

export default UserProfile
