import React from "react";
import {Form, Input, InputNumber, Radio} from "antd";
import SubjectSelect from "./subjectselect";
import TeacherSelect from "./teacherselect";
import ClassSelect from "./classselect";

export const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

export const EditableFormRow = Form.create()(EditableRow);
class EditableCell extends React.Component {
    getInput = () => {
        switch (this.props.inputType) {
            case 'number':
                return <InputNumber/>;
            case 'genderradio':
                return <Radio.Group>
                    <Radio value={1}>男</Radio>
                    <Radio value={0}>女</Radio>
                </Radio.Group>;
            case 'subjectselect':
                return <SubjectSelect/>;
            case 'graderadio':
                return <Radio.Group>
                    <Radio value={1}>一年级</Radio>
                    <Radio value={2}>二年级</Radio>
                </Radio.Group>;
            case 'teacherselect':
                return <TeacherSelect/>;
            case 'classselect':
                return <ClassSelect/>;
        }
        return <Input />;
    };

    renderCell = form => {
        this.form = form;
        const {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            children,
            ...restProps
        } = this.props;
        let initialValue = '';
        if(dataIndex != undefined && record != null){
            initialValue = record[dataIndex]
            if(dataIndex === 'subjectIds' && initialValue != null){
                let subjects = []
                const ids = initialValue.split(',')
                const names = record['subjectNames'].split(',')
                for (let i = 0; i < ids.length; i ++) {
                    subjects[i] = {
                        key: ids[i],
                        label: names[i]
                    };
                }
                initialValue = subjects
            }else if((dataIndex === 'mainTeacher' || dataIndex === 'teacher') && initialValue != null){
                initialValue = {key: initialValue.id, label: initialValue.name}
            }else if(dataIndex === 'classes' && initialValue != null){
                let str = '';
                switch (initialValue.grade) {
                    case 1:
                        str = '一年级';
                        break;
                    case 2:
                        str = '二年级';
                        break;
                }
                str = str + initialValue.className;
                initialValue = {key: initialValue.id, label: str}
            }
        }
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item style={{ margin: 0 }}>
                        {form.getFieldDecorator(dataIndex, {
                            rules: [
                                {
                                    required: true,
                                    message: `请输入 ${title}!`,
                                },
                            ],
                            initialValue: initialValue,
                        })(this.getInput())}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

    render() {
        return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
    }
}
export default EditableCell;