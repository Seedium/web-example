import { takeLatest, call, put, select, all } from 'redux-saga/effects';
import { Action, ActionMeta } from 'redux-actions';
// actions
import {
	getCards,
	getCardsSuccess,
	getCardsFail,
	changePlan,
	changePlanSuccess,
	changePlanFail,
	toggleUpgradeAccountModal,
	toggleUpgradeAccountModalSuccess,
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
import {
	showToast,
} from 'modules/core/actions';
// selectors
import { getMyFullName } from 'modules/user/selectors';
import { getUseCardId, getStripeObject } from 'modules/payment/selectors';
// helpers
import { isString } from 'services/helpers';
// types
import { ISagaServices } from 'services/store/types';
import { Api } from 'herheadquarters';
import { IDefaultApiMeta } from 'services/types';

function * onGetCards({ api }: ISagaServices, { payload }: Action<Api.Payment.IGetCardsResponse>) {
	try {
		const result = yield call(api.payment.getCards);

		yield put(getCardsSuccess(result.data));
	} catch (e) {
		yield put(getCardsFail(e));
	}
}

function * onChangePlan({ api }: ISagaServices, { payload }: Action<Api.Payment.IChangePlanBody>) {
	try {
		let idCard = yield select(getUseCardId);

		if (idCard === 'another') {
			const [stripe, name] = yield all([
				select(getStripeObject),
				select(getMyFullName),
			]);

			const { token } = yield call(stripe.createToken, { name });

			idCard = token.id;
		}

		payload = {
			...payload,
			idCard,
		};

		const result = yield call(api.payment.changePlan, payload);

		yield all([
			put(changePlanSuccess(result.data)),
			put(toggleUpgradeAccountModal()),
			put(toggleUpgradeAccountModalSuccess()),
		]);
	} catch (e) {
		if (e.name === 'NoPayment') {
			yield all([
				put(showToast('Please, Provide payment method', {
					type: 'danger',
				})),
				put(changePlanFail()),
			]);
		} else {
			yield put(changePlanFail(e));
		}
	}
}

function * onAddCard({ api }: ISagaServices, { meta: { onSuccess } }: ActionMeta<{}, IDefaultApiMeta>) {
	try {
		const [stripe, name] = yield all([
			select(getStripeObject),
			select(getMyFullName),
		]);

		const { token } = yield call(stripe.createToken, { name });

		const idCard = token.id;

		const result = yield call(api.payment.addCard, {
			idCard,
		});

		yield all([
			put(addCardSuccess(result.data)),
		]);

		if (onSuccess) {
			onSuccess();
		}
	} catch (e) {
		if (e.name === 'NoPayment') {
			yield all([
				put(showToast('Please, Provide payment method', {
					type: 'danger',
				})),
				put(addCardFail()),
			]);
		} else {
			yield put(addCardFail(e));
		}
	}
}

function * onDetachCard({ api }: ISagaServices, { payload, meta: { notification } }: ActionMeta<Api.Payment.ISetDefaultParams, IDefaultApiMeta>) {
	try {
		yield call(api.payment.detachCard, payload);
		yield put(detachCardSuccess(payload));

		if (notification) {
			yield put(showToast(isString(notification) ? notification : 'Payment method is detached', {
				type: 'success',
			}));
		}
	} catch (e) {
		yield put(detachCardFail(e));
	}
}

function * onSetDefaultCard({ api }: ISagaServices, { payload, meta: { notification } }: ActionMeta<Api.Payment.ISetDefaultParams, IDefaultApiMeta>) {
	try {
		yield call(api.payment.setDefaultCard, payload);
		yield put(setDefaultCardSuccess(payload));

		if (notification) {
			yield put(showToast(isString(notification) ? notification : 'Updated default payment method', {
				type: 'success',
			}));
		}
	} catch (e) {
		yield put(setDefaultCardFail(e));
	}
}

export default function * (services: ISagaServices) {
	yield takeLatest(getCards, onGetCards, services);
	yield takeLatest(changePlan, onChangePlan, services);
	yield takeLatest(addCard, onAddCard, services);
	yield takeLatest(detachCard, onDetachCard, services);
	yield takeLatest(setDefaultCard, onSetDefaultCard, services);
}
