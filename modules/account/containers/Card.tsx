import React, { useCallback, useMemo } from 'react';
import { connect, DispatchProp } from 'react-redux';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';
// core components
import Grid from 'modules/core/components/Grid';
import Icon from 'modules/core/components/Icon';
// actions
import { toggleAddPaymentModal, detachCard, setDefaultCard } from 'modules/payment/actions';
// selectors
import { isCardDefault } from 'modules/payment/selectors';
// helpers
import { compose } from 'services/helpers';
// types
import { Models } from 'herheadquarters';
import { State } from 'modules/reducers';

const transitionName = 'payment-card';

interface IContainerProps {
	empty?: boolean;
}
const Container = styled(Grid)<IContainerProps>`
	height: 82px;
	border: ${({ empty, theme }) => empty ? `1px dashed ${theme.palette.primary.second}` : '1px solid #ebebeb'};
	flex-grow: 0;
	flex-basis: 46%;
	margin: 0 15px 30px;
	padding: ${({ empty }) => empty ? '0' : '10px 0 10px 30px'};
	align-items: center;
	border-radius: 6px;
	position: relative;
	cursor: ${({ empty }) => empty ? 'pointer' : 'auto'};
	justify-content: ${({ empty }) => empty ? 'center' : 'flex-start'};
	transition: .5s;
	
	${({ theme }) => theme.media.md`
		flex-basis: 100%;
		margin: 0 10px 20px;
		padding: 10px;
	`}
	
	&.${transitionName}-enter {
	  opacity: 0;
	}
	
	&.${transitionName}-enter-active {
	  opacity: 1;
	}
	
	&.${transitionName}-exit {
	  opacity: 1;
	}
	
	&.${transitionName}-exit-active {
	  opacity: 0;
	}
`;

const BrandIcon = styled(Icon)`
	width: 65px;
	padding-top: 8px;
`;

const InfoContainer = styled.div`
	color: ${({ theme }) => theme.palette.default};
	margin: 0 auto;
	height: 29px;
	
	${({ theme }) => theme.media.md`
		height: 29px;
		margin: 0 10px;
	`};
`;

const ExpirationDate = styled.span`
	font-size: 1.2rem;
	
	${({ theme }) => theme.media.md`
		font-size: 1.1rem;
	`};
`;

const LastNumbers = styled.div`
	line-height: 1.3rem;
	
	span {
		color: #d7d7d7;
	}
	
	${({ theme }) => theme.media.md`
		font-size: 1.5rem;
	`};
`;

const Line = styled.span`
	height: 100%;
	background-color: #ebebeb;
	width: 1px;
`;

const RemoveButton = styled.div`
	cursor: pointer;
	display: flex;
	height: 100%;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	width: 97px;
	padding-top: 5px;
	
	${({ theme }) => theme.media.md`
		width: 70px;
		margin: 0 auto;
	`}
`;

const RemoveIcon = styled(Icon).attrs({
	name: 'icon-close',
})`
	width: 20px;
	height: 20px;
	fill: #e6e6e6;
`;

const RemoveText = styled.span`
	color: #e89494;
	font-size: 1.2rem;
`;

const TopLeftCheckboxContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	max-height: 22px;
	background-color: ${({ theme }) => theme.palette.primary.shape};
	font-size: 1.2rem;
	color: ${({ theme }) => theme.palette.default};
	border-top-left-radius: 6px;
	border-bottom-right-radius: 6px;
`;

const CheckboxLabel = styled.span<{ isDefault: boolean }>`
	display: inline-block;
	width: 100%;
	cursor: ${({ isDefault }) => isDefault ? 'auto' : 'pointer'};
	padding: 0 10px 0 0;
	
	::before {
		content: "";
		display: inline-block;
		margin: 0 6px 0 0;
		border: solid 1px #60deea;
		border-top-left-radius: 6px;
		border-bottom-right-radius: 6px;
		width: 20px;
		height: 20px;
		vertical-align: top;
		transition: border-color 0.2s, background-color 0.2s;
		background-color: #fff;
	}
	
	::after {
		content: "";
		display: block;
		position: absolute;
		top: -3px;
		left: 1px;
		width: 12px;
		height: 6px;
		border: solid 2px transparent;
		border-right: none;
		border-top: none;
		transform: translate(3px, 4px) rotate(-45deg);
	}
`;

const CheckboxInput = styled.input.attrs({
	type: 'checkbox',
})`
	appearance: none;
	z-index: -1;
	position: absolute;
	display: block;
	margin: 0;
	box-shadow: none;
	outline: none;
	opacity: 0;
	transform: scale(1);
	pointer-events: none;
	transition: opacity 0.3s, transform 0.2s;
		
	:checked + ${CheckboxLabel}::before,
	:indeterminate + ${CheckboxLabel}::before {
		border-color: #60deea;
		background-color: #60deea;
	}
	
	:checked + ${CheckboxLabel}::after,
	:indeterminate + ${CheckboxLabel}::after {
		border-color: #fff;
		background-color: #60deea;
	}
	
	:indeterminate + ${CheckboxLabel}::after {
		border-left: none;
		transform: translate(4px, 3px);
	}
	
	/* Active */
	:focus {
		opacity: 0.12;
	}
	
	:active {
		opacity: 1;
		transform: scale(0);
		transition: transform 0s, opacity 0s;
	}
	
	:checked:active + ${CheckboxLabel}::before {
		border-color: transparent;
		background-color: #60deea;
	}
`;

const CheckboxContainer = styled.label`
	z-index: 0;
    position: relative;	
`;

const EmptyText = styled.span`
	color: ${({ theme }) => theme.palette.primary.second};
`;

const AddPaymentIcon = styled(Icon).attrs({
	name: 'credit-card-add',
})`
	width: 50px;
	height: 50px;
	fill: #e6e6e6;
`;

interface ICardProps extends Models.StripeCustomer.ICard, IContainerProps, DispatchProp {
	isDefault: boolean;
}
const Card: React.FC<ICardProps> =
({
	id,
	empty,
	brand,
	last4,
	exp_month,
	exp_year,
	dispatch,
	isDefault,
	...props
}) => {
	const onRemoveClick = useCallback(() => {
		dispatch(detachCard({
			idCard: id,
		}, {
			notification: `A card payment method ending in "${last4}" was detached`,
		}));
	}, [id, dispatch, last4]);

	const onChangeDefaultCard = useCallback(() => {
		dispatch(setDefaultCard({
			idCard: id,
		}, {
			notification: `Updated default payment method to "${brand}" ending in "${last4}"`
		}));
	}, [dispatch, id, brand, last4]);

	const brandName = useMemo(() => brand ? brand.replace(/\s+/g, '-').toLocaleLowerCase() : 'visa', [brand]);

	return (
		<CSSTransition
			timeout={500}
			classNames={transitionName}
			in={true}
			mountOnEnter={true}
			unmountOnExit={true}
			{...props}
		>
			<Container empty={empty} onClick={empty ? () => dispatch(toggleAddPaymentModal()) : () => {}}>
				{
					empty ? (
						<React.Fragment>
							<AddPaymentIcon/>
							<EmptyText>
								Add Payment Method
							</EmptyText>
						</React.Fragment>
					) : (
						<React.Fragment>
							<TopLeftCheckboxContainer>
								<CheckboxContainer>
									<CheckboxInput checked={isDefault} onChange={isDefault ? () => {} : onChangeDefaultCard}/>
									<CheckboxLabel isDefault={isDefault}>{isDefault ? 'Default card' : 'Select as default card'}</CheckboxLabel>
								</CheckboxContainer>
							</TopLeftCheckboxContainer>
							<BrandIcon name={brandName}/>
							<InfoContainer>
								<LastNumbers><span>...</span>{last4}</LastNumbers>
								<ExpirationDate>Expiration date {exp_month}/{exp_year}</ExpirationDate>
							</InfoContainer>
							<Line/>
							<RemoveButton onClick={onRemoveClick}>
								<RemoveIcon/>
								<RemoveText>Remove</RemoveText>
							</RemoveButton>
						</React.Fragment>
					)
				}
			</Container>
		</CSSTransition>
	);
};

export default compose(
	connect((state: State, { id }: ICardProps) => ({
		isDefault: isCardDefault(state, id as string),
	})),
)(Card);
