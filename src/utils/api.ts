import {
	addDoc,
	arrayRemove,
	arrayUnion,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	increment,
	limit,
	orderBy,
	query,
	setDoc,
	startAfter,
	updateDoc,
	where,
} from 'firebase/firestore'
import { GoogleLogin, firestore, storage } from './firebase'
import {
	clearAllCookies,
	deCrypt,
	enCrypt,
	getCookie,
	isValidEmail,
	sendMail,
	setCookie,
} from '.'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

interface MessageProp {
	state: 'success' | 'error' | 'warning'
	msg: string
}

const createMsg = ({ state, msg }: MessageProp): MessageProp => {
	return { state, msg }
}

// For SignUp
export const signUp = async (data: any): Promise<MessageProp> => {
	try {
		const collectionRef = collection(firestore, 'users')
		const userRef = doc(collectionRef, data.email)
		const user = await getDoc(userRef)
		if (user.data()) {
			return createMsg({ state: 'warning', msg: 'User Already Exists' })
		} else {
			await setDoc(userRef, {
				...data,
				profilePic: getInitials(data.name),
				phoneNumber: data.phoneNumber ? data.phoneNumber : '',
				userName: data.userName ? data.userName : '',
				country: data.country ? data.country : '',
				address1: data.address1 ? data.address1 : '',
				address2: data.address2 ? data.address2 : '',
				joinData: Date.now(),
				totalFollowing: data.totalFollowing ? data.totalFollowing : 0,
				totalFollower: data.totalFollower ? data.totalFollower : 0,
				dob: data.dob ? data.dob : '',
				loginType: data.loginType ? data.loginType : 'plain',
				bookmarks: [],
				liked: [],
				isNotUpdated: true,
				profileBanner: '',
			})

			return createMsg({
				state: 'success',
				msg: 'Your account has been created.',
			})
		}
	} catch (error: any) {
		return createMsg({
			state: 'error',
			msg: 'Something Went Wrong',
		})
	}
}

export const login = async (payload: any): Promise<MessageProp> => {
	try {
		const { data } = await checkUser(payload.email)
		if (data && data.password === payload.password) {
			setCookie('auth', enCrypt(data.email))
			return createMsg({
				state: 'success',
				msg: `Hi ${data.name}! Welcome on Twitter`,
			})
		} else {
			return createMsg({
				state: 'error',
				msg: 'Invalid id or password',
			})
		}
	} catch (error: any) {
		return createMsg({
			state: 'error',
			msg: 'Something Went Wrong',
		})
	}
}

export const checkUser = async (email: string) => {
	try {
		const collectionRef = collection(firestore, 'users')
		const userRef = doc(collectionRef, email)
		const user = await getDoc(userRef)

		return user.data() ? { userRef, data: user.data() } : {}
	} catch (error: any) {
		return {}
	}
}

export const changePassword = async (
	email: string,
	password: string
): Promise<MessageProp> => {
	try {
		const user = await checkUser(email)
		if (user.data) {
			user.data.password = password
			user.data.loginType = 'plain'
			await updateDoc(user.userRef, user.data)
			return createMsg({
				state: 'success',
				msg: 'Password Changed Successfully',
			})
		}
		return createMsg({
			state: 'error',
			msg: `No User Found with ${email}`,
		})
	} catch (error: any) {
		return createMsg({
			state: 'error',
			msg: 'Something Went Wrong',
		})
	}
}

export const sendOTP = async (email: string, otp: string) => {
	try {
		if (isValidEmail(email)) {
			return await sendMail(email, otp)
		} else {
			return false
		}
	} catch (error: any) {
		return false
	}
}

export const handleGoogleSSO = async (): Promise<MessageProp> => {
	try {
		const collectionRef = collection(firestore, 'users')
		const credential = await GoogleLogin()
		if (credential.user && credential.user.email) {
			const userRef: any = doc(collectionRef, credential.user.email)
			const user = await getDoc(userRef)
			if (!user.exists()) {
				await signUp({
					name: credential.user.displayName,
					email: credential.user.email,
					phoneNumber: credential.user.phoneNumber,
					profilePic: credential.user.photoURL
						? credential.user.photoURL
						: getInitials(
								credential.user.displayName ? credential.user.displayName : 'AB'
						  ),
					loginType: 'sso',
				})
			}
			setCookie('auth', enCrypt(credential.user.email))
			return createMsg({
				state: 'success',
				msg: `Hi ${credential.user.displayName}! Welcome on Twitter`,
			})
		}
	} catch (error: any) {
		console.log(error)
	}
	return createMsg({
		state: 'error',
		msg: 'Something Went Wrong',
	})
}

export const uploadImage = async (file: any) => {
	const imageRef = ref(storage, 'images/' + file.name)
	const reference = await uploadBytes(imageRef, file)
	if (reference) {
		return await getDownloadURL(imageRef)
	}
	return false
}

export const getInitials = (name: string) => {
	const nameForUrl = name.split(' ').join('+')
	return `https://ui-avatars.com/api/?rounded=true&bold=true&background=random&name=${nameForUrl}`
}

export const createAPost = async (post: any) => {
	const collectionRef = collection(firestore, 'posts')
	return await addDoc(collectionRef, {
		...post,
		user: deCrypt(getCookie('auth')),
		cratedAt: Date.now(),
		totalLikes: 0,
		totalComments: 0,
		totalViews: 0,
	})
}
export const getPosts = async (lastDoc: any, max = 10) => {
	let q = query(
		collection(firestore, 'posts'),
		orderBy('cratedAt', 'desc'),
		limit(max)
	)

	if (lastDoc) {
		q = query(
			collection(firestore, 'posts'),
			orderBy('cratedAt', 'desc'),
			startAfter(lastDoc.cratedAt),
			limit(max)
		)
	}

	const snapshot = await getDocs(q)
	const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

	return data
}

export const getUserPosts = async (
	email: string | undefined,
	max: number = 10
) => {
	const data: any[] = []
	const collectionRef = collection(firestore, 'posts')
	const q = query(
		collectionRef,
		where('user', '==', email),
		orderBy('cratedAt', 'desc'),
		limit(max)
	)
	const posts = await getDocs(q)
	posts.forEach((post) => {
		data.push({ ...post.data(), id: post.id })
	})
	return data
}

export const deleteAllUserPosts = async (email: string) => {
	try {
		const collectionRef = collection(firestore, 'posts')
		const q = query(collectionRef, where('user', '==', email))
		const posts = await getDocs(q)
		const deletionPromises = posts.docs.map(async (post) => {
			await deleteDoc(post.ref)
		})
		await Promise.all(deletionPromises)
		return true
	} catch (error) {
		console.error('Error deleting user posts:', error)
		return false
	}
}

export const deactivateAccount = async (email: string) => {
	const users = collection(firestore, 'users')
	const userRef = doc(users, email)
	const resp = await deleteAllUserPosts(email)
	if (resp) {
		await deleteDoc(userRef)
		clearAllCookies()
		return createMsg({ state: 'success', msg: 'Deactivation Done' })
	}
	return createMsg({
		state: 'error',
		msg: 'Error While Deleting Your Account',
	})
}

export const saveToBookmark = async (postId: any, alreadyPresent: boolean) => {
	try {
		const email = deCrypt(getCookie('auth'))
		const users = collection(firestore, 'users')
		const userRef = doc(users, email)
		await updateDoc(userRef, {
			bookmarks: alreadyPresent ? arrayRemove(postId) : arrayUnion(postId),
		})
		return true
	} catch (error) {
		return false
	}
}

export const likePost = async (postId: any, alreadyLiked: boolean) => {
	try {
		const email = deCrypt(getCookie('auth'))
		const users = collection(firestore, 'users')
		const userRef = doc(users, email)
		await updateDoc(userRef, {
			liked: alreadyLiked ? arrayRemove(postId) : arrayUnion(postId),
		})
		const postDoc = doc(collection(firestore, 'posts'), postId)
		await updateDoc(postDoc, {
			totalLikes: alreadyLiked ? increment(-1) : increment(1),
		})
		return true
	} catch (error) {
		return false
	}
}

export const getBookmarks = async (bookmarks: any[]) => {
	const bookMarks: any[] = []
	try {
		const collectionRef = collection(firestore, 'posts')
		const q = query(collectionRef, where('__name__', 'in', bookmarks))
		const snapshot = await getDocs(q)
		snapshot.forEach((doc) => {
			bookMarks.push({ ...doc.data(), id: doc.id })
		})
		return bookMarks
	} catch (error) {
		return bookMarks
	}
}
//@ts-ignore
export const getAllLikedPosts = async (email: any, liked: any[]) => {
	const posts: any[] = []
	try {
		const collectionRef = collection(firestore, 'posts')
		const q = query(collectionRef, where('__name__', 'in', liked))
		const snapshot = await getDocs(q)
		snapshot.forEach((doc) => {
			posts.push({ ...doc.data(), id: doc.id })
		})
		return posts
	} catch (error) {
		return posts
	}
}

export const updateProfile = async (payload: any): Promise<MessageProp> => {
	try {
		if (payload.email) {
			const docRef = doc(firestore, 'users', payload.email)
			await updateDoc(docRef, payload)
			return createMsg({
				state: 'success',
				msg: 'Profile Updated Successfully',
			})
		}
	} catch (error: any) {}
	return createMsg({
		state: 'error',
		msg: 'Something Went Wrong',
	})
}

export const updateUserAllPosts = async (
	payload: any
): Promise<MessageProp> => {
	try {
		if (payload.email) {
			const postsCollection = collection(firestore, 'posts')
			const userPostsQuery = query(
				postsCollection,
				where('user', '==', payload.email)
			)
			const userPostsSnapshot = await getDocs(userPostsQuery)
			const updatePromises = userPostsSnapshot.docs.map(async (postDoc) => {
				const postRef = doc(postsCollection, postDoc.id)
				await updateDoc(postRef, payload)
			})

			// Wait for all updates to complete
			await Promise.all(updatePromises)

			return createMsg({
				state: 'success',
				msg: 'Profile Updated Successfully for all posts',
			})
		}
	} catch (error: any) {
		console.error(error)
	}

	return createMsg({
		state: 'error',
		msg: 'Something Went Wrong',
	})
}

export const searchUsers = async (name: string) => {
	const users: any[] = []
	try {
		const collectionRef = collection(firestore, 'users')
		const allusers = await getDocs(collectionRef)
		allusers.forEach((doc) => {
			const data = doc.data()
			if (
				data.name
					.toLowerCase()
					.split(' ')
					.join('')
					.includes(name.toLowerCase().split(' ').join(''))
			) {
				users.push({ ...doc.data(), id: doc.id })
			}
		})
		return users
	} catch (error) {
		console.log(error)
		return users
	}
}

export const doFollow = async (
	email: any,
	recipientEmail: string,
	opType: boolean = true
) => {
	try {
		const collectionRef = collection(firestore, 'users')
		const myRef = doc(collectionRef, email)
		const recipientRef = doc(collectionRef, recipientEmail)

		if (opType) {
			await updateDoc(myRef, {
				following: arrayUnion(recipientEmail),
				totalFollowing: increment(1),
			})
			await updateDoc(recipientRef, {
				followers: arrayUnion(email),
				totalFollower: increment(1),
			})
		} else {
			await updateDoc(myRef, {
				following: arrayRemove(recipientEmail),
				totalFollowing: increment(-1),
			})
			await updateDoc(recipientRef, {
				followers: arrayRemove(email),
				totalFollower: increment(-1),
			})
		}
		return true
	} catch (error) {
		console.log(error)
		return false
	}
}

export const getUserChats = async (user1: string, user2: string) => {
	try {
		const chatsId = [user1, user2].sort().join('_')
		const collectionRef = collection(firestore, 'chats')
		const chatsRef = doc(collectionRef, chatsId)
		const resp = await getDoc(chatsRef)
		return resp.data().messages
	} catch (error) {
		console.log(error)
		return []
	}
}

export const doChat = async (user1: any, user2: string, payload: any) => {
	try {
		const chatsId = [user1.email, user2].sort().join('_')
		const collectionRef = collection(firestore, 'chats')
		const myRef = doc(collectionRef, chatsId)
		const otherUserRef = doc(collection(firestore, 'users'), user2)
		await Promise.all([
			setDoc(myRef, { messages: arrayUnion(payload) }, { merge: true }),
			updateDoc(otherUserRef, { messageFriend: arrayUnion(user1) }),
		])
		return true
	} catch (error) {
		console.log(error)
		return false
	}
}
