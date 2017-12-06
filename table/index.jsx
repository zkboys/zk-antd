import React, {Component} from 'react';
import PropTypes from 'prop-types';
import domEvent from 'zk-utils/lib/dom-event-hoc';
import {Table} from 'antd';
import 'animate.css';
import './style.less';

@domEvent()
export default class ZKTable extends Component {
    constructor(props) {
        super(props);
        this.state.dataSource = props.dataSource;
    }

    static propTypes = {
        uniqueKey: PropTypes.string,            // 数据的唯一key值
        animationDuring: PropTypes.number,      // 动画持续时间
        inAnimationClass: PropTypes.string,     // 插入动画 class
        outAnimationClass: PropTypes.string,    // 移除动画 class

        rightClickContent: PropTypes.func,      // 右键内容
        onRightClick: PropTypes.func,           // 右键事件
    };

    static defaultProps = {
        uniqueKey: 'id',
        animationDuring: 500,
        inAnimationClass: 'animated fadeInLeft',
        outAnimationClass: 'animated zoomOutRight',
    };

    state = {
        dataSource: [],

        show: false,
        left: 0,
        right: 0,
        content: '',
    };

    componentWillReceiveProps(nextProps) {
        const {uniqueKey, animationDuring} = this.props;
        const nextDataSource = nextProps.dataSource || [];
        const dataSource = this.props.dataSource || [];

        // 筛选原dataSource中有哪些数据新的dataSource中已经删除
        let hasDeletedRecord = false;
        dataSource.forEach(item => {
            const exist = nextDataSource.find(it => it[uniqueKey] === item[uniqueKey]);
            if (!exist) {
                hasDeletedRecord = true;
                item.__isDeleted__ = true;
            }
        });

        nextDataSource.forEach(item => {
            const exist = dataSource.find(it => it[uniqueKey] === item[uniqueKey]);
            if (!exist) {
                item.__isNewAdd__ = true;
            }
        });

        if (hasDeletedRecord) {
            this.setState({dataSource});

            setTimeout(() => {
                this.setState({dataSource: nextDataSource});
            }, animationDuring);
        } else {
            this.setState({dataSource: nextDataSource});
        }
    }

    componentDidMount() {
        // this.props.$addEventListener(document, 'click', e => this.setState({show: e.path.includes(this.contentWrapper)}));
        this.props.addEventListener(document, 'click', () => this.setState({show: false}));

        this.props.addEventListener(document, 'scroll', () => this.setState({show: false}));
    }

    handleRightClick = (record, index, e) => {
        e.preventDefault();
        let left = e.clientX;
        let top = e.clientY;
        let position = {left, top};
        const {onRowContextMenu} = this.props;
        if (onRowContextMenu) onRowContextMenu(record, index, e);

        const {rightClickContent} = this.props;
        if (!rightClickContent) return;
        const content = rightClickContent(record, index);

        this.setState({content, show: true, ...position});
    };

    setContentPosition() {
        if (!this.content) return;
        let {left, top} = this.state;
        const winWidth = document.documentElement.clientWidth || document.body.clientWidth;
        const winHeight = document.documentElement.clientHeight || document.body.clientHeight;
        if (left >= (winWidth - this.content.offsetWidth)) {
            left = winWidth - this.content.offsetWidth;
        }
        if (top > winHeight - this.content.offsetHeight) {
            top = winHeight - this.content.offsetHeight;
        }
        this.content.style.left = `${left}px`;
        this.content.style.top = `${top}px`;
    }

    render() {
        const {
            rowKey,
            rowClassName,
            uniqueKey,
            inAnimationClass,
            outAnimationClass,
        } = this.props;
        const {dataSource} = this.state;

        const {show, left, top, content} = this.state;

        window.setTimeout(() => this.setContentPosition());

        return (
            <div>
                <div
                    className="zk-table-content-wrapper"
                    ref={node => this.contentWrapper = node}
                >
                    <div
                        ref={node => this.content = node}
                        className="zk-table-content"
                        style={{left, top}}
                    >
                        {show ? content : null}
                    </div>
                </div>

                <Table
                    {...this.props}
                    dataSource={dataSource}
                    rowKey={(record, index) => {
                        if (rowKey) {
                            if (typeof rowKey === 'string') {
                                return record[rowKey];
                            }

                            return rowKey(record, index);
                        }
                        return record[uniqueKey];
                    }}
                    rowClassName={(record, index) => {
                        let cn = '';
                        if (rowClassName) {
                            cn = rowClassName(record, index);
                        }

                        if (record.__isDeleted__) return `${outAnimationClass} ${cn}`;
                        if (record.__isNewAdd__) return `${inAnimationClass} ${cn}`;
                    }}
                    onRowContextMenu={this.handleRightClick}
                />

            </div>
        );
    }
}
