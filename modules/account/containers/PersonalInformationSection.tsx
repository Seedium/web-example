import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { initialize } from 'redux-form';
// core components
import Section from 'modules/account/components/Section';
import PersonalInformationForm from 'modules/account/containers/PersonalInformationForm';
// actions
import { updateProfile } from 'modules/user/actions';
// types
import { IPersonalInformationFormData } from 'modules/account/containers/PersonalInformationForm';
// constants
import { formName } from 'modules/account/containers/PersonalInformationForm';

const PersonalInformationSection: React.FC<DispatchProp> = ({ dispatch }) => {
	const handleSubmit = (values: IPersonalInformationFormData) => {
		dispatch(updateProfile({
			profile: values,
		}, {
			notification: 'Profile is updated',
		}));
		dispatch(initialize(formName, values));
	};

	return (
		<Section title={'Personal Information'} id={'personal'}>
			<PersonalInformationForm onSubmit={handleSubmit}/>
		</Section>
	);
};

export default connect()(PersonalInformationSection);
