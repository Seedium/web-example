import React from 'react';
import styled from 'styled-components';
// core components
import Grid from 'modules/core/components/Grid';
// account containers
import LeftNavigationMenu from 'modules/account/containers/LeftNavigationMenu';
// account sections
import PersonalInformationSection from 'modules/account/containers/PersonalInformationSection';
import PasswordSection from 'modules/account/containers/PasswordSection';
import AccountLevelSection from 'modules/account/containers/AccountLevelSection';
import CreditsSection from 'modules/account/containers/CreditsSection';
import PaymentSection from 'modules/account/containers/PaymentSection';
import PrivacySection from 'modules/account/containers/PrivacySection';
import AvatarModal from 'modules/account/containers/Modals/AvatarModal';

const Wrapper = styled.div`
	background-color: #fbfbfb;
`;

const InsideWrapper = styled.div`
	max-width: 1110px;
	margin: 0 auto;
	padding: 27px 0 70px;
	
	${({theme}) => theme.media.sm`
		padding-bottom: 60px;
	`}
`;

const Title = styled.h1`
	font-size: 2.8rem;
	line-height: 4.4rem;
	text-align: left;
	
	${({ theme }) => theme.media.md`
		text-align: center;
	`}
	
	${({ theme }) => theme.media.sm`
		font-size: 2.4rem;
		line-height: 3.2rem;
		margin-bottom: 33px;
	`}
`;

const Container = styled(Grid)`
	margin-top: 32px;
`;

const SectionsContainer = styled(Grid)`
	flex-direction: column;
	max-width: 825px;
`;

const AppHome: React.FC = () => (
	<Wrapper>
		<InsideWrapper>
			<Title>manage your account</Title>
			<Container>
				<LeftNavigationMenu/>
				<SectionsContainer>
					<PersonalInformationSection/>
					<PasswordSection/>
					<AccountLevelSection/>
					<CreditsSection/>
					<PaymentSection/>
					<PrivacySection/>
				</SectionsContainer>
			</Container>
			<AvatarModal/>
		</InsideWrapper>
	</Wrapper>
);

export default AppHome;
