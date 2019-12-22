import {Redirect, Route} from "react-router-dom";
import React from 'react';
import * as LocalStorage from './util/localstorage';

function PrivateRoute({ component:Component, ...rest }) {
    let token = LocalStorage.get('token');
    return (
        <Route
            {...rest}
            render={props =>

                token ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: props.location }
                        }}
                    />
                )
            }
        />
    );
}
export default PrivateRoute;
