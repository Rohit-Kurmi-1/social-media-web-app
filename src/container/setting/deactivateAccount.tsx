import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Input from '../../component/input'
import { useMyContext } from '../../App'
import { deactivateAccount } from '../../utils/api'
import Modal from '../../component/modal'

const DeactivateAccount = () => {
	const { userData, MyToast, setUserData } = useMyContext()
	// @ts-ignore
	const [searchParams, setSearchParams] = useSearchParams()
	const [confirmDeleteModal, setConfirmDeleteModal] = useState<boolean>(false)
	const navigate = useNavigate()
	const [step, setStep] = useState<number>(1)
	const [password, setPassword] = useState('')
	const stepParam = searchParams.get('s')

	const onSubmit = async () => {
		if (password !== userData.password) {
			MyToast.warning({
				title: 'Invalid Password',
				description: 'Please Enter Valid Password',
			})
			setPassword('')
			return
		}
		setConfirmDeleteModal(true)
		if (confirmDeleteModal) {
			try {
				const resp = await deactivateAccount(userData.email as string)
				if (resp) {
					setUserData({})
					navigate('/login')
					MyToast[resp.state]({ title: resp.msg })
				}
			} catch (error) {
				setPassword('')
				MyToast.error({ title: 'Something Went Wrong' })
			}
		}
	}

	useEffect(() => {
		if (stepParam === '2') {
			setStep(2)
		} else {
			setStep(1)
		}
	}, [stepParam])
	return (
		<div id="deactivateAccount">
			{confirmDeleteModal ? (
				<Modal modalClass="mt-24" onClose={() => setConfirmDeleteModal(false)}>
					<div className="confirmDeactivate p-24 pb-0 mb-12">
						<div className="fs-18 font-600 lh-24 mr-24">
							Confirm want to Delete your account ?
						</div>
						<div className="fs-14 font-400 lh-18 mt-6 dark-gray">
							Deleting your account will remove all your information from our
							<br />
							database. This action cannot be undone in a good way.
						</div>
						<div className="d-flex justify-content-end align-items-center mt-24">
							<button
								className="cylinderical-w size-m mr-4"
								onClick={() => {
									setConfirmDeleteModal(false)
									setPassword('')
									navigate(-1)
								}}>
								<span className="ml-8 mr-8 font-700">Cancel</span>
							</button>
							<button
								className="delete-button-cylinderical size-m"
								onClick={onSubmit}>
								<span className="ml-8 mr-8">Confirm</span>
							</button>
						</div>
					</div>
				</Modal>
			) : (
				<></>
			)}
			{step === 2 ? (
				<>
					<div className="p-20">
						<div className=" fs-22 lh-26 font-600 primary">
							Confirm Your Password
						</div>
						<div className="fs-12 lh-16 dark-gray mt-12">
							Complete your deactivation request by entering your account
							password.
						</div>
					</div>
					<div className="hr-dark"></div>
					<div className="p-20">
						<Input
							type="password"
							placeholder="Current Password"
							classNames="pt-12 pl-12 pb-12 fs-32"
							onChange={(e: any) => setPassword(e.target.value)}
							value={password}
						/>
						<div className="primary fs-12 font-600 lh-16 mt-1 pl-2">
							Forget Password ?
						</div>
					</div>
					<div className="d-flex justify-content-end pr-20 pl-20 mb-3">
						<button
							className="delete-button-cylinderical size-m"
							onClick={onSubmit}>
							<span className="ml-4 mr-4">Deactivate</span>
						</button>
					</div>
					<div className="hr-dark"></div>
				</>
			) : (
				<>
					<div className="p-20">
						<div className="profileContainer d-flex align-items-center mb-16">
							<img
								src={userData.profilePic}
								alt=""
								width={40}
								height={40}
								style={{ borderRadius: '50%' }}
							/>
							<div className="ml-16">
								<div className="fs-15 font-700 lh-20"> {userData.name}</div>
								<div className="fs-15 font-400 lh-20 dark-gray">
									{userData.email}
								</div>
							</div>
						</div>
						<div className="mt-24 fs-22 lh-26 font-600 primary">
							This will deactivate your account
						</div>
						<div className="dark-gray fs-14 lh-18 mt-12">
							You are about to begin the process of deactivating your X account.
							Your display name, @username, and public profiles will no longer
							appear on X.com, X for iOS, and X for Android.
						</div>
						<div className="mt-24 fs-22 lh-26 font-600 primary">
							What else you need to know
						</div>
					</div>
					<div className="pt-12 pb-12 font-400 fs-12 lh-16 dark-gray mt-12 pl-20 pr-20">
						If your X account has been deactivated mistakenly or
						inappropriately, you can restore your account within 30 days after
						deactivation.
					</div>
					<div className="hr-light"></div>
					<div className="pt-12 pb-12 font-400 fs-12 lh-16 dark-gray pl-20 pr-20">
						Some account information may still be available in search engines
						like Google or Bing. Leam more
					</div>
					<div className="hr-light"></div>
					<div className="pt-12 pb-12 font-400 fs-12 lh-16 dark-gray pl-20 pr-20">
						If you just want to change your @username, you don't need to
						deactivate your account — go to your Settings and edit it.
					</div>
					<div className="hr-light"></div>
					<div className="pt-12 pb-12 font-400 fs-12 lh-16 dark-gray pl-20 pr-20">
						To use your existing @username or email address with another X
						account, change them before deactivating this account.
					</div>
					<div className="hr-light"></div>
					<div className="pt-12 pb-12 font-400 fs-12 lh-16 dark-gray pl-20 pr-20">
						If you wish to download your X data, you must complete both the
						request and download process before your account can be deactivated.
						Links to download your data can't be sent to deactivated accounts.
					</div>
					<div className="hr-light"></div>
					<div
						className=" mt-6 delete-btn"
						onClick={() => navigate('/settings/deactivate-account?s=2')}>
						Deactivate
					</div>
				</>
			)}
		</div>
	)
}

export default DeactivateAccount
