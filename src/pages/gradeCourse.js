import React from 'react';
import {Table, Popconfirm, Divider, PageHeader} from 'antd';
import * as Fetch from "../util/fetch";
import EditableCell, {EditableContext, EditableFormRow} from "../components/editablecell";
const qs = require('qs');

class GradeCourse extends React.Component {
    title = '年级课程';
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
                title: '年级',
                dataIndex: 'grade',
                render: grade => {switch (grade) {
                    case 1:
                        return '一年级';
                    case 2:
                        return '二年级';
                }},
                key: 'grade',
                width: '20%'
            },
            {
                title: '科目',
                dataIndex: 'subjectNames',
                render: (text, record) => record.courses==null? '' : record.courses.subjectNames,
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
                        <span><a disabled={editingKey !== ''} onClick={() => this.edit(index)}>
          编辑
        </a>
        <Divider type="vertical"/>
              <Popconfirm title="确定要重置吗?" okText="确定" cancelText="取消" onConfirm={() => this.handleDelete(record.grade)}>
        <a>重置</a>
        </Popconfirm></span>
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
                console.log(row)
                const item = newData[index];
                console.log(item)
                row.subjectNames = row.subjectIds.map(d => d.label)
                row.subjectIds = row.subjectIds.map(d => d.key)
                Fetch.post('gradeCourse/editGradeCourse', qs.stringify({grade: item.grade, subjectIds: row.subjectIds},
                    { indices: false })).then((response) => {
                    // dispatch(loadingActions.hideLoading());

                    if (response) {
                        console.log(response);
                        row.subjectIds = row.subjectIds.join(',')
                        row.subjectNames = row.subjectNames.join(',')
                        const cache = item;
                        cache.courses = row;
                        newData.splice(index, 1, {
                            ...item,
                            ...cache,
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
        this.fetch();
    }

    handleDelete = key => {
        Fetch.post('gradeCourse/deleteGradeCourse', qs.stringify({grade: key})).then((response) => {
            // dispatch(loadingActions.hideLoading());

            if (response) {
                console.log(response);
                this.fetch();
            }
        });
    };

    fetch = () => {
        this.setState({ loading: true });
        Fetch.get('gradeCourse/gradeCourses').then((response) => {
            console.log(response);
            this.setState({
                loading: false,
                data: response.data.gradeCourses
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
                    const inputType = 'subjectselect';
                    const dataIndex = 'subjectIds';
                    return {
                        record: record.courses,
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
                <PageHeader title={this.title} />
                <Table
                    components={components}
                    bordered
                    dataSource={this.state.data}
                    columns={columns}
                    rowClassName="editable-row"
                    loading={this.state.loading}
                    rowKey={row=>row.grade}
                    onChange={this.handleTableChange}
                />
            </div>

        );
    }
}
export default GradeCourse;
