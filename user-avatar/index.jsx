import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './style.less';

/**
 * 根据用户信息（name avatar）获取用户头像
 * 如果avatar存在，返回img头像
 * 如果avatar不存在，返回name[0] 待背景颜色的span（只有背景色，无其他样式）
 */
export default class UserAvatar extends Component {
    static defaultProps = {
        className: 'user-avatar',
        name: '匿名',
        avatar: '',
    };

    static propTypes = {
        className: PropTypes.string,
        name: PropTypes.string,
        avatar: PropTypes.string,
    };

    render() {
        const {name, avatar} = this.props;

        if (avatar) return <img className={this.props.className} src={avatar} alt="用户头像"/>;

        const nameFirstChar = name[0];
        const colors = [
            'rgb(80, 193, 233)',
            'rgb(255, 190, 26)',
            'rgb(228, 38, 146)',
            'rgb(169, 109, 243)',
            'rgb(253, 117, 80)',
            'rgb(103, 197, 12)',
            'rgb(80, 193, 233)',
            'rgb(103, 197, 12)',
        ];
        const backgroundColor = colors[nameFirstChar.charCodeAt(0) % colors.length];
        return <span className={this.props.className} style={{backgroundColor}}>{name[0]}</span>;
    }
}
