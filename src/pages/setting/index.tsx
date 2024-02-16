import { useEffect, useState } from 'react'
import {
	Outlet,
	useLocation,
	useNavigate,
	useSearchParams,
} from 'react-router-dom'
import { clearAllCookies } from '../../utils'
import { useMyContext } from '../../App'

const Setting = () => {
	const navigate = useNavigate()
	const { setUserData } = useMyContext()
	// @ts-ignore
	const [searchParams, setSearchParams] = useSearchParams()
	const location = useLocation()
	const [currPath, setCurrPath] = useState('/settings')
	const stepParam = searchParams.get('s')
	// @ts-ignore
	const [isPassVerified, setIsPassverified] = useState<boolean>(true)
	useEffect(() => {
		setCurrPath(location.pathname)
	}, [location.pathname])
	return (
		<div id="setting" className="col-md-6 col-12">
			<div className="p-12 pl-16 pr-16 mt-12">
				{currPath === '/settings/account-information' ? (
					<>
						<div className="d-flex align-items-center">
							<i
								className="material-icons fs-24 font-600 primary"
								onClick={() => navigate(-1)}>
								arrow_back
							</i>
							<div className="fs-22 font-600 lh-28 ml-12">
								Account{' '}
								{stepParam === '2' && isPassVerified
									? 'Information'
									: 'Setting'}
							</div>
						</div>
						{stepParam !== '2' ? (
							<>
								<div className="fs-22 lh-28 font-700 mt-24 font-lora ">
									Confirm Your Password
								</div>
								<div className="fs-14 lh-20 font-500 mt-22 mb-6">
									Please enter your password to access it.
								</div>
							</>
						) : (
							<></>
						)}
					</>
				) : currPath === '/settings/change-password' ? (
					<>
						<div className="d-flex align-items-center pb-2">
							<i
								className="material-icons fs-24 font-600 primary"
								onClick={() => navigate(-1)}>
								arrow_back
							</i>
							<div className="fs-22 font-600 lh-28 ml-12">
								Forget Your Password
							</div>
						</div>
					</>
				) : currPath === '/settings/deactivate-account' ? (
					<>
						<div className="d-flex align-items-center pb-2">
							<i
								className="material-icons fs-24 font-600 primary"
								onClick={() => navigate(-1)}>
								arrow_back
							</i>
							<div className="fs-22 font-600 lh-28 ml-12">
								Deactivate Account
							</div>
						</div>
					</>
				) : (
					<>
						<div className="fs-24 font-600 lh-28 extra-light-gray  ">
							Setting
						</div>
						<div className="fs-14 font-500 lh-18 mt-16 primary mt-8">
							View information about your account, download an archive of your
							data, or learn about options for deactivating your account
						</div>
					</>
				)}
			</div>
			<div className="hr-dark"></div>

			{currPath === '/settings' ? (
				<div className="setting-options mt-24">
					<div
						className="option w-100"
						onClick={() => navigate('/settings/account-information')}>
						<div className="d-flex align-items-center">
							<div className="icon-container">
								<i className="material-symbols-outlined fs-22 font-600 text-dark">
									person
								</i>
							</div>
							<div className="ml-16">
								<div className="fs-16 font-600 lh-22 font-lora">
									Account Infotmation
								</div>
								<div className="fs-12 font-400 lh-18 gray">
									View your account information, like your <br /> phone number
									and email address.
								</div>
							</div>
						</div>
						<div className="align-middle">
							<i className="material-icons fs-20">chevron_right</i>
						</div>
					</div>
					<div
						className="option w-100"
						onClick={() => navigate('/settings/change-password')}>
						<div className="d-flex align-items-center">
							<div className="icon-container">
								<i
									className="material-symbols-outlined fs-22 font-600 text-dark"
									style={{ transform: 'rotate(45deg)' }}>
									key_vertical
								</i>
							</div>
							<div className="ml-16">
								<div className="fs-16 font-600 lh-22 font-lora">
									Change Your Password
								</div>
								<div className="fs-12 font-400 lh-18 gray">
									Change Your Password At Any Time.
								</div>
							</div>
						</div>
						<div className="align-middle">
							<i className="material-icons fs-20">chevron_right</i>
						</div>
					</div>
					<div
						className="option w-100"
						onClick={() => navigate('/settings/deactivate-account')}>
						<div className="d-flex align-items-center">
							<div className="icon-container">
								<i className="material-symbols-outlined fs-22 font-600 text-dark">
									person
								</i>
							</div>
							<div className="ml-16">
								<div className="fs-16 font-600 lh-22 font-lora">
									Deactivate Your Account
								</div>
								<div className="fs-12 font-400 lh-18 gray">
									Learn how can you deactivate your account.
								</div>
							</div>
						</div>
						<div className="align-middle">
							<i className="material-icons fs-20">chevron_right</i>
						</div>
					</div>
					<div
						className="option w-100 logout"
						onClick={() => {
							clearAllCookies()
							setUserData({})
							navigate('/login')
						}}>
						<div className="d-flex align-items-center">
							<div className="icon-container">
								<i className="material-symbols-outlined fs-22 font-600">
									logout
								</i>
							</div>
							<div className="ml-16">
								<div className="fs-16 font-600 lh-22 font-lora">Logout</div>
							</div>
						</div>
						<div className="align-middle">
							<i className="material-icons fs-20">chevron_right</i>
						</div>
					</div>
				</div>
			) : (
				<Outlet />
			)}
		</div>
	)
}

export default Setting
