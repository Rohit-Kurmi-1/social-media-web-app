interface Stepper {
	steps: string[]
	setStep: any
	activeStep: string
}

const Stepper = ({ setStep, steps, activeStep }: Stepper) => {
	return (
		<div id="stepper">
			{steps &&
				steps.map((step, index) => (
					<div key={index} onClick={() => setStep(step.toLowerCase())}>
						<div
							className={`step ${
								activeStep === step.toLowerCase() && 'active'
							}`}>
							{step}
						</div>
					</div>
				))}
		</div>
	)
}

export default Stepper
