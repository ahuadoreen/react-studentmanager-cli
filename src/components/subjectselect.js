import React from 'react';
import { Select, Spin } from 'antd';
import * as Fetch from "../util/fetch";
const qs = require('qs');

const { Option } = Select;

class SubjectSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            fetching: false
        };
    }

    componentDidMount() {
        this.fetch('');
    }

    fetch = (value) => {
        const params = {
            size: 1000,
            index: 0,
            name: value
        };
        this.setState({ data: [], fetching: true });
        Fetch.get('subject/subjects?' + qs.stringify(params)).then((response) => {
            console.log(response);
            const data = response.data.subjects;
            this.setState({ data: data, fetching: false });
        });
    };

    handleChange = value => {
        this.setState({
            fetching: false,
        });
        this.triggerChange(value);
    };
    triggerChange = changedValue => {
        // Should provide an event to pass value to Form.
        console.log(changedValue)
        const { onChange } = this.props;
        if (onChange) {
            onChange(changedValue);
        }
    };

    render() {
        const { fetching } = this.state;
        const value = this.props.value || [];
        const options = this.state.data.map(d => <Option key={d.id}>{d.name}</Option>);
        return (
            <Select
                mode="multiple"
                labelInValue
                value={value}
                placeholder="请选择科目"
                notFoundContent={fetching ? <Spin size="small" /> : null}
                filterOption={false}
                onSearch={this.fetch}
                onChange={this.handleChange}
                style={{ width: '100%' }}
            >
                {options}
            </Select>
        );
    }
}

export default SubjectSelect;
