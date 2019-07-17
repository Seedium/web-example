import { createAction } from 'redux-actions';
// types
import { Api } from 'herheadquarters';
import { IDefaultApiMeta } from 'services/types';

export const getCards = createAction('GET_CARDS');
export const getCardsSuccess = createAction<Api.Payment.IGetCardsResponse>('GET_CARDS_SUCCESS');
export const getCardsFail = createAction('GET_CARDS_FAIL');

export const addCard = createAction<unknown, IDefaultApiMeta>(
	'ADD_CARD',
	() => {},
	(payload?, meta?: IDefaultApiMeta) => meta ? meta : {},
);
export const addCardSuccess = createAction<Api.Payment.IAddCardResponse>('ADD_CARD_SUCCESS');
export const addCardFail = createAction('ADD_CARD_FAIL');

export const detachCard = createAction<Api.Payment.ISetDefaultParams, IDefaultApiMeta>(
	'DETACH_CARD',
	(payload) => payload,
	(payload, meta: IDefaultApiMeta) => ({
		notification: meta.notification || false,
	}),
);
export const detachCardSuccess = createAction<Api.Payment.ISetDefaultParams>('DETACH_CARD_SUCCESS');
export const detachCardFail = createAction('DETACH_CARD_FAIL');

export const setDefaultCard = createAction<Api.Payment.ISetDefaultParams, IDefaultApiMeta>(
	'SET_DEFAULT_CARD',
	(payload) => payload,
	(payload, meta: IDefaultApiMeta) => ({
		notification: meta.notification || false,
	}),
);
export const setDefaultCardSuccess = createAction<Api.Payment.ISetDefaultParams>('SET_DEFAULT_CARD_SUCCESS');
export const setDefaultCardFail = createAction('SET_DEFAULT_CARD_FAIL');

export const setUseCard = createAction<string | undefined>('SET_USE_CARD');
export const clearUseCard = createAction('CLEAR_CARD');

// MODALS
export const toggleAddPaymentModal = createAction('TOGGLE_ADD_PAYMENT_MODAL');

// OTHER
export const setStripeObject = createAction('SET_STRIPE_OBJECT');
