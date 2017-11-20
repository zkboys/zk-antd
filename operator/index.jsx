import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Icon, Popconfirm, Dropdown, Menu} from 'antd';
import FontIcon from '../font-icon/FontIcon';
import PopPrompt from '../pop-prompt/PopPrompt';
import './style.less';

/**
 * 操作封装，一般用于表格最后的操作列中
 */
export default class Operator extends Component {
    static propTypes = {
        items: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.isRequired,
            visible: PropTypes.bool,
            color: PropTypes.string,
            loading: PropTypes.bool,

            onClick: PropTypes.func,
            confirm: PropTypes.object,
            prompt: PropTypes.object,
        })),
        moreWidth: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        moreTrigger: PropTypes.array,
    };

    static defaultProps = {
        items: [],
        moreWidth: 'auto',
        moreTrigger: ['click'],
    };

    loadingIcon = <Icon type="loading"/>;

    label = {};

    getLabel = (options, i) => {
        let {label, loading, color, disabled} = options;

        if (loading) {
            const labelWidth = this.label[i] ? this.label[i].offsetWidth : 'auto';
            return <span className="operator-label" style={{display: 'inline-block', width: labelWidth, textAlign: 'center'}}>{this.loadingIcon}</span>;
        }

        const labelStyle = {};

        if (color) labelStyle.color = color;

        return <span className={`operator-label ${disabled ? 'operator-label-disabled' : ''}`} style={labelStyle} ref={v => this.label[i] = v}>{label}</span>;
    };

    /*
     * 如果含有confirm属性，即表明是Popconfirm，
     * confirm作为Popconfirm的props
     *
     * 其他元素同理
     * */
    getConfirm = (options, i) => {
        let label = this.getLabel(options, i);
        const {confirm} = options;
        return (
            <Popconfirm {...confirm}>
                {label}
            </Popconfirm>
        );
    };

    getPrompt = (opt, i) => {
        let label = this.getLabel(opt, i);
        const {prompt} = opt;
        return (
            <PopPrompt {...prompt}>
                {label}
            </PopPrompt>
        );
    };

    getText = (options, i) => {
        let label = this.getLabel(options, i);
        const {onClick} = options;

        if (options.label.type === 'a') return <span onClick={onClick}>{label}</span>;

        return <span onClick={onClick}>{label}</span>;
    };

    getStatusSwitch = (opt, i) => {
        const {statusSwitch, disabled = false} = opt;
        const {status} = statusSwitch;
        const props = {...statusSwitch};

        const icon = status ? 'check-circle' : 'fa-ban';
        const color = status ? 'green' : 'red';

        const defaultLabel = <FontIcon type={icon}/>;
        let label = this.getLabel({...opt, label: defaultLabel, color}, i);

        // 如果没有权限，不允许进行操作，只做展示
        if (disabled) return label;

        Reflect.deleteProperty(props, 'status');
        return (
            <Popconfirm {...props}>
                {label}
            </Popconfirm>
        );
    };

    getItem = (opt, i) => {
        const {
            confirm,
            prompt,
            statusSwitch,
            visible = true,
            disabled = false,
        } = opt;

        if (visible) {
            // 因为label特殊，getStatusSwitch 内部自己判断了是否可用
            if (disabled && statusSwitch) return this.getStatusSwitch(opt, i);

            if (disabled) {
                opt.color = '#ccc';
                return this.getLabel(opt, i);
            }

            if (confirm) return this.getConfirm(opt, i);

            if (prompt) return this.getPrompt(opt, i);

            if (statusSwitch) return this.getStatusSwitch(opt, i);

            return this.getText(opt, i);
        }
        return null;
    };

    render() {
        const {items, moreWidth, moreTrigger} = this.props;
        let operators = [];
        let more = [];

        items.forEach((opt, i) => {
            const {isMore} = opt;
            const item = this.getItem(opt, i);

            if (item) {
                if (isMore) {
                    more.push(item);
                } else {
                    operators.push(item);
                }
            }
        });

        if (more && more.length) { // 更多
            const menu = (
                <Menu style={{width: moreWidth}}>
                    {
                        more.map((item, index) => <Menu.Item key={index}>{item}</Menu.Item>)
                    }
                </Menu>
            );
            operators.push(
                <Dropdown overlay={menu} trigger={moreTrigger}>
                    <span className="operator-label">
                        更多<Icon type="down"/>
                    </span>
                </Dropdown>
            );
        }

        const operatorsLength = operators.length;

        if (!operatorsLength) {
            return null;
        }
        return (
            <span>
                {operators.map((v, i) => (
                    <span key={`operator-${i}`}>
                        {v}
                        {operatorsLength === i + 1 ? '' : <span className="operator-divider"/>}
                    </span>
                ))}
            </span>
        );
    }
}
