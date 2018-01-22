/*
 * form相关封装的一些基础方法，EditCell、QueryItem、FormPage等组件可能用到
 * */
import React from 'react';
import InputClear from '../input-clear/InputClear';
import FormItemLayout from '../form-item-layout/FormItemLayout';
import {
    InputNumber,
    Input,
    Select,
    TreeSelect,
    Checkbox,
    Radio,
    Switch,
    DatePicker,
    TimePicker,
    Cascader,
} from 'antd';

// input number textarea password mobile email select select-tree checkbox radio switch date time date-time cascader
/*
 * item 大多是 FormItemLayout 所需参数 及 表单元素所需参数
 type: 'input',
 field: 'loginName',
 label: '登录名',
 labelSpaceCount: 3,
 width: '25%',
 placeholder: '请输入登录名',
 decorator: {
 rules: [
 {required: false, message: '请输入用户名'},
 ],
 },
 elementProps: {} 元素的一些props，具体参考antd
 *
 * */
function isInputLikeElement(type) {
    return [
        'input',
        'input-clear',
        'number',
        'textarea',
        'password',
        'mobile',
        'email',
    ].includes(type);
}

export function getPlaceholder(item) {
    const {type = 'input', label, placeholder, elementProps = {}} = item;

    if (elementProps.placeholder) return elementProps.placeholder;

    if (placeholder) return placeholder;

    return isInputLikeElement(type) ? `请输入${label}` : `请选择${label}`;
}

export function getFormElement(item, form) {
    const {type = 'input', elementProps = {}} = item;
    const width = elementProps.width ? elementProps.width : '100%';
    const commonStyle = {width};

    elementProps.style = elementProps.style ? {...commonStyle, ...elementProps.style} : commonStyle;
    elementProps.placeholder = getPlaceholder(item);

    /*
     input number textarea password mobile email
     select select-tree checkbox checkbox-group radio radio-group
     switch date date-time date-range month time cascader
     * */
    if (isInputLikeElement(type)) {
        if (type === 'input-clear') return <InputClear {...elementProps} form={form}/>;
        if (type === 'number') return <InputNumber {...elementProps}/>;
        return <Input type={type} {...elementProps}/>;
    }

    if (type === 'select') {
        const {options = []} = elementProps;
        return (
            <Select {...elementProps}>
                {
                    options.map(opt => <Select.Option key={opt.value} {...opt}>{opt.label}</Select.Option>)
                }
            </Select>
        );
    }

    if (type === 'select-tree') return <TreeSelect {...elementProps} treeData={elementProps.options}/>;

    if (type === 'checkbox') return <Checkbox {...elementProps}>{elementProps.label}</Checkbox>;

    if (type === 'checkbox-group') return <Checkbox.Group {...elementProps}/>;

    if (type === 'radio') return <Radio {...elementProps}>{elementProps.label}</Radio>;

    if (type === 'radio-group') return <Radio.Group {...elementProps}/>;

    if (type === 'switch') return <Switch {...elementProps} style={{...elementProps.style, width: 'auto'}}/>;

    if (type === 'date') return <DatePicker {...elementProps}/>;

    if (type === 'date-range') return <DatePicker.RangePicker {...elementProps}/>

    if (type === 'month') return <DatePicker.MonthPicker {...elementProps}/>;

    if (type === 'time') return <TimePicker {...elementProps}/>;

    if (type === 'cascader') return <Cascader {...elementProps}/>;

    throw new Error(`no such type: ${type}`);
    // TODO 其他类型，碰到需求的时候，再补充
    // TODO 自定义组件，from相关的组件（editable-cell、query-item）等，统一自定义组件接口。
}

export function getFormItem(item, form) {
    const {getFieldDecorator} = form;
    const {field, decorator} = item;
    return (
        <FormItemLayout key={item.field} {...item}>
            {getFieldDecorator(field, decorator)(getFormElement(item, form))}
        </FormItemLayout>
    );
}
