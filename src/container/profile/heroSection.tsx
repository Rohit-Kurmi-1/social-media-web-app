import { Link, useNavigate } from 'react-router-dom'
import { useMyContext } from '../../App'

const HeroSection = () => {
	const { userData } = useMyContext()
	const navigate = useNavigate()
	return (
		<div id="herosection">
			<div className="header p-6 pr-16 pl-16 d-flex align-items-center">
				<i className="material-icons fs-20" onClick={() => navigate(-1)}>
					arrow_back
				</i>
				<div className="ml-36">
					<div className="fs-16 font-700 lh-22">{userData.name}</div>
					<div className="fs-14 font-400 lh-16 dark-gray mt-1">743 Tweets</div>
				</div>
			</div>
			<div className="hero-section">
				<div className="banner-container">
					<img
						src={
							userData.profileBanner
								? userData.profileBanner
								: '/other/cover.avif'
						}
						className="w-100 mt-1"
					/>
				</div>
				<div className="profile-container">
					<img src={userData.profilePic} alt="" className="userImage" />
				</div>
			</div>
			<div className="p-12 pl-24 pr-24">
				<div className="d-flex justify-content-end align-items-center">
					<button
						className="cylinderical-s size-m font-700 mr-8"
						onClick={() => navigate('/settings/account-information')}>
						<i className="material-icons font-500 fs-16 align-middle">bolt</i>
						<span className="ml-4 mr-4">Update Profile</span>
					</button>
					<button className="button-icon-s p-8">
						<i className="material-icons fs-20">more_horiz </i>
					</button>
				</div>
				<div className="mt-6">
					<div className="d-flex align-items-center">
						<div className="fs-20 font-700 lh-24">{userData.name}</div>
						<img
							src="/icons/blue-tick.png"
							width={20}
							alt=""
							className="ml-4"
						/>
					</div>
					<div className="dark-gray fs-15 font-400 lh-20 mt-2">
						{userData.email}
					</div>
					<div className="mt-14 fs-15 font-400 lh-20 ">{userData.bio}</div>
					<div className="mt-14 d-flex align-items-center">
						<div className="location d-flex align-items-center">
							<i className="material-icons fs-20 dark-gray">location_on</i>
							<div className="fs-15 font-400 lh-12 ml-4 font-400 dark-gray">
								{userData.country?.toUpperCase()}
							</div>
						</div>
						<div className="linkField d-flex align-items-center ml-18">
							<i className="material-icons fs-20 dark-gray">insert_link</i>
							<Link
								to={'#'}
								target="_blank"
								className="fs-15 font-400 lh-12 ml-4 font-400  primary underline">
								{userData.name}
							</Link>
						</div>
						<div className="joinedDate d-flex align-items-center ml-18">
							<i className="material-icons fs-18 dark-gray font-500">
								calendar_month
							</i>
							<div className="fs-15 font-400 lh-12 ml-4 font-400 dark-gray">
								{userData.country?.toUpperCase()}
							</div>
						</div>
					</div>
					<div className="mt-14 d-flex align-items-center">
						<span className="font-700 lh-16 fs-14">
							{' '}
							{userData.totalFollowing}
						</span>
						<span className="font-500 lh-16 fs-14 dark-gray ml-6">
							Following
						</span>
						<span className="font-700 lh-16 fs-14 ml-20">
							{userData.totalFollower}
						</span>
						<span className="font-500 lh-16 fs-14 dark-gray ml-6">
							Followers
						</span>
					</div>
					<div className="mt-14 d-flex align-items-center">
						<img src="/other/some-follower.png" alt="" height={20} />
						<div className="fs-14 font-400 lh-18 ml-12">
							Followed by Amanda, Efemena, and 7 others
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default HeroSection
