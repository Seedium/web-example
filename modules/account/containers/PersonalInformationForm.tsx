import React, { useState, useEffect } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { reduxForm, Field, FormErrors, InjectedFormProps, formValueSelector } from 'redux-form';
// core components
import { FormGrid } from 'modules/core/components/Grid';
import Input from 'modules/core/containers/Input';
import Select from 'modules/core/containers/Select';
// account components
import DefaultButton from 'modules/account/components/DefaultButton';
// selectors
import { isProfileLoading, getProfile } from 'modules/user/selectors';
// services
import { compose, isPhoneNumber } from 'services/helpers';
// types
import { State } from 'modules/reducers';
// constants
import { location, industry as initialIndustryList } from 'modules/core/enums';

const locationWithoutOther = location.filter((city) => city.value !== 'other');

export const formName = 'updateProfile';
const selector = formValueSelector(formName);

export interface IPersonalInformationFormData {
	firstName: string;
	lastName: string;
	city: string;
	industry: string;
	email: string;
	phone: string;
}

interface IPersonalInformationFormProps extends DispatchProp {
	isLoading: boolean;
	city: string;
}

const PersonalInformationForm: React.FC<InjectedFormProps<IPersonalInformationFormData> & IPersonalInformationFormProps> =
({
	handleSubmit,
	valid,
	isLoading,
	dirty,
	city,
}) => {
	const [industry, setIndustry] = useState(initialIndustryList);

	useEffect(() => {
		setIndustry(city === 'Omaha' ? [...initialIndustryList, {
			value: 'Tech',
			label: 'Tech',
		}] : initialIndustryList);
	}, [city]);

	return (
		<form onSubmit={handleSubmit}>
			<FormGrid>
				<Field
					name={'firstName'}
					component={Input}
					label={'First Name'}
				/>
				<Field
					name={'lastName'}
					component={Input}
					label={'Last Name'}
				/>
			</FormGrid>
			<FormGrid>
				<Field
					name={'email'}
					component={Input}
					label={'Email'}
					disabled={true}
				/>
				<Field
					name={'phone'}
					component={Input}
					label={'Phone'}
					autoComplete={'username'}
				/>
			</FormGrid>
			<FormGrid>
				<Field
					name={'city'}
					component={Select}
					label={'Location'}
					options={locationWithoutOther}
				/>
				<Field
					name={'industry'}
					component={Select}
					label={'Industry'}
					options={industry}
				/>
			</FormGrid>
			<DefaultButton
				valid={valid && dirty}
				isLoading={isLoading}
			>
				Save
			</DefaultButton>
		</form>
	);
};

const validate = (values: IPersonalInformationFormData) => {
	const errors: FormErrors<IPersonalInformationFormData> = {};

	if (!values.firstName) {
		errors.firstName = 'Required';
	}

	if (!values.lastName) {
		errors.lastName = 'Required';
	}

	if (!values.city) {
		errors.city = 'Required';
	}

	if (!values.industry) {
		errors.industry = 'Required';
	}

	if (!values.phone) {
		errors.phone = 'Required';
	} else if (values.phone && !isPhoneNumber(values.phone)) {
		errors.phone = 'Phone is invalid';
	}

	return errors;
};

export default compose(
	connect((state: State) => {
		const { firstName, lastName, city, industry, email, phone } = getProfile(state);

		return {
			isLoading: isProfileLoading(state),
			initialValues: {
				firstName,
				lastName,
				city,
				industry,
				email,
				phone,
			},
			city: selector(state, 'city'),
		};
	}),
	reduxForm({
		form: formName,
		validate,
	}),
)(PersonalInformationForm);
