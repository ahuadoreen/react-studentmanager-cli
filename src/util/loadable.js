import React from 'react';
import Loadable from 'react-loadable';
import Loader from '../components/loader/view';

export default (loader,loading = Loader)=>{
    return Loadable({
        loader,
        loading
    });
}