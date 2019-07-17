import React, { useLayoutEffect } from 'react';
import { connect, DispatchProp } from 'react-redux';
import styled from 'styled-components';
import { TransitionGroup } from 'react-transition-group';
// account components
import Section, { SectionContent } from 'modules/account/components/Section';
import Card from 'modules/account/containers/Card';
import AddPaymentMethodModal from 'modules/account/containers/Modals/AddPaymentMethodModal';
// actions
import { getCards } from 'modules/payment/actions';
// selectors
import { getListCards, isCardLoading } from 'modules/payment/selectors';
// types
import { State } from 'modules/reducers';
import { Models } from 'herheadquarters';

const CardsContainer = styled(SectionContent)`
	display: flex;
	flex-wrap: wrap;
	padding: 30px 0 0;
`;

interface IPaymentSectionProps extends DispatchProp {
	cards: Models.StripeCustomer.ICard[];
	isLoading: boolean;
}
const PaymentSection: React.FC<IPaymentSectionProps> =
({
	dispatch,
	cards,
}) => {
	useLayoutEffect(() => {
		dispatch(getCards());
	}, [dispatch]);

	return (
		<Section title={'Payment Information'} id={'payment'}>
			<CardsContainer>
				<TransitionGroup component={null}>
					{
						cards.map((card) => <Card key={card.id} {...card}/>)
					}
				</TransitionGroup>
				<Card empty={true}/>
			</CardsContainer>
			<AddPaymentMethodModal/>
		</Section>
	);
};

export default connect((state: State) => ({
	isLoading: isCardLoading(state),
	cards: getListCards(state),
}))(PaymentSection);
