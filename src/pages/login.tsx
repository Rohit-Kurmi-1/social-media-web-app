import { Link, useNavigate } from 'react-router-dom'
import Input from '../component/input'
import { useState } from 'react'
import { handleGoogleSSO, login } from '../utils/api'
import { useMyContext } from '../App'

const Login = () => {
	const navigate = useNavigate()
	const { MyToast } = useMyContext()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const validateForm = () => {
		if (email && password) {
			return true
		} else {
			MyToast.warning({ title: 'All Fields are required' })
			return false
		}
	}

	const handleGoogleLogin = async () => {
		const check = await handleGoogleSSO()
		MyToast[check.state]({ title: check.msg })
		if (check.state === 'success') {
			navigate('/home?s=for+you', { replace: true })
		}
	}

	const onSubmit = async (e: any) => {
		e.preventDefault()
		if (!validateForm()) {
			return
		}
		const check = await login({ email, password })
		MyToast[check.state]({ title: check.msg })
		if (check.state !== 'success') {
			setPassword('')
			navigate('/login', { replace: true })
		} else {
			navigate('/home?s=for+you', { replace: true })
		}
	}
	return (
		<div id="loginPage" className="col-md-4 col-12">
			<form className="" onSubmit={onSubmit}>
				<img src="/icons/logo.webp" alt="logo" width={50} />
				<div className="fs-42 font-700 mt-36 font-lora">Log in to Twitter</div>
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
				<input
					className="cylinderical-p w-100 mt-25"
					type="submit"
					value="Log in"
				/>

				<div className="google-sso mt-24" onClick={handleGoogleLogin}>
					<img src="/icons/google.png" alt="Google" width={20} />
					<div className="fs-16  font-500 lh-20 ml-12">Connect with Google</div>
				</div>
				<div className="mt-40 d-flex justify-content-between primary">
					<Link to={'/forget-password'}>Forget Password</Link>
					<Link to={'/signup'}>Sign Up</Link>
				</div>
			</form>
		</div>
	)
}

export default Login
