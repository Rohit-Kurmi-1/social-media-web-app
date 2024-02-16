import { useEffect, useLayoutEffect, useState } from 'react'
import Stepper from '../../component/stepper'
import HeroSection from '../../container/profile/heroSection'
import { useSearchParams } from 'react-router-dom'
import {  getAllLikedPosts, getUserPosts } from '../../utils/api'
import Post from '../../component/post'
import Skeleton from 'react-loading-skeleton'
import { useMyContext } from '../../App'

const UserProfile = () => {
	const { userData } = useMyContext()
	const [activeTab, setActiveTab] = useState('')
	const tabs = ['Posts', 'Liked']
	const [searchParam, setSearchParams] = useSearchParams()
	const [userPosts, setUserPosts] = useState<any[]>([])
	const [likedPosts, setLikedPosts] = useState<any[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const tab = searchParam.get('s')

	const fetchUserPosts = async () => {
		setLoading(true)
		try {
			const resp = await getUserPosts(userData.email)
			if (resp) {
				setUserPosts(resp)
			}
		} catch (error) {
			console.log(error)
		}
		setLoading(false)
	}
	const fetchLikedPosts = async () => {
		setLoading(true)
		try {
			const resp = await getAllLikedPosts(userData.email, userData.liked)
			if (resp) {
				setLikedPosts(resp)
			}
		} catch (error) {
			console.log(error)
		}
		setLoading(false)
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
			if (activeTab === 'posts' && !userPosts.length) {
				fetchUserPosts()
			} else if (activeTab === 'liked' && !likedPosts.length) {
				fetchLikedPosts()
			}
		}
	}, [activeTab])

	
	return (
		<div id="profile" className="col-md-6 p-0">
			<HeroSection />
			<div className="mt-12 stepper">
				<Stepper setStep={setActiveTab} activeStep={activeTab} steps={tabs} />
			</div>
			{activeTab === 'posts' ? (
				<div className="mt-12 mb-60">
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
				<div className="mt-12  mb-60">
					{likedPosts.length
						? likedPosts.map((post) => <Post data={post} key={post.id} />)
						: loading && //@ts-ignore
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
