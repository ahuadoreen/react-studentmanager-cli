import { actions as loadingActions } from '../components/loading/index';
import * as Fetch from '../util/fetch';
import * as LocalStorage from '../util/localstorage';

export const login = (formVal, props) => {
  return (dispatch) => {
    dispatch(loadingActions.showLoading());
    const formData = new FormData();
    formData.append('username', formVal.username);
    formData.append('password', formVal.password);
    Fetch.post('login', formData).then((response) => {
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
