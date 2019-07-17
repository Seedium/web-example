import React from 'react';
import { Provider } from 'react-redux';
import { Router, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import 'normalize.css';
// core components
import store from 'services/store';
import getHistory from 'services/history';
import { theme } from 'modules/styles';
// layouts
import GlobalWrapper from 'modules/core/containers/GlobalWrapper';
import LandingLayout from 'pages/Landing/Layout';
import AppLayout from 'pages/App/Layout';

const history = getHistory();

const App: React.FC = () => (
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <Router history={history}>
                <GlobalWrapper>
                    <Switch>
                        <Route path={'/app/'} component={AppLayout}/>
                        <Route path={'/'} component={LandingLayout}/>
                    </Switch>
                </GlobalWrapper>
            </Router>
        </ThemeProvider>
    </Provider>
);

export default App;
