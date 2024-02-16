interface Children {
	text: string
	action: any
}

interface Dropdown {
	children: Children[]
}

const Dropdown = ({ children }: Dropdown) => {
	return (
		<div id="dropdown">
			<i
				id="dropdownMenuButton"
				className="material-icons fs-20 dark-gray ml-16 align-middle"
				data-toggle="dropdown"
				aria-haspopup="true"
				aria-expanded="false">
				more_horiz
			</i>
			<ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
				{children.map((item: Children, index: number) => (
					<li key={index} className="dropdown-item" onClick={item.action}>
						{item.text}
					</li>
				))}
			</ul>
		</div>
	)
}

export default Dropdown
