import { actions as loadingActions } from '../components/loading/index';
import * as Fetch from '../util/fetch';
import * as LocalStorage from '../util/localstorage';
const qs = require('qs');

export const login = (formVal, props) => {
  return (dispatch) => {
    dispatch(loadingActions.showLoading());
    Fetch.post('login', qs.stringify(formVal)).then((response) => {
      dispatch(loadingActions.hideLoading());

      if (response) {
        console.log(response);
        LocalStorage.put('username', response.data.username);
        LocalStorage.put('token', response.data.token);
        // 没有发生异常，跳转至主页
        props.history.push('/home/overview');
      }
    });
  };
};
