import React from 'react';
import { Form, Input, Button, PageHeader, Radio, InputNumber } from 'antd/lib/index';
import * as Fetch from "../../util/fetch";
import { actions as loadingActions } from '../../components/loading';
import ClassSelect from "../../components/classselect";
const qs = require('qs');

class App extends React.Component {
    title = '新增学生';
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                loadingActions.showLoading();
                // values.classId = values.classId.key;
                const formData = new FormData();
                formData.append('sno', values.sno);
                formData.append('name', values.name);
                formData.append('gender', values.gender);
                formData.append('age', values.age);
                formData.append('classId', values.classId.key);
                Fetch.post('student/addStudent', formData).then((response) => {
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
                    <Form.Item label="学号">
                        {getFieldDecorator('sno', {
                            rules: [{ required: true, message: '请输入学号!' }],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="姓名">
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: '请输入学生姓名!' }],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="性别">
                        {getFieldDecorator('gender', { initialValue: "1" })(<Radio.Group>
                                <Radio value="1">男</Radio>
                                <Radio value="0">女</Radio>
                            </Radio.Group>

                        )}
                    </Form.Item>
                    <Form.Item label="年龄">
                        {getFieldDecorator('age', { initialValue: 15 })(<InputNumber min={10} max={20} />)}
                    </Form.Item>
                    <Form.Item label="班级">
                        {getFieldDecorator('classId', {
                            rules: [{ required: true, message: '请选择班级!' }],
                        })(
                            <ClassSelect/>,
                        )}
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

const StudentForm = Form.create({ name: 'coordinated' })(App);

export default StudentForm;
