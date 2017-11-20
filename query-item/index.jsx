import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Form, Button} from 'antd';
import {getFormItem} from '../form-util/FormUtils';

/**
 * 查询条件封装，通过传入items即可生成查询条件
 * item属性：
 * collapsedShow： 收起时，是否显示，用来区分展开/收起时所显示哪些项
 * 其他参见 getFormItem 属性
 */
@Form.create()
export default class QueryItem extends Component {
    constructor(props) {
        super(props);
        const {outerForm, form} = this.props;

        this.form = outerForm ? outerForm : form;
    }

    static propTypes = {
        showSearchButton: PropTypes.bool,
        showResetButton: PropTypes.bool,
        collapsed: PropTypes.bool,
        items: PropTypes.array,
        onSubmit: PropTypes.func,
        outerForm: PropTypes.object,
    };

    static defaultProps = {
        showSearchButton: true,
        showResetButton: true,
        collapsed: false,
        items: [],
        onSubmit: () => true,
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const {onSubmit} = this.props;
        const form = this.form;
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                onSubmit(values);
            }
        });
    };

    render() {
        const {
            items,
            showSearchButton,
            showResetButton,
            collapsed,
        } = this.props;
        const form = this.form;

        return (
            <Form onSubmit={this.handleSubmit}>
                {
                    /*
                     * items 中元素为数组，则数组中所有表单元素占一行
                     *       如果不是数组，则独自占一行
                     * 查询按钮，拼接到最后一行
                     * */
                    items.map((data, index) => {
                        if (!Array.isArray(data)) {
                            data = [data];
                        }
                        return (
                            <div key={index}>
                                {
                                    data.map(item => {
                                        const style = {display: 'inline'};
                                        if (collapsed && !item.collapsedShow) {
                                            style.display = 'none'
                                        }
                                        return (
                                            <span
                                                key={item.field}
                                                style={style}
                                            >
                                                {getFormItem({float: true, ...item}, form)}
                                            </span>
                                        );
                                    })
                                }
                                {
                                    index === items.length - 1 && (showSearchButton || showResetButton) ?
                                        <div style={{display: 'inline-block'}}>
                                            {
                                                showSearchButton ?
                                                    <Button
                                                        style={{marginLeft: 8, marginBottom: 16}}
                                                        type="primary"
                                                        htmlType="submit"
                                                    >
                                                        查询
                                                    </Button>
                                                    : null
                                            }
                                            {
                                                showResetButton ?
                                                    <Button
                                                        style={{marginLeft: 8, marginBottom: 16}}
                                                        type="ghost"
                                                        onClick={() => form.resetFields()}
                                                    >
                                                        重置
                                                    </Button>
                                                    : null
                                            }
                                        </div>
                                        : null
                                }
                                <div style={{clear: 'both'}}/>
                            </div>
                        );
                    })
                }
            </Form>
        );
    }
}
