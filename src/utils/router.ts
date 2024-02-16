import { lazy } from 'react'

export const ROUTE_WITHOUT_AUTH = ['/login', '/signup', '/forget-password']
export const ROUTE_WITHOUT_LEFTNAV = ['']
export const ROUTE_WITHOUT_RIGHTNAV = ['/message']

export const ROUTES_CONFIG = [
	{
		path: '/login',
		element: lazy(() => import('../pages/login')),
	},
	{
		path: '/signup',
		element: lazy(() => import('../pages/signup')),
	},
	{
		path: '/forget-password',
		element: lazy(() => import('../pages/forgetPassword')),
	},
	{
		path: '/home',
		element: lazy(() => import('../pages/home')),
	},
	{
		path: '/bookmarks',
		element: lazy(() => import('../pages/bookmark')),
	},
	{
		path: '/profile',
		element: lazy(() => import('../pages/profile/userProfile')),
	},
	{
		path: '/user',
		element: lazy(() => import('../pages/profile/otherUser')),
	},
	{
		path: '/explore',
		element: lazy(() => import('../pages/explore')),
	},
	{
		path: '/settings',
		element: lazy(() => import('../pages/setting')),
		children: [
			{
				path: '/account-information',
				element: lazy(() => import('../container/setting/accountSetting')),
			},
			{
				path: '/change-password',
				element: lazy(() => import('../container/setting/changePassword')),
			},
			{
				path: '/deactivate-account',
				element: lazy(() => import('../container/setting/deactivateAccount')),
			},
		],
	},
	{
		path: '/message',
		element: lazy(() => import('../pages/message')),
	},
	{
		path: '/*',
		element: lazy(() => import('../pages/404')),
	},
]
