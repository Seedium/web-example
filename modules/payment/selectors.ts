import { createSelector } from 'reselect';
// models
import { listCards, card } from 'models/Card';
// types
import { State } from 'modules/reducers';
import {
	IDefaultState,
	ICardDefaultState,
} from 'modules/payment/reducers';
import { Models } from 'herheadquarters';
import { IEntityState } from 'services/types';
// helpers
import { prop, denormalizeProp } from 'services/helpers';

export const PaymentState = ({ payment }: State) => payment;

/* <---- CUSTOMER -----> */
export const getStripeCustomer = createSelector<State, IDefaultState, Models.StripeCustomer.IStripeCustomer>(
	PaymentState,
	prop('customer.data'),
);

/* <---- CARD -----> */
export const CardState = createSelector<State, IDefaultState, ICardDefaultState>(
	PaymentState,
	prop('card'),
);

export const isCardLoading = createSelector<State, ICardDefaultState, boolean>(
	CardState,
	prop('isLoading'),
);

export const getEntitiesCards = createSelector<State, ICardDefaultState, IEntityState<Models.StripeCustomer.ICard>>(
	CardState,
	prop('entities'),
);

export const getNormalizedListCards = createSelector<State, ICardDefaultState, string[]>(
	CardState,
	prop('list'),
);

export const getListCards = createSelector<State, any, IEntityState<Models.StripeCustomer.ICard>, Models.StripeCustomer.ICard[]>(
	getNormalizedListCards,
	getEntitiesCards,
	denormalizeProp(listCards, card.key),
);

export const getDefaultCard = createSelector<
	State,
	Models.StripeCustomer.IStripeCustomer,
	Models.StripeCustomer.ICard[],
	Models.StripeCustomer.ICard | undefined
>(
	getStripeCustomer,
	getListCards,
	(customer, cards) => cards.find((card) => card.id === customer.defaultSource),
);

export const isCardDefault = createSelector<
	State,
	string,
	Models.StripeCustomer.ICard | undefined,
	string,
	boolean
>(
	getDefaultCard,
	(state, idCard) => idCard,
	(defaultCard, idCard) => defaultCard ? defaultCard.id === idCard : false,
);

export const getUseCardId = createSelector<State, IDefaultState, string | null>(
	PaymentState,
	prop('useCardId'),
);

export const isCardUsing = createSelector<State, string, string | null, string, boolean>(
	getUseCardId,
	(state: State, idCard) => idCard,
	(useCard, idCard) => useCard === idCard,
);
