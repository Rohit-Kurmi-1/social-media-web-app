import { Link, useNavigate } from 'react-router-dom'
import Input from '../component/input'
import { useState } from 'react'
import { changePassword, checkUser, sendOTP } from '../utils/api'
import { useMyContext } from '../App'
import { generateOTP, isValidEmail } from '../utils'

const ForgetPassword = () => {
	const navigate = useNavigate()
	const { MyToast } = useMyContext()
	const [email, setEmail] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [step, setStep] = useState<number>(1)
	const [otp, setOtp] = useState('')
	const [userEnteredOTP, setUserEnteredOTP] = useState('')

	const validateForm = () => {
		if (isValidEmail(email) && step === 1) {
			return true
		} else if (otp && newPassword === confirmPassword && step === 2) {
			if (otp !== userEnteredOTP) {
				MyToast.warning({ title: 'Invalid OTP' })
				setUserEnteredOTP('')
				return false
			}
			return true
		}
		MyToast.warning({ title: 'All Fields are required' })
		return false
	}

	const handleSubmit = async (e: any) => {
		e.preventDefault()
		if (!validateForm()) {
			return
		} else if (step === 1) {
			const user = await checkUser(email)
			if (user && user.data) {
				const otp = generateOTP()
				const resp = await sendOTP(email, otp)
				if (resp) {
					setOtp(otp)
					setStep(2)
					MyToast.success({
						title: 'OTP has been sent',
						description: `An Otp has been sent to ${email}`,
					})
					return
				}
			} else {
				MyToast.error({
					title: `User email ${email} is not registered`,
					description: `Kindly signup`,
				})
				return
			}
		} else if (step === 2) {
			const check = await changePassword(email, newPassword)
			MyToast[check.state]({ title: check.msg })
			if (check.state === 'success') {
				navigate('/login')
			}
			return
		}
		MyToast.error({
			title: 'Something Went Wrong',
		})
	}
	return (
		<div id="loginPage" className="col-md-4 col-12">
			<form onSubmit={handleSubmit}>
				<img src="/icons/logo.webp" alt="logo" width={50} />
				<div className="fs-42 font-700 mt-36 font-lora">Forget Password</div>
				{step === 2 ? (
					<>
						<div className="mt-24">
							<Input
								classNames="fs-18 p-12 pl-8 pr-8"
								placeholder="OTP"
								value={userEnteredOTP}
								onChange={(e: any) => setUserEnteredOTP(e.target.value)}
							/>
						</div>
						<div className="mt-24">
							<Input
								classNames="fs-18 p-12 pl-8 pr-8"
								placeholder="New Password"
								type="password"
								value={newPassword}
								onChange={(e: any) => setNewPassword(e.target.value)}
							/>
						</div>
						<div className="mt-24">
							<Input
								classNames="fs-18 p-12 pl-8 pr-8"
								placeholder="Confirm Password"
								type="password"
								value={confirmPassword}
								onChange={(e: any) => setConfirmPassword(e.target.value)}
							/>
						</div>
						<input
							className="cylinderical-p w-100 mt-25"
							type="submit"
							value="Change Password"
						/>
					</>
				) : (
					<>
						<div className="mt-24">
							<Input
								classNames="fs-18 p-12 pl-8 pr-8"
								placeholder="Email address"
								value={email}
								onChange={(e: any) => setEmail(e.target.value)}
							/>
						</div>
						<input
							className="cylinderical-p w-100 mt-25"
							type="submit"
							value="Get OTP"
						/>
					</>
				)}

				<div className="mt-40 d-flex justify-content-between primary">
					<Link to={'/signup'}>Sign Up</Link>
					<Link to={'/login'}>Login</Link>
				</div>
			</form>
		</div>
	)
}

export default ForgetPassword
