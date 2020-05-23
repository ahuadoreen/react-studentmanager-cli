import React from 'react';
import { Form, Input, Button, PageHeader, Radio, InputNumber } from 'antd/lib/index';
import * as Fetch from "../../util/fetch";
import { actions as loadingActions } from '../../components/loading';
import SubjectSelect from "../../components/subjectselect";
import {Upload, Icon, message} from "antd";
import {connect} from "react-redux";
import {clearListData} from "../../util/actions";
const qs = require('qs');

class App extends React.Component {
    title = '新增教师';
    file = '';
    state = {
        imageUrl: ''
    }

    componentDidMount() {
        let id = this.props.match.params.id;
        if(id != undefined){
            this.title = '编辑教师'
            this.fetchDetail(this.props.match.params)
        }
    }

    fetchDetail = (params = {}) => {
        console.log('params:', params);
        this.setState({ loading: true });
        Fetch.get('teacher/teacherDetail?' + qs.stringify(params)).then((response) => {
            console.log(response);
            const data = response.data.teacher;
            let subjects = []
            const ids = data.subjectIds.split(',')
            const names = data.subjectNames.split(',')
            for (let i = 0; i < ids.length; i ++) {
                subjects[i] = {
                    key: ids[i],
                    label: names[i]
                };
            }
            this.props.form.setFieldsValue({
                name: data.name,
                gender: data.gender.toString(),
                age: data.age,
                subjectIds: subjects
            });
            if (data.imageUrl != null) {
                this.setState({imageUrl: data.imageUrl});
            }
        });
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                loadingActions.showLoading();
                values.subjectIds = values.subjectIds.map(d => d.key);
                const formData = new FormData();
                formData.append('name', values.name);
                formData.append('gender', values.gender);
                formData.append('subjectIds', values.subjectIds);
                formData.append('age', values.age);
                if (this.file != '') {
                    formData.append('file', this.file);
                }
                let id = this.props.match.params.id;
                if(id != undefined){
                    formData.append('id', id);
                    Fetch.post('teacher/editTeacher', formData).then((response) => {
                        loadingActions.hideLoading();
                        if (response) {
                            console.log(response);
                            clearListData({
                                listData: [],
                                pagination: this.props.listState.pagination
                            })()
                            window.history.back();
                        }
                    });
                }else{
                    Fetch.post('teacher/addTeacher', formData).then((response) => {
                        loadingActions.hideLoading();
                        if (response) {
                            console.log(response);
                            window.history.back();
                        }
                    });
                }
            }
        });
    };

    beforeUpload = file => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        this.setState({imageUrl: window.URL.createObjectURL(file)});
        this.file = file;
        return isJpgOrPng && isLt2M;
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const {imageUrl} = this.state;
        const uploadButton = (
            <div>
                <Icon type={'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
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
                    <Form.Item label="头像">
                        {getFieldDecorator('file')(
                            <Upload
                                listType="picture-card"
                                showUploadList={false}
                                beforeUpload={this.beforeUpload}
                            >
                                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                            </Upload>
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
let mapStateToProps = (state) => ({
    listState: {...state.listState}
})

let mapDispatchToProps = (dispatch) => ({})
export default connect(mapStateToProps, mapDispatchToProps)(TeacherForm);
