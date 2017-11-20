import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button} from 'antd';
import FontIcon from '../font-icon/FontIcon';
import './style.less';

export default class ToolItem extends Component {
    static propTypes = {
        toolItems: PropTypes.array,
        hasPermission: PropTypes.func,
    };

    static defaultProps = {
        toolItems: [],
        hasPermission: () => true,
    };

    state = {};

    componentDidMount() {

    }

    render() {
        const {items} = this.props;
        return (
            <div>
                {
                    items.map((item, index) => {
                        const {
                            key,
                            type = 'primary',
                            icon,
                            text,
                            component,
                            getComponent,
                            visible = true,
                            onClick = () => {
                            },
                        } = item;
                        const itemKey = key || index;
                        if (!visible) return null;
                        if (getComponent) return <span className="zk-tookit-tool-item" key={itemKey}>{getComponent()}</span>;
                        if (component) return <span className="zk-tookit-tool-item" key={itemKey}>{component}</span>;
                        return (
                            <Button
                                className="zk-tookit-tool-item"
                                key={itemKey}
                                type={type}
                                onClick={onClick}
                            >
                                {
                                    icon ?
                                        <FontIcon type={icon}/>
                                        : null
                                }
                                {text}
                            </Button>
                        );
                    })
                }
            </div>
        );
    }
}
