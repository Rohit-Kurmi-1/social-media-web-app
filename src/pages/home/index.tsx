import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Post from '../../component/post'
import Stepper from '../../component/stepper'
import TweetInput from './component/tweet'
import { getPosts } from '../../utils/api'
import Skeleton from 'react-loading-skeleton'
import _ from 'lodash'
const Home = () => {
	const tabs = ['For You', 'Following']
	const [activeTab, setActiveTab] = useState('')
	const [searchParam, setSearchParams] = useSearchParams()
	const tab = searchParam.get('s')
	const [posts, setPosts] = useState<any[]>([])
	const [lastDoc, setLastDoc] = useState(null)
	const [loading, setLoading] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const [initialFetchComplete, setInitialFetchComplete] = useState(false)

	const fetchPosts = async () => {
		if (!loading) {
			try {
				setLoading(true)
				const data = await getPosts(lastDoc)
				setPosts((prevPosts) => [...prevPosts, ...data])
				setLastDoc(data[data.length - 1])
				setHasMore(data.length >= 10) // Adjust this condition based on your logic
			} catch (error) {
				console.error('Error fetching posts:', error)
			}
			setLoading(false)
		}
	}

	const handleScroll = () => {
		if (
			window.innerHeight + window.scrollY >= document.body.offsetHeight - 20 &&
			hasMore &&
			!loading
		) {
			debouncedFetchPosts()
		}
	}

	const debouncedFetchPosts = _.debounce(fetchPosts, 500)

	useEffect(() => {
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [hasMore, loading])

	useEffect(() => {
		if (!initialFetchComplete) {
			setInitialFetchComplete(true)
			return // Skip the initial fetch
		}
		fetchPosts()
	}, [activeTab])

	useEffect(() => {
		if (tab && tabs.map((tab) => tab.toLowerCase()).includes(tab)) {
			if (tab !== activeTab) {
				setActiveTab(tab)
			}
		} else {
			setActiveTab(tabs[0].toLocaleLowerCase())
		}
	}, [tab])

	useEffect(() => {
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

	return (
		<div id="homepage" className="col-lg-6 col-12 p-0">
			<header>
				<Stepper
					setStep={setActiveTab}
					activeStep={activeTab}
					steps={['For You', 'Following']}
				/>
			</header>
			<TweetInput setPosts={setPosts} posts={posts} />
			{activeTab === 'for you' ? (
				<>
					{posts.length ? (
						<div className="mb-60">
							{posts.map((post) => (
								<Post data={post} key={post.id} />
							))}
						</div>
					) : (
						<></>
					)}
					{loading ? (
						//@ts-ignore
						Array.from(new Array(10)).map((item: any, index: number) => (
							<div id="post" key={index}>
								<div className="post-header d-flex align-items-center justify-content-between">
									<div className="d-flex align-items-center">
										<Skeleton
											borderRadius={50}
											width={50}
											height={50}
											baseColor="#2e2c2c"
											highlightColor="#433e3e"
										/>
										<div className="ml-12">
											<div className="d-flex align-items-center">
												<Skeleton
													width={150}
													baseColor="#2e2c2c"
													highlightColor="#433e3e"
												/>
											</div>
											<div>
												<Skeleton
													width={50}
													baseColor="#2e2c2c"
													highlightColor="#433e3e"
												/>
											</div>
										</div>
									</div>
								</div>
								<div className="pl-55 pr-55">
									<div className="post-main  mt-12">
										<Skeleton baseColor="#2e2c2c" highlightColor="#433e3e" />
									</div>
									<Skeleton
										height={400}
										baseColor="#2e2c2c"
										className="skeletonForImg"
										highlightColor="#433e3e"
									/>
								</div>
							</div>
						))
					) : (
						<></>
					)}
				</>
			) : (
				<>Following </>
			)}
		</div>
	)
}

export default Home
