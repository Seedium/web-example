import React, { useCallback } from 'react';
import { connect, DispatchProp } from 'react-redux';
import styled from 'styled-components';
// core components
import Modal from 'modules/core/components/Modal';
import ModalActions from 'modules/core/components/ModalActions';
import ModalHeader from 'modules/core/components/ModalHeader';
import ModalContent from 'modules/core/components/ModalContent';
import ButtonBase from 'modules/core/components/Button';
import Spinner from 'modules/core/components/Spinner';
import IconBase from 'modules/core/components/Icon';
// payment containers
import StripeContainer from 'modules/payment/containers/StripeContainer';
// actions
import { toggleAddPaymentModal, addCard } from 'modules/payment/actions';
// selectors
import { getModalsStates, isCardLoading } from 'modules/payment/selectors';
// services
import { compose } from 'services/helpers';
// types
import { State } from 'modules/reducers';

const Button = styled(ButtonBase)`
	width: 300px!important;
`;

const Icon = styled(IconBase)`
	fill: ${({ theme }) => theme.palette.primary.main};
`;

interface IAddPaymentMethodModalProps extends DispatchProp {
	isOpen: boolean;
	isLoading: boolean;
}
const AddPaymentMethodModal: React.FC<IAddPaymentMethodModalProps> =
({
	isOpen,
	dispatch,
	isLoading,
}) => {
	const onClickAddPaymentMethod = useCallback(() => {
		dispatch(addCard(null, {
			onSuccess: () => dispatch(toggleAddPaymentModal()),
		}));
	}, [dispatch]);

	return (
		<Modal
			open={isOpen}
			onClose={() => dispatch(toggleAddPaymentModal())}
			width={'540px'}
		>
			<ModalHeader>
				<Icon name={'credit-card'}/>
				<p>Add Payment Method</p>
			</ModalHeader>
			<ModalContent>
				<StripeContainer/>
			</ModalContent>
			<ModalActions>
				<Button disabled={isLoading} onClick={onClickAddPaymentMethod}>
					<Spinner isLoading={isLoading}>Add Payment Method</Spinner>
				</Button>
			</ModalActions>
		</Modal>
	);
};

export default compose(
	connect((state: State) => ({
		isOpen: getModalsStates(state).addPaymentModal,
		isLoading: isCardLoading(state),
	})),
)(AddPaymentMethodModal);
