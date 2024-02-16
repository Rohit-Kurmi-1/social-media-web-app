import Cookies from 'universal-cookie'
import CryptoJS from 'crypto-js'
import emailJs from '@emailjs/browser'
import { checkUser } from './api'
const cookies = new Cookies()
export const getCookie = (field: string) => {
	return cookies.get(field)
}

export const setCookie = (
	field: string,
	value: string,
	expireTime: boolean = false
) => {
	if (expireTime) {
		cookies.set(field, value, { expires: new Date(Date.now() + 604800) })
		return
	}
	cookies.set(field, value)
}

export const clearCookie = (field: string) => {
	cookies.remove(field)
}

export const clearAllCookies = () => {
	const cookieDump: string[] = cookies.getAll()
	Array.from(Object.keys(cookieDump)).map((item) =>
		cookies.set(item, '', { expires: new Date(Date.now()) })
	)
}

export const verifyToken = async (token: string) => {
	try {
		const email = deCrypt(token)
		const user = await checkUser(email)
		if (user && user.data) {
			return user.data
		}
		return false
	} catch (error) {
		return false
	}
}

export const enCrypt = (input: string) => {
	return CryptoJS.AES.encrypt(
		JSON.stringify(input),
		import.meta.env.VITE_ENCRYPT_KEY
	).toString()
}

export const deCrypt = (hashedValue: any): string => {
	var bytes = CryptoJS.AES.decrypt(
		hashedValue,
		import.meta.env.VITE_ENCRYPT_KEY
	)
	const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
	return data
}

export const sendMail = async (email: string, otp: string) => {
	try {
		const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_KEY
		const templateID = 'template_hkenb9a'
		const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

		const templateParams = {
			email,
			otp,
		}

		const resp = await emailJs.send(
			serviceId,
			templateID,
			templateParams,
			publicKey
		)
		if (resp) {
			return true
		}
	} catch (error) {
		console.log(error)
	}
	return false
}

export const generateOTP = () => {
	const otp = Math.floor(Math.random() * 1000000)
	return otp.toString()
}

export const isValidEmail = (email: string) => {
	const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
	return emailRegex.test(email)
}

export const renameFile = async (file: any, newFileName: string) => {
	try {
		const renamedFile = new File([file], newFileName, { type: file.type })
		return renamedFile
	} catch (error) {
		console.error('Error renaming file:', error)
		throw error
	}
}

export const truncateString = (str: string, max: number) => {
	if (!str || !str.length) {
		return
	}
	if (str.length <= max) {
		return str
	}
	return str.slice(0, max / 2) + '...' + str.slice(-8)
}
