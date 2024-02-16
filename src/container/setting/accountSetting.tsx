import { useState } from 'react'
import Input from '../../component/input'
import Modal from '../../component/modal'
import ProfileModal from '../../popups/profileModal'
import { useMyContext } from '../../App'

const AccountSetting = () => {
	const { MyToast, userData } = useMyContext()
	const [isPasswordVerified, setIsPasswordVerified] = useState<boolean>(false)
	const [password, setPassword] = useState('')

	const onSubmit = async () => {
		if (!password) {
			MyToast.error({ title: 'Something Went Wrong' })
			return
		} else if (userData.password !== password) {
			MyToast.warning({ title: 'Password did not match with records' })
			return
		}
		setIsPasswordVerified(true)
		setPassword('')
	}

	return (
		<div className="p-20">
			{isPasswordVerified && (
				<Modal modalClass="mt-24" onClose={() => setIsPasswordVerified(false)}>
					<ProfileModal
						setEditProfileModal={setIsPasswordVerified}
						editProfileModal={isPasswordVerified}
					/>
				</Modal>
			)}
			<div>
				<Input
					type="password"
					placeholder="Password"
					classNames="pt-8 pl-12 pb-8 fs-24"
					onChange={(e: any) => setPassword(e.target.value)}
					value={password}
				/>
				<div className="primary fs-12 font-600 lh-16 mt-1 pl-2 text-light">
					Forget Password ?
				</div>
			</div>
			<div className="d-flex justify-content-end">
				<button className="cylinderical-p size-m mt-12" onClick={onSubmit}>
					<span className="ml-4 mr-4">Confirm</span>
				</button>
			</div>
		</div>
	)
}

export default AccountSetting
