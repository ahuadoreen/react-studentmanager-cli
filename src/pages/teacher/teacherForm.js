import React from 'react';
import { Form, Input, Button, PageHeader, Radio, InputNumber } from 'antd/lib/index';
import * as Fetch from "../../util/fetch";
import { actions as loadingActions } from '../../components/loading';
import SubjectSelect from "../../components/subjectselect";
const qs = require('qs');

class App extends React.Component {
    title = '新增教师';
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                loadingActions.showLoading();
                values.subjectIds = values.subjectIds.map(d => d.key);
                Fetch.post('teacher/addTeacher', qs.stringify(values, { indices: false })).then((response) => {
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
                    <Form.Item label="姓名">
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: '请输入教师姓名!' }],
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
                        {getFieldDecorator('age', { initialValue: 25 })(<InputNumber min={20} max={70} />)}
                    </Form.Item>
                    <Form.Item label="科目">
                        {getFieldDecorator('subjectIds', {
                            rules: [{ required: true, message: '请选择科目!' }],
                        })(
                            <SubjectSelect/>,
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

const TeacherForm = Form.create({ name: 'coordinated' })(App);

export default TeacherForm;