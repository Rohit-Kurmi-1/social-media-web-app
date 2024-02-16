import { useState } from 'react'
import {
	Link,
	useLocation,
	useNavigate,
	useSearchParams,
} from 'react-router-dom'
import Modal from './modal'
import NewPostModal from '../popups/tweetModal'
import Dropdown from './dropdown'
import { clearAllCookies, truncateString } from '../utils'
import { useMyContext } from '../App'

const LeftSideBar = ({ activeTab }: { activeTab: string }) => {
	const navigate = useNavigate()
	const { userData, setUserData } = useMyContext()
	const [searchParams, setSearchParams] = useSearchParams()
	const location = useLocation()
	const [showTweet, setShowTweet] = useState<boolean>(false)
	const recipentChatUser = searchParams.get('u')
	return (
		<div
			id="leftSideBar"
			className={`col-md-3 col-12 ${
				recipentChatUser &&
				location.pathname.includes('message') &&
				'hide-on-mobile'
			}`}>
			{showTweet ? (
				<Modal
					modalClass="mt-20"
					iconPlacement="left"
					closeIconColor="white"
					children={<NewPostModal />}
					onClose={() => setShowTweet(false)}
				/>
			) : (
				<></>
			)}
			<main>
				<div className="header">
					<div>
						<div className="logo mt-12 mb-12 ">
							<img src="/icons/logo.webp" alt="" width={40} />
						</div>
						<div className="nav-menu">
							<Link
								to={'/home'}
								className={`${activeTab === 'home' && 'active'} nav-item`}>
								<i className="material-symbols-outlined fs-25 font-400">
									home_app_logo
								</i>
								<div className="fs-18  lh-24 ">Home</div>
							</Link>
							<Link
								to={'/explore'}
								className={`${activeTab === 'explore' && 'active'} nav-item`}>
								<i className="material-icons fs-25 font-500">search</i>
								<div className="fs-18  lh-24">Explore</div>
							</Link>
							<Link
								to={'#'}
								onClick={() => alert('Currently We Are Working on it')}
								className={`${
									activeTab === 'notifications' && 'active'
								} nav-item`}>
								<i className="material-symbols-outlined fs-25 font-500">
									notifications_active
								</i>
								<div className="fs-18  lh-24">Notifications</div>
							</Link>
							<Link
								to={'/message'}
								className={`${activeTab === 'message' && 'active'} nav-item`}>
								<i className="material-symbols-outlined fs-25 font-500">mail</i>
								<div className="fs-18  lh-24">Messages</div>
							</Link>
							{/* <Link
							to={'/subscription'}
							className={`${
								activeTab === 'subscription' && 'active'
							} nav-item`}>
							<i className="material-symbols-outlined fs-25 font-500">
								loyalty
							</i>
							<div className="fs-18  lh-24">Twitter Blue</div>
						</Link> */}
							<Link
								to={'/bookmarks'}
								className={`${activeTab === 'bookmarks' && 'active'} nav-item`}>
								<i className="material-symbols-outlined fs-25 font-500">
									Bookmarks
								</i>
								<div className="fs-18  lh-24">Bookmarks</div>
							</Link>
							<Link
								to={'/profile?s=tweets'}
								className={`${activeTab === 'profile' && 'active'} nav-item`}>
								<i className="material-symbols-outlined fs-25 font-500">
									person
								</i>
								<div className="fs-18  lh-24">Profile</div>
							</Link>
							<Link
								to={'/settings'}
								className={`${activeTab === 'settings' && 'active'} nav-item`}>
								<i className="material-symbols-outlined fs-25 font-500">
									Settings_Suggest
								</i>
								<div className="fs-18  lh-24">Settings</div>
							</Link>
						</div>
						{!location.pathname.includes('/home') ? (
							<button
								className="cylinderical-p w-100 mt-38"
								onClick={() => setShowTweet(true)}>
								Tweet
							</button>
						) : (
							<></>
						)}
					</div>
					<div className="profileContainer d-flex align-items-center mb-16">
						<div className="image-container">
							<img src={userData.profilePic} alt="" width={40} height={40} />
						</div>
						<div className="ml-16">
							<div
								className="d-flex align-items-center cursor-pointer	"
								onClick={() => navigate('/profile?s=posts')}>
								<div className="fs-15 font-700 lh-20 mr-4">{userData.name}</div>
								<img src="/icons/blue-tick.png" width={16} />
							</div>
							<div className="fs-15 font-400 lh-20 dark-gray">
								{truncateString(userData.email, 20)}
							</div>
						</div>
						<div className="position-relative">
							<Dropdown
								children={[
									{ text: 'Setting', action: () => navigate('/settings') },
									{
										text: 'Logout',
										action: () => {
											clearAllCookies()
											setUserData({})
											navigate('/login')
										},
									},
								]}
							/>
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}

export default LeftSideBar
