import React from 'react';
import {Table, Popconfirm, Divider, Input, Button, Icon, PageHeader} from 'antd';
import * as Fetch from "../../util/fetch";
import EditableCell, {EditableContext, EditableFormRow} from "../../components/editablecell";
const qs = require('qs');

class CourseTeacher extends React.Component {
    title = '课程及任课老师';
    state = {
        data: [],
        loading: false,
        editingKey: ''
    };
    constructor(props)
    {
        super(props);
        this.columns = [
            {
                title: '#',
                dataIndex: 'id',
                render: (text, record, index) => `${index + 1}`,
                width: '5%'
            },
            {
                title: '科目',
                dataIndex: 'subject',
                render: (text, record) => record.course.subject==null? '' : record.course.subject.name
            },
            {
                title: '老师',
                dataIndex: 'teacher',
                render: (text, record) => record.teacher==null? '' : record.teacher.name,
                key: 'name',
                sorter: true,
                width: '40%',
                editable: true
            },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record, index) => {
                    const {editingKey} = this.state;
                    const editable = this.isEditing(index);
                    return editable ? (
                        <span>
                <EditableContext.Consumer>
                {form => (
                    <Popconfirm title="确定要保存吗?" okText="确定" cancelText="取消" onConfirm={() => this.save(form, index)}>
                        <a>保存</a>
                    </Popconfirm>)}
              </EditableContext.Consumer>
                <Divider type="vertical"/>
              <a onClick={() => this.cancel(index)}>取消</a>
            </span>
                    ) : (
                        <a disabled={editingKey !== ''} onClick={() => this.edit(index)}>
          编辑
        </a>
                    );
                },
                width: '20%'
            }
        ];
    }

    isEditing = index => index === this.state.editingKey;

    cancel = () => {
        this.setState({ editingKey: '' });
    };

    save(form, key) {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            const newData = [...this.state.data];
            const index = newData.findIndex((_, index) => key === index);
            if (index > -1) {
                const item = newData[index];
                const formData = new FormData();
                formData.append('id', this.props.match.params.id);
                formData.append('subjectId', item.course.subject.id);
                formData.append('teacherId', row.teacher.key);
                Fetch.post('class/editCourseTeacher', formData).then((response) => {
                    // dispatch(loadingActions.hideLoading());

                    if (response) {
                        console.log(response);
                        row.teacher = {id: row.teacher.key, name: row.teacher.label}
                        newData.splice(index, 1, {
                            ...item,
                            ...row,
                        });
                        this.setState({ data: newData, editingKey: '' });
                    }
                });
            } else {
                newData.push(row);
                this.setState({ data: newData, editingKey: '' });
            }
        });
    }

    edit(key) {
        this.setState({ editingKey: key });
    }

    componentDidMount() {
        let params = this.props.match.params;
        this.fetch(params);
    }

    fetch = (params = {}) => {
        console.log('params:', params);
        this.setState({ loading: true });
        Fetch.get('class/courseTeachers?' + qs.stringify(params)).then((response) => {
            console.log(response);
            this.setState({
                loading: false,
                data: response.data.courseTeachers
            });
        });
    };

    render() {
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };

        const columns = this.columns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: (record, index) => {
                    let inputType = 'text';
                    switch (col.dataIndex) {
                        case "teacher":
                            inputType = 'teacherselect';
                            break;
                        default:
                            inputType = 'text';
                    }
                    let dataIndex = col.dataIndex;
                    return {
                        record,
                        inputType: inputType,
                        dataIndex: dataIndex,
                        title: col.title,
                        editing: this.isEditing(index),
                    }
                },
            };
        });

        return (
            <div>
                <PageHeader
                    onBack={() => window.history.back()}
                    title={this.title}
                />
                <Table
                    components={components}
                    bordered
                    dataSource={this.state.data}
                    columns={columns}
                    rowClassName="editable-row"
                    loading={this.state.loading}
                    rowKey={row=>row.course.subject.id}
                    onChange={this.handleTableChange}
                />
            </div>

        );
    }
}
export default CourseTeacher;
