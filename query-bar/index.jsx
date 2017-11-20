import React from 'react';
import PropTypes from 'prop-types';
import {Icon} from 'antd';
import './style.less';

/**
 * 查询条件容器，只具有简单样式
 */
export default class QueryBar extends React.Component {
    static propTypes = {
        showCollapsed: PropTypes.bool,      // 是否显示隐藏 展开/收起 按钮
        collapsed: PropTypes.bool,          // 展开/收起 状态
        onCollapsedChange: PropTypes.func,  // 展开/收起 状态改变
    };
    static defaultProps = {
        showCollapsed: false,
        collapsed: false,
        onCollapsedChange: collapsed => collapsed,
    };

    state = {};

    componentDidMount() {
    }

    handleCollapsedChange = (e) => {
        e.preventDefault();
        const {onCollapsedChange, collapsed} = this.props;
        onCollapsedChange && onCollapsedChange(!collapsed);
    };

    render() {
        const {collapsed, showCollapsed} = this.props;
        return (
            <div className="query-bar">
                {
                    showCollapsed ? (
                        <a className="query-bar-collapsed" onClick={this.handleCollapsedChange}>
                            {collapsed ? '展开' : '收起'}
                            <Icon type={collapsed ? 'down' : 'up'}/>
                        </a>
                    ) : null
                }
                {this.props.children}
            </div>
        );
    }
}
