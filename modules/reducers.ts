import { combineReducers } from 'redux';
// reducers
import paymentReducer, { IDefaultState as IPaymentState } from 'modules/payment/reducers';

export interface State {
	readonly payment: IPaymentState;
}

export default combineReducers({
	payment: paymentReducer,
});
