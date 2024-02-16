import { useRef, useState } from 'react'
import Input from '../component/input'
import './profileModal.scss'
import { useMyContext } from '../App'
import {
	getInitials,
	updateProfile,
	updateUserAllPosts,
	uploadImage,
} from '../utils/api'
import { renameFile } from '../utils'

interface ProfileUpdateProps {
	editProfileModal: any
	setEditProfileModal: any
}

const ProfileModal = ({
	editProfileModal,
	setEditProfileModal,
}: ProfileUpdateProps) => {
	const { userData, MyToast, setUserData } = useMyContext()
	const inputRef = useRef<HTMLInputElement>(null)
	const bannerInputRef = useRef<HTMLInputElement>(null)
	const [data, setData] = useState(userData)

	const handleChange = (field: string, value: string) => {
		const obj: any = { ...data }
		obj[field] = value
		setData(obj)
	}

	const handleProfilePhoto = async (e: any) => {
		if (e.target && e.target.files.length) {
			if (e.target.files[0].size > 1024 * 1024 * 2) {
				return MyToast.warning({
					title: 'Image is too large',
					description: 'Kindly upload image within 2 MB.',
				})
			}
			try {
				const renamedFile = await renameFile(
					e.target.files[0],
					data.email as string
				)
				const image = await uploadImage(renamedFile)
				if (image) {
					handleChange('profilePic', image)
					return MyToast.success({
						title: 'Image Uploaded Success',
						description: 'This will be your profile pic',
					})
				}
			} catch (error) {
				console.log(error)
			}
			return MyToast.error({
				title: 'Something Went Wrong',
			})
		}
	}

	const handleBanner = async (e: any) => {
		if (e.target && e.target.files.length) {
			if (e.target.files[0].size > 1024 * 1024 * 2) {
				return MyToast.warning({
					title: 'Image is too large',
					description: 'Kindly upload image within 2 MB.',
				})
			}
			try {
				const renamedFile = await renameFile(
					e.target.files[0],
					(data.email as string) + 'banner'
				)
				const image = await uploadImage(renamedFile)
				if (image) {
					handleChange('profileBanner', image)
					return MyToast.success({
						title: 'Image Uploaded Success',
						description: 'This will be your profile pic',
					})
				}
			} catch (error) {
				console.log(error)
			}
			return MyToast.error({
				title: 'Something Went Wrong',
			})
		}
	}

	const handleSubmit = async () => {
		try {
			const updateProfilePromise = updateProfile({
				...data,
				isNotUpdated: false,
			})

			const updatePostPromise = updateUserAllPosts({
				email: data.email,
				user: data.email,
				profilePic: data.profilePic,
				userName: data.name,
			})
			//@ts-ignore
			const [profileUpdateResult, posts] = await Promise.all([
				updateProfilePromise,
				updatePostPromise,
			])

			if (
				profileUpdateResult &&
				posts.state &&
				profileUpdateResult.state === 'success'
			) {
				setUserData(data)
				MyToast[posts.state]({ title: posts.msg })
				setEditProfileModal(!editProfileModal)
			}
		} catch (error) {
			console.error('Error during API calls:', error)
			MyToast.error({ title: 'Something Went Wrong' })
			setEditProfileModal(!editProfileModal)
		}
	}

	return (
		<div id="profileModal">
			<div className="fs-20 font-500 lh-28 text-dark">Edit Profile</div>
			<div className="fs-14 font-400 lh-18 mt-8 text-dark">
				Provide Details about yourself and any other pertinent information .
			</div>
			<div className="hr-dark mt-20 mb-20"></div>
			<div className="fs-16 font-500 lh-22 text-dark">Basic Information</div>
			<div className="mt-8">
				<div className="d-flex align-items-start " style={{ gap: '8px' }}>
					<div className="ml-8 mr-8">
						<div
							className="profile-container"
							onClick={() => inputRef.current?.click()}>
							<input
								type="file"
								className="d-none"
								ref={inputRef}
								onChange={handleProfilePhoto}
								accept="image/jpeg,image/png,image/gif"
							/>
							<div className="icon-container">
								<i className="material-icons">add_a_photo</i>
							</div>
							<img src={data.profilePic} alt="" />
						</div>
						<div className="mt-12 text-center">
							<div className="fs-12 font-500 lh-18 text-dark">
								Profile Photo
							</div>
							<div className="fs-12 font-500 lh-18 light-gray">
								Recommended <br /> 300 x 300
							</div>
							<div className="d-flex align-items-center text-dark">
								<div className="btn" onClick={() => inputRef.current?.click()}>
									Change
								</div>
								<div
									className="btn ml-8"
									onClick={() =>
										handleChange(
											'profilePic',
											getInitials(userData.name as string)
										)
									}>
									Remove
								</div>
							</div>
						</div>
					</div>
					<div className="bannerImage">
						<div className="icon-container">
							<i
								className="material-icons fs-20"
								onClick={() => bannerInputRef.current?.click()}>
								add_a_photo
							</i>
						</div>
						<input
							type="file"
							className="d-none"
							ref={bannerInputRef}
							onChange={handleBanner}
							accept="image/jpeg,image/png,image/gif"
						/>
						<img src={data.profileBanner} alt="" />
					</div>
				</div>
				<div className="d-flex align-items-center" style={{ gap: '8px' }}>
					<div className="w-50">
						<div className="fs-12 font-600 lh-18 mb-1 text-dark">Full Name</div>
						<Input
							classNames="p-8"
							value={data.name}
							placeholder="Enter Your Name"
							onChange={(e: any) => handleChange('name', e.target.value)}
						/>
					</div>
					<div className="w-50">
						<div className="fs-12 font-600 lh-18 mb-1 text-dark">DOB</div>
						<Input
							classNames="p-8"
							value={data.dob}
							type="date"
							placeholder="Enter Your DOB"
							onChange={(e: any) => handleChange('dob', e.target.value)}
						/>
					</div>
				</div>
				<div className="d-flex align-items-center" style={{ gap: '8px' }}>
					<div className="mt-12 w-50">
						<div className="fs-12 font-600 lh-18 mb-1 text-dark">Contact</div>
						<Input
							classNames="p-8"
							value={data.phoneNumber}
							placeholder="Contact No."
							onChange={(e: any) => handleChange('phoneNumber', e.target.value)}
						/>
					</div>
					<div className="mt-12 w-50">
						<div className="fs-12 font-600 lh-18 mb-1 text-dark">Country</div>
						<Input
							classNames="p-8"
							value={data.country}
							placeholder="Country"
							onChange={(e: any) => handleChange('country', e.target.value)}
						/>
					</div>
				</div>

				<div className="mt-8">
					<div className="fs-12 font-600 lh-18 mb-1 text-dark">Bio</div>
					<textarea
						name=""
						rows={3}
						value={data.bio}
						placeholder="Short Description"
						onChange={(e: any) =>
							handleChange('bio', e.target.value)
						}></textarea>
					<div className="fs-12 font-400 lh-18 light-gray">
						Brief Description for your profile (max: 300 words).
					</div>
				</div>
			</div>
			<div className="hr-dark mt-20 mb-20"></div>
			<button className="w-100 button-p size-m" onClick={handleSubmit}>
				<span className="ml-8 mr-8 ">Save</span>
			</button>
		</div>
	)
}

export default ProfileModal
