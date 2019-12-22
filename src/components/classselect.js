import React from 'react';
import { Select, Spin } from 'antd';
import * as Fetch from "../util/fetch";
const qs = require('qs');

const { Option } = Select;

class ClassSelect extends React.Component {
    constructor(props) {
        super(props);
        const value = props.value || [];
        this.state = {
            data: [],
            value: value,
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
        Fetch.get('class/classes?' + qs.stringify(params)).then((response) => {
            console.log(response);
            const data = response.data.classes;
            this.setState({ data: data, fetching: false });
        });
    };

    handleChange = value => {
        this.setState({
            value: value,
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
        const { fetching, data, value } = this.state;
        const options = this.state.data.map(d =>{
            let str = '';
            switch (d.grade) {
                case 1:
                    str = '一年级';
                    break;
                case 2:
                    str = '二年级';
                    break;
            }
            str = str + d.className;
            return <Option key={d.id}>{str}</Option>;
        } );
        return (
            <Select
                labelInValue
                value={value}
                placeholder="请选择班级"
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

export default ClassSelect;