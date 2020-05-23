import React from 'react';
import { Form, Input, Button, PageHeader, Radio } from 'antd/lib/index';
import * as Fetch from "../../util/fetch";
import { actions as loadingActions } from '../../components/loading';
import TeacherSelect from "../../components/teacherselect";
const qs = require('qs');

class App extends React.Component {
    title = '新增班级';
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                loadingActions.showLoading();
                // values.mainTeacherId = values.mainTeacher.key;
                const formData = new FormData();
                formData.append('className', values.className);
                formData.append('grade', values.grade);
                formData.append('mainTeacherId', values.mainTeacher.key);
                Fetch.post('class/addClass', formData).then((response) => {
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
                    <Form.Item label="班级名称">
                        {getFieldDecorator('className', {
                            rules: [{ required: true, message: '请输入班级名称!' }],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="年级">
                        {getFieldDecorator('grade', { initialValue: 1 })(<Radio.Group>
                                <Radio value={1}>一年级</Radio>
                                <Radio value={2}>二年级</Radio>
                            </Radio.Group>

                        )}
                    </Form.Item>
                    <Form.Item label="班主任">
                        {getFieldDecorator('mainTeacher', {
                            rules: [{ required: true, message: '请输入科目名称!' }],
                        })(
                            <TeacherSelect/>,
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

const ClassForm = Form.create({ name: 'coordinated' })(App);

export default ClassForm;
