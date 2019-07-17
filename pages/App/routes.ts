import { Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';
// core components
import HelmetRoute, { IRoute } from 'modules/core/components/HelmetRoute';
import DevRoute from 'modules/auth/components/DevRoute';
import RestrictedRoute from 'modules/auth/containers/RestrictedRoute';
import { SpinnerComponent, RestrictedRouteSpinner } from 'modules/core/components/Spinner';

const routes: IRoute[] = [
	{
		Component: RestrictedRoute,
		props: {
			path: '/app/account',
			component: Loadable({
				loader: () => import('./AppHome'),
				loading: RestrictedRouteSpinner,
			}),
			exact: true,
			title: 'Account Management',
		},
	},
	{
		Component: DevRoute,
		props: {
			path: '/app/components',
			component: Loadable({
				loader: () => import('../Components'),
				loading: SpinnerComponent,
			}),
			exact: true,
		}
	},
	{
		Component: Redirect,
		props: {
			from: '/app',
			to: '/app/account',
			exact: true,
		},
	},
	{
		Component: HelmetRoute,
		props: {
			component: Loadable({
				loader: () => import('../404'),
				loading: SpinnerComponent,
			}),
			title: '404',
		},
	},
];

export const accountLinks = [
	{
		title: 'Personal Information',
		id: '#personal',
		icon: 'avatar',
	},
	{
		title: 'Password',
		id: '#password',
		icon: 'key',
	},
	{
		title: 'Account Level',
		id: '#account-level',
		icon: 'bar-chart',
	},
	{
		title: 'Collaborations Credits',
		id: '#credits',
		icon: 'euro',
	},
	{
		title: 'Payment Information',
		id: '#payment',
		icon: 'credit-card-menu',
	},
	{
		title: 'Email Settings',
		id: '#privacy',
		icon: 'email',
	},
];

export default routes;
