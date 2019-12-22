import React from 'react';
import { Form, Input, Button, PageHeader } from 'antd/lib/index';
import * as Fetch from "../../util/fetch";
import { actions as loadingActions } from '../../components/loading';
const qs = require('qs');

class App extends React.Component {
	title = '新增科目';
	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
				loadingActions.showLoading();
				Fetch.post('subject/addSubject', qs.stringify({name: values.name})).then((response) => {
					loadingActions.hideLoading();
					if (response) {
						console.log(response);
						window.history.back();
					}
				});
			}
		});
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<div>
				<PageHeader
					onBack={() => window.history.back()}
					title={this.title}
				/>
				<Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} onSubmit={this.handleSubmit}>
					<Form.Item label="科目名称">
						{getFieldDecorator('name', {
							rules: [{ required: true, message: '请输入科目名称!' }],
						})(<Input />)}
					</Form.Item>
					<Form.Item wrapperCol={{ span: 12, offset: 5 }}>
						<Button type="primary" htmlType="submit">
							提交
						</Button>
					</Form.Item>
				</Form>
			</div>
		);
	}
}

const SubjectForm = Form.create({ name: 'coordinated' })(App);

export default SubjectForm;