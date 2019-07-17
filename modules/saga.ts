import { spawn } from 'redux-saga/effects';
import { ISagaServices } from 'services/store/types';

import paymentSaga from 'modules/payment/saga';

export default function * (services: ISagaServices) {
	yield spawn(paymentSaga, services);
}
