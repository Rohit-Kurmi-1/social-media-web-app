import { Link, useNavigate } from 'react-router-dom'
import Input from '../component/input'
import { useState } from 'react'
import { GoogleLogin } from '../utils/firebase'
import { checkUser, sendOTP, signUp } from '../utils/api'
import { useMyContext } from '../App'
import { generateOTP, isValidEmail } from '../utils'

const Signup = () => {
	const { MyToast } = useMyContext()
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [step, setStep] = useState<number>(1)
	const [otp, setOtp] = useState('')
	const [userEnteredOTP, setUserEnteredOTP] = useState('')
	const navigate = useNavigate()

	const validateForm = () => {
		if (!isValidEmail(email)) {
			MyToast.warning({ title: 'Please use a valid email address' })
			setEmail('')
			return false
		} else if (!name || !password || !confirmPassword) {
			MyToast.warning({ title: 'All fields are required' })
			return false
		} else if (password !== confirmPassword) {
			setConfirmPassword('')
			MyToast.warning({ title: `Password and confirm password didn't match` })
			return false
		} else if (step === 2 && !userEnteredOTP) {
			MyToast.warning({
				title: `Please enter OTP`,
				description: `We have sent an OTP to ${email}`,
			})
			return false
		} else if (step === 2 && otp !== userEnteredOTP) {
			setUserEnteredOTP('')
			MyToast.warning({
				title: `OTP did not match`,
			})
			return false
		}
		return true
	}

	const onSubmit = async () => {
		if (!validateForm()) {
			return
		} else if (step === 1) {
			const otp = generateOTP()
			const user = await checkUser(email)
			if (!user || !user.data) {
				const resp = await sendOTP(email, otp)
				if (resp) {
					setOtp(otp)
					setStep(2)
					MyToast.success({
						title: 'OTP has been sent',
						description: `An OTP has been sent to ${email}`,
					})
				}
			} else {
				MyToast.error({
					title: `User email ${email} is alredy registered`,
					description: `Kindly Signin`,
				})
			}
		} else if (step === 2) {
			const check = await signUp({ name, email, password })
			MyToast[check.state]({ description: check.msg })
			if (check.state === 'success') {
				navigate('/login')
			} else {
				setPassword('')
				setConfirmPassword('')
			}
		}
	}

	return (
		<div id="loginPage" className="col-md-4 col-12">
			<img src="/icons/logo.webp" alt="logo" width={50} />
			<div className="fs-42 font-700 mt-36 font-lora">Create an Account</div>
			{step === 1 ? (
				<>
					<div className="mt-24">
						<Input
							classNames="fs-18 p-12 pl-8 pr-8"
							placeholder="Name"
							value={name}
							onChange={(e: any) => setName(e.target.value)}
						/>
					</div>
					<div className="mt-24">
						<Input
							classNames="fs-18 p-12 pl-8 pr-8"
							placeholder="Email address"
							value={email}
							onChange={(e: any) => setEmail(e.target.value)}
						/>
					</div>
					<div className="mt-18">
						<Input
							classNames="fs-18 p-12 pl-8 pr-8"
							placeholder="Password"
							type="password"
							value={password}
							onChange={(e: any) => setPassword(e.target.value)}
						/>
					</div>
					<div className="mt-18">
						<Input
							classNames="fs-18 p-12 pl-8 pr-8"
							placeholder="Conform Password"
							type="password"
							value={confirmPassword}
							onChange={(e: any) => setConfirmPassword(e.target.value)}
						/>
					</div>
					<button className="cylinderical-p w-100 mt-25" onClick={onSubmit}>
						Next
					</button>
				</>
			) : (
				step === 2 && (
					<>
						<div className="mt-18">
							<Input
								classNames="fs-18 p-12 pl-8 pr-8"
								placeholder="Enter OTP"
								value={userEnteredOTP}
								onChange={(e: any) => setUserEnteredOTP(e.target.value)}
							/>
						</div>
						<button className="cylinderical-p w-100 mt-25" onClick={onSubmit}>
							Sign Up
						</button>
					</>
				)
			)}

			<div className="google-sso mt-24" onClick={() => GoogleLogin()}>
				<img src="/icons/google.png" alt="Google" width={20} />
				<div className="fs-16  font-500 lh-20 ml-12">Connect with Google</div>
			</div>
			<Link
				to={'/login'}
				className="mt-40 d-flex justify-content-center primary cursor-pointer">
				Click here for Login
			</Link>
		</div>
	)
}

export default Signup
