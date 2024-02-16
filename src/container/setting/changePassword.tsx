import { useState } from 'react'
import Input from '../../component/input'
import { useMyContext } from '../../App'
import { changePassword } from '../../utils/api'
import { useNavigate } from 'react-router-dom'

const ChangePassword = () => {
	const navigate = useNavigate()
	const { MyToast, userData } = useMyContext()
	const [password, setPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [confirmNewPassword, setConfirmNewPassword] = useState('')

	const validateForm = () => {
		if (!password || !newPassword || !confirmNewPassword) {
			MyToast.warning({ title: 'All Fields are mandatory' })
			return false
		} else if (newPassword !== confirmNewPassword) {
			MyToast.warning({ title: 'Confirm password does not match' })
			setConfirmNewPassword('')
			return false
		} else if (userData.password !== password) {
			MyToast.error({ title: 'Current Password is not match with record' })
			setConfirmNewPassword('')
			setPassword('')
			setNewPassword('')
			return false
		}
		return true
	}

	const onSubmit = async () => {
		if (!validateForm()) {
			return
		}
		try {
			const resp = await changePassword(userData.email as string, newPassword)
			if (resp) {
				MyToast[resp.state]({ title: resp.msg })
				navigate(-1)
			}
		} catch (error) {
			setConfirmNewPassword('')
			setPassword('')
			setNewPassword('')
			MyToast.error({ title: 'Something Went Wrong' })
		}
	}
	return (
		<div id="changePassword" className="p-20">
			<div>
				<Input
					type="password"
					placeholder="Current Password"
					classNames="pt-8 pl-12 pb-8 fs-24"
					onChange={(e: any) => setPassword(e.target.value)}
					value={password}
				/>
				{/* <div className="primary fs-12 font-600 lh-16 mt-1 pl-2">
					Forget Password ?
				</div> */}
			</div>
			<div className="mt-24">
				<Input
					type="password"
					placeholder="New Password"
					classNames="pt-8 pl-12 pb-8 fs-24"
					onChange={(e: any) => setNewPassword(e.target.value)}
					value={newPassword}
				/>
			</div>
			<div className="mt-24">
				<Input
					type="password"
					placeholder="Confirm Password"
					classNames="pt-8 pl-12 pb-8 fs-24"
					onChange={(e: any) => setConfirmNewPassword(e.target.value)}
					value={confirmNewPassword}
				/>
			</div>
			<div className="mt-16 fs-14 font-400 lh-18 dark-gray">
				Changing your password will log you out of all active sessions from the
				Prasoon Asati session, excluding one application that has access to your
				account.
			</div>
			<div className="d-flex justify-content-end mt-16">
				<button className="cylinderical-p size-m" onClick={onSubmit}>
					<span className="ml-4 mr-4">Change Password</span>
				</button>
			</div>
		</div>
	)
}

export default ChangePassword
