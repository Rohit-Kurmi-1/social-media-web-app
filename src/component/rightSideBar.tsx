import { Link } from 'react-router-dom'
import Searchbar from './searchbar'
// import { useState } from 'react'

const RightSideBar = () => {
	// const [suggetionUser, setSuggetionUser] = useState<any[]>([])
	return (
		<div id="rightSideBar" className="col-md-3 col-12">
			<div className="header">
				<div>
					<div className="searchbar mt-8 w-100">
						<Searchbar />
					</div>

					<div className="user-suggetion mt-13 p-16">
						<div className="fs-20 font-700 lh-24">You might like</div>
						<div className="users">
							{Array.from(new Array(3)).map((item: any, index) => (
								<div
									key={index + Number(Boolean(item))}
									className="user d-flex justify-content-between align-items-center mt-25 flex-wrap">
									<div className="d-flex align-items-center">
										<div className="avatar">
											<img
												src="/icons/avatar.png"
												alt=""
												width={48}
												height={48}
											/>
										</div>
										<div className="ml-12">
											<div className="fs-15 font-700 lh-20">Ada Mu</div>
											<div className="mt-1 fs-15 font-400 lh-20 dark-gray">
												@ada_mu
											</div>
										</div>
									</div>
									<button className="cylinderical-s size-s">
										<span className="ml-4 mr-4 fs-14 ">Follow</span>
									</button>
								</div>
							))}
						</div>
						<div className="mt-25">
							<Link to={'#'} className="show-more primary">
								Show more
							</Link>
						</div>
					</div>
					<div className="user-suggetion p-16 mt-16">
						<div className="fs-20 font-700 lh-24">Trends for you</div>
						{Array.from(new Array(3)).map((item: any, index) => (
							<div
								className="mt-24 d-flex justify-content-between"
								key={index + Number(Boolean(item))}>
								<div>
									<div className="fs-13 font-400 lh-16 light-dark">
										Politics · Trending
									</div>
									<div className="fs-15 font-700 lh-24">Supreme Court</div>
									<div className="fs-400 fs-13 lh-16 light-dark">
										167K Tweets
									</div>
								</div>
								<i className="material-icons fs-20 p-1">more_horiz</i>
							</div>
						))}
					</div>
				</div>
			</div>
			{/* <div className="header">
				<div>
					
				</div>
			</div> */}
		</div>
	)
}

export default RightSideBar
