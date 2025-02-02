import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Auth from './components/auth/Auth';
import Dashboard from './components/dashboard/Dashboard';
import Jobs from './components/jobs/Jobs';
import Payments from './components/payments/Payments';
import Property from './components/property/Property';
import Layout from './components/layout/Layout';

const App = () => {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route path="/auth" component={Auth} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/jobs" component={Jobs} />
          <Route path="/payments" component={Payments} />
          <Route path="/property" component={Property} />
          <Route path="/" exact component={Dashboard} />
        </Switch>
      </Layout>
    </Router>
  );
};

export default App;