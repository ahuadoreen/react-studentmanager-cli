import React from "react";
import { Route } from 'react-router-dom';
import { view as Loading } from './components/loading';
import { view as Login } from './login';
import PrivateRoute from "./PrivateRoute";
import HomePage from "./pages/home";

const App = () => {
    return (
        <>
            <Loading />
            <PrivateRoute path="/" component={HomePage} exact />
            <Route path="/login" component={Login} />
            <Route path="/home" component={HomePage} />
        </>
    );
};

export default App;