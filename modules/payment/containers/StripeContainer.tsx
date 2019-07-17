import React, { useLayoutEffect, useState } from 'react';
import { StripeProvider, Elements } from 'react-stripe-elements';
// payment components
import StripeForm from 'modules/payment/containers/StripeForm';
// configs
import config from 'config';

const StripeContainer: React.FC = (props) => {
	const [stripe, setStripe] = useState(null);

	useLayoutEffect(() => {
		if (window.Stripe) {
			setStripe(window.Stripe(config.stripePK));
		} else {
			const script = document.querySelector('#stripe-js');

			if (script) {
				script.addEventListener('load', () => {
					// Create Stripe instance once Stripe.js loads
					setStripe(window.Stripe(config.stripePK));
				});
			}
		}
	}, []);

	return (
		<div {...props}>
			<StripeProvider stripe={stripe}>
				<Elements>
					<StripeForm/>
				</Elements>
			</StripeProvider>
		</div>
	);
};

export default StripeContainer;
