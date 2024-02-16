import { useNavigate } from 'react-router-dom'
import Searchbar from '../component/searchbar'
import { useEffect, useRef, useState } from 'react'
import _ from 'lodash'
import { useMyContext } from '../App'
import { searchUsers } from '../utils/api'
import Skeleton from 'react-loading-skeleton'
import { truncateString } from '../utils'
const explore = () => {
	const { MyToast, userData } = useMyContext()
	const inputRef = useRef<HTMLInputElement | null>(null)
	const navigate = useNavigate()
	const [search, setSearch] = useState('')
	const [result, setResult] = useState<any[]>([])
	const [loading, setLoading] = useState<boolean>(false)

	const fetchUsers = async () => {
		setLoading(true)
		try {
			const resp = await searchUsers(search)
			setResult(resp)
		} catch (error) {
			MyToast.error({
				title: 'Something Went Wrong',
				description: 'Check Your Internet Connection',
			})
		}
		setLoading(false)
	}

	useEffect(() => {
		const timoutId = setTimeout(() => {
			if (search) {
				fetchUsers()
			} else {
				setResult([])
			}
		}, 300)
		return () => clearTimeout(timoutId)
	}, [search])

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus()
		}
	}, [inputRef])
	return (
		<div id="explore" className="col-12 col-md-6 p-0">
			<div className="header p-12 pl-18 pr-16 d-flex align-items-center">
				<i className="material-icons fs-20" onClick={() => navigate('/home')}>
					arrow_back
				</i>
				<div className="ml-24">
					<div className="fs-20 font-700 lh-28">Explore</div>
				</div>
			</div>
			<div>
				<div className="searchbar-container">
					<Searchbar
						onChange={(e: any) => setSearch(e.target.value)}
						value={search}
						inputRef={inputRef}
					/>
				</div>
				<div className="mb-60 pl-12 pr-12">
					{_.isEmpty(result) && !loading ? (
						<main>
							<div className="empty-users fs-48 font-lora font-600 light-gray">
								Catchup with a friend
							</div>
						</main>
					) : (
						<div className="users">
							{loading
							//@ts-ignore
								? Array.from(new Array(6)).map((item, index) => {
										return (
											<div className="user" key={index}>
												<Skeleton width={40} height={40} borderRadius={'50%'} />
												<div className="content">
													<Skeleton height={15} width={120} />
													<Skeleton height={20} />
												</div>
											</div>
										)
								  })
								: result.map((item) => (
										<div
											key={item.email}
											className="user"
											onClick={() => {
												if (userData.email !== item.email) {
													navigate(`/user?id=${item.email}&s=posts`)
												} else {
													navigate(`/profile?s=posts`)
												}
											}}>
											<div className="profile-container">
												<img src={item.profilePic} />
											</div>
											<div className="content">
												<div className="fs-16 font-500 lh-20">{item.name}</div>
												<div className="fs-12 lh-18">
													{truncateString(item.email, 30)}
												</div>
											</div>
										</div>
								  ))}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default explore
