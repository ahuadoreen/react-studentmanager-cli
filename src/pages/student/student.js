import React from 'react';
import {Table, Popconfirm, Divider, Input, Button, Icon, PageHeader} from 'antd';
import * as Fetch from "../../util/fetch";
import EditableCell, {EditableContext, EditableFormRow} from "../../components/editablecell";
const qs = require('qs');

class Student extends React.Component {
    title = '学生';
    state = {
        data: [],
        pagination: {pageSize: 5},
        loading: false,
        editingKey: '',
        searchText: ''
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
                title: '学号',
                dataIndex: 'sno',
                sorter: true,
                width: '10%',
                editable: true
            },
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
                sorter: true,
                width: '30%',
                editable: true,
                ...this.getColumnSearchProps('name')
            },
            {
                title: '性别',
                dataIndex: 'gender',
                render: gender => gender === 1 ? '男' : '女',
                width: '12%',
                editable: true
            },
            {
                title: '年龄',
                dataIndex: 'age',
                width: '10%',
                editable: true
            },
            {
                title: '班级',
                dataIndex: 'classes',
                render: classes => classes.grade === 1 ? '一年级'+ classes.className : '二年级'+ classes.className,
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
              <Popconfirm title="确定要删除吗?" okText="确定" cancelText="取消" onConfirm={() => this.handleDelete(record.id)}>
        <a>删除</a>
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
                const item = newData[index];
                Fetch.post('student/editStudent', qs.stringify({id: item.id, sno: row.sno, name: row.name, gender: row.gender,
                    age: row.age, classId: row.classes.key}, { indices: false })).then((response) => {
                    // dispatch(loadingActions.hideLoading());

                    if (response) {
                        console.log(response);
                        let label = row.classes.label;
                        let gradeStr = label.substring(0, 3)
                        let grade = 0
                        switch (gradeStr) {
                            case '一年级':
                                grade = 1;
                                break;
                            case '二年级':
                                grade = 2;
                                break;
                        }
                        row.classes = {id: row.classes.key, className: label.substring(3, label.length), grade}
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
        this.fetch({
            size: 5,
            index: 0,
            name: ''
        });
    }

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm)}
                    icon="search"
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    搜索
                </Button>
                <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    重置
                </Button>
            </div>
        ),
        filterIcon: filtered => (
            <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        }
    });

    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    handleDelete = key => {
        Fetch.post('student/deleteStudent', qs.stringify({id: key})).then((response) => {
            // dispatch(loadingActions.hideLoading());

            if (response) {
                console.log(response);
                this.fetch({
                    size: this.state.pagination.pageSize,
                    index: this.state.pagination.current - 1,
                    name: ''
                });
            }
        });
    };

    handleTableChange = (pagination, filters, sorter) => {
        this.cancel();
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        this.fetch({
            size: pagination.pageSize,
            index: pagination.current - 1,
            name: ''
        });
    };

    fetch = (params = {}) => {
        console.log('params:', params);
        this.setState({ loading: true });
        Fetch.get('student/students?' + qs.stringify(params)).then((response) => {
            console.log(response);
            const pagination = { ...this.state.pagination };
            // Read total count from server
            // pagination.total = data.totalCount;
            pagination.total = response.data.total;
            this.setState({
                loading: false,
                data: response.data.students,
                pagination,
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
                        case "age":
                            inputType = 'number';
                            break;
                        case "gender":
                            inputType = 'genderradio';
                            break;
                        case "classes":
                            inputType = 'classselect';
                            break;
                        default:
                            inputType = 'text';
                    }
                    return {
                        record,
                        inputType: inputType,
                        dataIndex: col.dataIndex,
                        title: col.title,
                        editing: this.isEditing(index),
                    }
                },
            };
        });

        return (
            <div>
                <PageHeader title={this.title} />
                <Button href="/home/addStudent" type="primary" style={{ marginBottom: 16 }}>
                    新增
                </Button>
                <Table
                    components={components}
                    bordered
                    dataSource={this.state.data}
                    columns={columns}
                    rowClassName="editable-row"
                    pagination={this.state.pagination}
                    loading={this.state.loading}
                    rowKey={row=>row.id}
                    onChange={this.handleTableChange}
                />
            </div>

        );
    }
}
export default Student;
