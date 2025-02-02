import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import JobRequests from './pages/JobRequests';
import WorkerManagement from './pages/WorkerManagement';
import PaymentDistribution from './pages/PaymentDistribution';
import NotFound from './pages/NotFound';
import './styles/App.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Switch>
          <Route path="/" exact component={Dashboard} />
          <Route path="/job-requests" component={JobRequests} />
          <Route path="/worker-management" component={WorkerManagement} />
          <Route path="/payment-distribution" component={PaymentDistribution} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
