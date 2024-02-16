interface InputProps {
	leftIcon?: string
	rightIcon?: string
	classNames?: string
	type?: string
	onChange?: any
	value?: string
	placeholder?: string
}
const Input = ({
	leftIcon,
	rightIcon,
	classNames,
	type = 'text',
	onChange = () => {},
	value,
	placeholder = '',
}: InputProps) => {
	return (
		<div id="input">
			{leftIcon && (
				<i className="align-middle fs-18 font-500 lh-22 material-icons">
					{leftIcon}
				</i>
			)}
			<input
				type={type}
				onChange={onChange}
				value={value}
				placeholder={placeholder}
				className={`${leftIcon && 'p-6 pl-28'} ${
					rightIcon && 'p-6 pr-28'
				} ${classNames}`}
			/>
			{rightIcon && (
				<i className="align-middle fs-18 font-500 lh-22 material-icons">
					{rightIcon}
				</i>
			)}
		</div>
	)
}

export default Input
