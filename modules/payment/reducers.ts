import { combineReducers } from 'redux';
import { Action, handleAction, handleActions } from 'redux-actions';
import { normalize } from 'normalizr';
// actions
import {
	logOutSuccess,
} from 'modules/auth/actions';
import {
	getCards,
	getCardsSuccess,
	getCardsFail,
	setStripeObject,
	setUseCard,
	clearUseCard,
	changePlanSuccess,
	buyCreditSuccess,
	addCard,
	addCardSuccess,
	addCardFail,
	detachCard,
	detachCardSuccess,
	detachCardFail,
	setDefaultCard,
	setDefaultCardSuccess,
	setDefaultCardFail,
} from 'modules/payment/actions';
// models
import { listCards, card as cardSchema } from 'models/Card';
// types
import { Api, Models } from 'herheadquarters';
import { IEntityState } from 'services/types';

/* <---- CARD -----> */
export interface ICardDefaultState {
	entities: IEntityState<Models.StripeCustomer.IInvoice>;
	list: string[];
	isLoading: boolean;
}
const cardDefaultState: ICardDefaultState = {
	entities: {},
	list: [],
	isLoading: false,
};
const cardReducers = handleActions<ICardDefaultState, any>(
	{
		[`${logOutSuccess}`]: () => cardDefaultState,
		[`${getCards}`]: (state) => ({
			...state,
			isLoading: true,
		}),
		[`${getCardsSuccess}`]: (state, { payload: { list } }: Action<Api.Payment.IGetCardsResponse>) => {
			const { entities: { cards }, result } = normalize(list, listCards);

			return {
				...state,
				entities: cards,
				list: result,
				isLoading: false,
			};
		},
		[`${getCardsFail}`]: (state) => ({
			...state,
			isLoading: false,
		}),
		[`${changePlanSuccess}`]: (state: ICardDefaultState, { payload: { card }}: Action<Api.Payment.IChangePlanResponse>) => {
			const { entities: { cards }, result } = normalize(card, cardSchema);

			return {
				...state,
				entities: {
					...state.entities,
					...cards,
				},
				list: [...new Set([...state.list, result])],
			};
		},
		[`${buyCreditSuccess}`]: (state: ICardDefaultState, { payload: { card } }: Action<Api.Payment.IBuyCreditResponse>) => {
			const { entities: { cards }, result } = normalize(card, cardSchema);

			return {
				...state,
				entities: {
					...state.entities,
					...cards,
				},
				list: [...new Set([...state.list, result])],
			};
		},
		[`${addCard}`]: (state: ICardDefaultState) => ({
			...state,
			isLoading: true,
		}),
		[`${addCardSuccess}`]: (state: ICardDefaultState, { payload: { card } }: Action<Api.Payment.IAddCardResponse>) => {
			const { entities: { cards }, result } = normalize(card, cardSchema);

			return {
				...state,
				isLoading: false,
				entities: {
					...state.entities,
					...cards,
				},
				list: [...new Set([...state.list, result])],
			};
		},
		[`${addCardFail}`]: (state: ICardDefaultState) => ({
			...state,
			isLoading: false,
		}),
		[`${detachCard}`]: (state: ICardDefaultState) => ({
			...state,
			isLoading: true,
		}),
		[`${detachCardSuccess}`]: (state: ICardDefaultState, { payload: { idCard } }: Action<Api.Payment.ISetDefaultParams>) => ({
			...state,
			list: state.list.filter((card) => card !== idCard),
			isLoading: false,
		}),
		[`${detachCardFail}`]: (state: ICardDefaultState) => ({
			...state,
			isLoading: false,
		}),
		[`${setDefaultCard}`]: (state: ICardDefaultState) => ({
			...state,
			isLoading: true,
		}),
		[`${setDefaultCardSuccess}`]: (state: ICardDefaultState) => ({
			...state,
			isLoading: false,
		}),
		[`${setDefaultCardFail}`]: (state: ICardDefaultState) => ({
			...state,
			isLoading: false,
		}),
	},
	cardDefaultState,
);

const stripeDefaultState: any = null;
const stripeReducers = handleAction(`${setStripeObject}`, (state, { payload: stripe }) => stripe, stripeDefaultState);

const useCardDefaultState: string | null = null;
const useCardReducers = handleActions<typeof useCardDefaultState, any>(
	{
		[`${logOutSuccess}`]: () => useCardDefaultState,
		[`${setUseCard}`]: (state, { payload }) => payload,
		[`${clearUseCard}`]: () => null,
	},
	useCardDefaultState,
);

export interface IDefaultState {
	readonly card: ICardDefaultState;
	readonly stripe: any;
	readonly useCardId: string | null;
}

export default combineReducers({
	card: cardReducers,
	stripe: stripeReducers,
	useCardId: useCardReducers,
});
