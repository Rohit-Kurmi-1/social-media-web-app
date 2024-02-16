import { useEffect, useState } from 'react'
import Searchbar from '../../../component/searchbar'
import { useMyContext } from '../../../App'
import { searchUsers, updateProfile } from '../../../utils/api'
import _ from 'lodash'
import { useSearchParams } from 'react-router-dom'
interface Left {
	setShowModal?: any
}
const Left = ({ setShowModal }: Left) => {
	const [searchParams, setSearchParams] = useSearchParams()
	const { userData, setUserData } = useMyContext()
	const [search, setSearch] = useState('')
	const [result, setResult] = useState<any[]>([])
	const [otherUser, setOtherUser] = useState('')
	const activeContact = searchParams.get('u')

	const fetchUsers = async () => {
		try {
			const resp = await searchUsers(search)
			const filteredData = resp.filter((item: any) =>
				userData.following.includes(item.email)
			)
			setResult(filteredData)
		} catch (error) {
			console.log(error)
		}
	}

	const debounceFunc = _.debounce(fetchUsers, 700)

	const startChat = async (user: any) => {
		const userInfo = {
			email: user.email,
			profilePic: user.profilePic,
			name: user.name,
		}
		let checkUser =
			userData.messageFriend &&
			userData.messageFriend?.some((item) => item.email === user.email)
		try {
			if (!checkUser) {
				await updateProfile({
					email: userData.email,
					messageFriend: userData.messageFriend
						? [...userData.messageFriend, userInfo]
						: [userInfo],
				})
				setUserData({
					...userData,
					messageFriend: userData.messageFriend
						? [...userData.messageFriend, userInfo]
						: [userInfo],
				})
			}
		} catch (error) {
			console.log(error)
		}
		setSearchParams(
			(searchParam) => {
				searchParam.set('u', user.email)
				return searchParam
			},
			{ replace: true }
		)
	}

	useEffect(() => {
		if (search) {
			debounceFunc()
		}
		if (!search) {
			setResult([])
		}
	}, [search])
	useEffect(() => {
		setOtherUser(activeContact)
	}, [activeContact])

	return (
		<div
			className={`col-md-5 col-12 leftPart pt-12 ${
				otherUser && 'hide-on-mobile'
			}`}>
			<div className="d-flex align-items-center justify-content-between">
				<div className="fs-22 font-600 lh-28 primary">Message</div>
				<div className="icon-container pr-6" onClick={() => setShowModal(true)}>
					<i
						className="material-icons fs-20"
						style={{ transform: 'rotate(-30deg)' }}>
						send
					</i>
				</div>
			</div>
			<div>
				<div className="mt-20">
					<Searchbar
						dropdownData={result}
						setSelected={startChat}
						value={search}
						onChange={(e: any) => setSearch(e.target.value)}
					/>
					{userData.messageFriend?.length ? (
						<div className="recipients mt-16">
							{userData.messageFriend.map((item, index) => (
								<div
									key={(item.email as string) + index}
									className={`recipient mt-8 ${
										activeContact === item.email && 'active'
									}`}
									onClick={() => startChat(item)}>
									<img src={item.profilePic} alt="" className="profilePic" />
									<div>
										<div className="d-flex align-items-center">
											<div className="fs-16 font-500 lh-20">{item.name}</div>
											<img
												src="/icons/blue-tick.png"
												className="ml-4"
												width={16}
											/>
										</div>
										<div className="fs-12 extra-light-gray font-lora lh-18">
											{item.email}
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="ml-20 mr-20 mt-60">
							<div className="fs-32 lh-40  font-700">
								Welcome to your inbox!
							</div>
							<div className="fs-16 mt-6 lh-20 font-500">
								Connect with others on X through private conversations like
								exchanging messages, sharing posts, and more.
							</div>
							<button
								className="cylinderical-p mt-40"
								onClick={() => setShowModal(true)}>
								<span className="ml-8 mr-8">Write a Message</span>
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default Left
