import React, { useLayoutEffect } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { CardNumberElement, CardExpiryElement, CardCVCElement, injectStripe } from 'react-stripe-elements';
import styled from 'styled-components';
// actions
import { setStripeObject } from 'modules/payment/actions';
// services
import { compose } from 'services/helpers';

const Container = styled.div`
	display: flex;
	flex-direction: column;
`;

const Label = styled.label`
	padding-bottom: 16px;
	border-bottom: 1px solid ${({ theme }) => theme.palette.bottomBorder};
	width: 100%;
`;

const SecondRow = styled.div`
	margin: 46px 0 0 0;
	display: flex;
	width: 100%;
	justify-content: space-between;
	
	${Label} {
		width: 47%;
	}
`;

interface IStripeFormProps extends DispatchProp {
	stripe: any;
}
const StripeForm: React.FC<IStripeFormProps> = ({ dispatch, stripe }) => {
	useLayoutEffect(() => {
		dispatch(setStripeObject(stripe));
	}, [dispatch, stripe]);

	return (
		<Container>
			<Label>
				<CardNumberElement placeholder={'Card number'}/>
			</Label>
			<SecondRow>
				<Label>
					<CardExpiryElement placeholder={'Expiration'}/>
				</Label>
				<Label>
					<CardCVCElement placeholder={'CVC'}/>
				</Label>
			</SecondRow>
		</Container>
	);
};

export default compose(
	injectStripe,
	connect(),
)(StripeForm);
