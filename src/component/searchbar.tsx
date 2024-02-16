import { useEffect, useRef, useState } from 'react'

interface SearchProp {
	onChange?: any
	value?: any
	inputRef?: any
	dropdownData?: any[]
	setSelected?: any
}
const Searchbar = ({
	onChange,
	value,
	inputRef,
	dropdownData,
	setSelected,
}: SearchProp) => {
	const boxRef = useRef<HTMLDivElement>(null)
	const [showDropDown, setShowDropdown] = useState<boolean>(false)
	const handleOutSideClick = (e) => {
		if (!boxRef.current?.contains(e.target as Node)) {
			setShowDropdown(false)
		}
	}
	useEffect(() => {
		window.addEventListener('click', handleOutSideClick)
		return () => window.removeEventListener('click', handleOutSideClick)
	}, [])

	useEffect(() => {
		if (dropdownData && dropdownData.length) {
			setShowDropdown(true)
		} else {
			setShowDropdown(false)
		}
	}, [dropdownData])

	return (
		<div id="searchbarWithDropdown">
			<div className="searchbar">
				<i className="material-icons fs-18 font-400">search</i>
				<div className="w-100 pr-20">
					<input
						ref={inputRef}
						type="text"
						className="ml-16 w-100"
						placeholder="Search Twitter"
						onChange={onChange}
						value={value}
					/>
				</div>
			</div>
			{showDropDown && (
				<div className="dropdown" ref={boxRef}>
					{dropdownData.length &&
						dropdownData.map((item, index) => (
							<div
								className="result"
								key={index}
								onClick={() => {
									setSelected(item)
									setShowDropdown(false)
								}}>
								<img src={item.profilePic} alt="" width={35} />
								<div className="ml-12">
									<div className="fs-14 font-500 lh-18">{item.name}</div>
									<div className="fs-12 extra-light-gray font-lora lh-18">
										{item.email}
									</div>
								</div>
							</div>
						))}
				</div>
			)}
		</div>
	)
}

export default Searchbar
