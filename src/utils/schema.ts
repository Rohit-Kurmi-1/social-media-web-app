export interface UserSchema {
	name?: string
	email?: string
	password?: string
	phoneNumber?: string
	profilePic?: string
	profileBanner?: string
	userName?: string
	country?: string
	address1?: string
	address2?: string
	joinData?: string
	totalFollowing?: number
	totalFollower?: number
	dob?: string
	loginType?: 'plain' | 'sso'
	bio: string
	bookmarks: string[]
	liked: string[]
	isNotUpdated?: true
	followers?: string[]
	following?: string[]
	messageFriend?: any[]
}
