import { Link } from 'react-router-dom'

const PageNotFound = () => {
	return (
		<div
			id="errorPage"
			className="col-12 d-flex justify-content-center align-items-center">
			<div className="d-flex justify-content-center flex-column align-items-center">
				<div className="d-flex align-items-center justify-content-center mb-40">
					<i className="material-icons primary fs-90 	">pest_control</i>
					<div className="fs-90 font-700 font-lora ml-24">404</div>
				</div>
				<img src="/other/404.png" width={300} />
				<div className="mt-40 fs-40 lh-50 font-600 position-relative">
					Page Not Foun <div className="dropLetter">d</div>
				</div>
				<Link to={'/'}>
					<button className="button-p mt-40">
						<span className="ml-8 mr-8">Back To Home Page</span>
					</button>
				</Link>
			</div>
		</div>
	)
}

export default PageNotFound
