/* tslint:disable */

import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import {
	ROUTES_CONFIG,
	ROUTE_WITHOUT_AUTH,
	ROUTE_WITHOUT_LEFTNAV,
	ROUTE_WITHOUT_RIGHTNAV,
} from './utils/router'
import LeftSideBar from './component/leftSideBar'
import RightSideBar from './component/rightSideBar'
import {
	Suspense,
	createContext,
	useContext,
	useLayoutEffect,
	useState,
} from 'react'
import { clearAllCookies, getCookie, verifyToken } from './utils'
import Snackbar from './component/snackbar'
import Loader from './component/loader'
import { UserSchema } from './utils/schema'
import 'react-loading-skeleton/dist/skeleton.css'
import Modal from './component/modal'
import ProfileModal from './popups/profileModal'

interface ToastProp {
	title?: string
	description?: string
	state?: 'success' | 'warning' | 'failed'
}

const MyContext = createContext({
	MyToast: {
		success: ({}: ToastProp) => {},
		warning: ({}: ToastProp) => {},
		error: ({}: ToastProp) => {},
	},
	userData: {} as UserSchema,
	// @ts-ignore
	setUserData: (val: any) => {},
})

export const useMyContext = () => {
	return useContext(MyContext)
}

function App() {
	const location = useLocation()
	const navigate = useNavigate()
	const [activeTab, setActiveTab] = useState('')
	const [token, setToken] = useState(getCookie('auth'))
	const [isValidPath, setIsValidPath] = useState<boolean>(false)
	const [activeToast, setActiveToast] = useState<boolean>(false)
	const [toastDetails, setToastDetails] = useState<ToastProp>({})
	const [userData, setUserData] = useState<any>({})
	const [loading, setLoading] = useState<boolean>(false)
	const [editProfileModal, setEditProfileModal] = useState<boolean>(true)

	const MyToast = {
		success: ({ title, description }: ToastProp) => {
			setActiveToast(true)
			setToastDetails({ title, description, state: 'success' })
		},
		warning: ({ title, description }: ToastProp) => {
			setActiveToast(true)
			setToastDetails({ title, description, state: 'warning' })
		},
		error: ({ title, description }: ToastProp) => {
			setActiveToast(true)
			setToastDetails({ title, description, state: 'failed' })
		},
	}

	const handleAuth = async (path: string) => {
		if (!userData.name) {
			setLoading(true)
			try {
				const user = await verifyToken(token)
				if (user) {
					setUserData(user)
					if (path === '/' || ROUTE_WITHOUT_AUTH.includes(path)) {
						navigate('/home')
					}
				} else {
					clearAllCookies()
					if (path === '/' || !ROUTE_WITHOUT_AUTH.includes(path)) {
						navigate('/login')
					}
				}
			} catch (error) {
				navigate('/login')
			}
			setLoading(false)
		} else if (path === '/') {
			navigate('/home?s=for+you')
		}
	}

	useLayoutEffect(() => {
		const path = location.pathname
		setActiveTab(path.split('/')[1])
		setLoading(false)

		if (path !== '/' && path.slice(-1) === '/') {
			navigate(path.slice(0, -1))
		}

		const checkRoute = ROUTES_CONFIG.some((item) => {
			if (item.path === path) {
				return true
			} else {
				return item.children?.some((child) => item.path + child.path === path)
			}
		})

		setIsValidPath(checkRoute)

		if (token) {
			handleAuth(path)
		} else if (!ROUTE_WITHOUT_AUTH.includes(path) && path === '/') {
			navigate('/login')
		}
	}, [token, location.pathname, userData])

	const storedToken = getCookie('auth')
	if (
		storedToken === undefined &&
		!ROUTE_WITHOUT_AUTH.includes(location.pathname)
	) {
		navigate('/login')
	} else if (storedToken !== token) {
		setToken(storedToken)
	}
	return (
		<div className="container">
			{activeToast ? (
				<Snackbar
					title={toastDetails.title}
					description={toastDetails.description}
					state={toastDetails.state}
					active={activeToast}
					setActive={setActiveToast}
				/>
			) : (
				<></>
			)}

			{loading ? <Loader /> : <></>}
			<MyContext.Provider value={{ MyToast, userData, setUserData }}>
				<div className="row">
					{isValidPath &&
						!ROUTE_WITHOUT_AUTH.includes(location.pathname) &&
						!ROUTE_WITHOUT_LEFTNAV.includes(location.pathname) && (
							<LeftSideBar activeTab={activeTab} />
						)}
					{userData.isNotUpdated && editProfileModal ? (
						<Modal
							modalClass="mt-24"
							onClose={() => setEditProfileModal(false)}>
							<ProfileModal
								setEditProfileModal={setEditProfileModal}
								editProfileModal={editProfileModal}
							/>
						</Modal>
					) : (
						<></>
					)}

					<Suspense fallback={<Loader />}>
						<Routes>
							{ROUTES_CONFIG.map((route, index) => (
								<Route
									key={index}
									path={route.path}
									element={<route.element />}>
									{route.children &&
										route.children.map((child, childIndex) => (
											<Route
												key={childIndex}
												path={route.path + child.path}
												element={<child.element />}
											/>
										))}
								</Route>
							))}
						</Routes>
					</Suspense>
					{isValidPath &&
						!ROUTE_WITHOUT_AUTH.includes(location.pathname) &&
						!ROUTE_WITHOUT_RIGHTNAV.includes(location.pathname) && (
							<RightSideBar />
						)}
				</div>
			</MyContext.Provider>
		</div>
	)
}

export default App
/* tslint:enable */
