import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Table} from 'antd';
import QueryBar from '../query-bar';
import QueryItem from '../query-item';
import ToolBar from '../tool-bar/ToolBar';
import QueryResult from '../query-result';
import PaginationComponent from '../pagination';
import ToolItem from '../tool-item';

/**
 * 列表页的封装，通过传入相应的配置，生成列表页
 */
export default class extends Component {
    constructor(props) {
        super(props);

        if ('defaultPageSize' in props) {
            this.state.pageSize = props.defaultPageSize;
        }

        if ('showCollapsed' in props && props.showCollapsed) {
            this.state.collapsed = true;
        }

        if ('defaultCollapsed' in props) {
            this.state.collapsed = props.defaultCollapsed;
        }
    }

    static propTypes = {
        toolItems: PropTypes.array,
        queryItems: PropTypes.array,
        searchOnMount: PropTypes.bool,
        showSearchButton: PropTypes.bool,
        showResetButton: PropTypes.bool,
        showPagination: PropTypes.bool,
        showSequenceNumber: PropTypes.bool,
        showCollapsed: PropTypes.bool,
        tableProps: PropTypes.object.isRequired,
        form: PropTypes.object, // 表单对象
        onSearch: PropTypes.func, // 触发查询

        total: PropTypes.number,
        pageNum: PropTypes.number,
        onPageNumChange: PropTypes.func,
    };

    static defaultProps = {
        loading: false,
        toolItems: [],
        queryItems: [],
        searchOnMount: true,
        showSearchButton: true,
        showResetButton: true,
        showPagination: true,
        showSequenceNumber: true,
        showCollapsed: false,

        total: 0,
        pageNum: 1,
    };

    state = {
        query: {},
        total: 0,
        pageSize: 20,
        collapsed: false,
    };

    componentDidMount() {
        const {searchOnMount} = this.props;
        if (searchOnMount) {
            this.search();
        }
    }

    search = (args) => {
        const {onSearch, showPagination} = this.props;
        const {query} = this.state;
        let params = {};
        if (showPagination) {
            const {pageNum} = this.props;
            const {pageSize} = this.state;
            params = {
                ...query,
                pageNum,
                pageSize,
                ...args,
            };
        } else {
            params = {
                ...query,
                ...args,
            };
        }
        onSearch && onSearch(params);
    };

    handleQuery = (query) => {
        const {pageNum} = this.props;
        this.setState({query}, () => this.search({pageNum, ...query}));
    };

    handlePageNumChange = (pageNum) => {
        const {onPageNumChange} = this.props;
        onPageNumChange && onPageNumChange(pageNum);
    };

    handlePageSizeChange = pageSize => {
        this.setState({pageSize}, () => this.search({pageSize}));
    };

    render() {
        const {
            loading,
            toolItems,
            queryItems,
            showSearchButton,
            showResetButton,
            showPagination,
            showSequenceNumber,
            showCollapsed,
            total,
            form,
        } = this.props;
        const {pageSize, collapsed} = this.state;

        let {pageNum} = this.props;
        pageNum = pageNum <= 0 ? 1 : pageNum;

        // 解决如果各个组件都不传递tableProps，组件将都使用默认tableProps，而且是同一个tableProps，会产生互相干扰
        let tableProps = {...this.props.tableProps};

        const {
            rowKey,
            columns = [],
        } = tableProps;

        // 默认 id 作为rowKey
        if (!rowKey) tableProps.rowKey = record => record.id;

        // columns key可以缺省，默认与dataIndex，如果有相同dataIndex列，需要指定key；
        const tableColumns = columns.map(item => {
            return item.key ? {...item} : {key: item.dataIndex, ...item};
        });

        // 是否显示序号列
        showSequenceNumber && tableColumns.unshift({
            title: '序号',
            key: '__num__',
            width: 60,
            render: (text, record, index) => (index + 1) + ((pageNum - 1) * pageSize),
        });

        tableProps.columns = tableColumns;

        return (
            <div>
                {
                    queryItems && queryItems.length ?
                        <QueryBar
                            showCollapsed={showCollapsed}
                            collapsed={collapsed}
                            onCollapsedChange={co => this.setState({collapsed: co})}
                        >
                            <QueryItem
                                collapsed={collapsed}
                                outerForm={form}
                                items={queryItems}
                                showSearchButton={showSearchButton}
                                showResetButton={showResetButton}
                                onSubmit={this.handleQuery}
                            />
                        </QueryBar>
                        : null
                }
                {
                    toolItems && toolItems.length ?
                        <ToolBar>
                            <ToolItem items={toolItems}/>
                        </ToolBar>
                        : null
                }
                <QueryResult>
                    <Table
                        loading={loading}
                        size="large"
                        pagination={false}
                        {...tableProps}
                    />
                </QueryResult>
                {
                    showPagination ?
                        <PaginationComponent
                            pageSize={pageSize}
                            pageNum={pageNum}
                            total={total}
                            onPageNumChange={this.handlePageNumChange}
                            onPageSizeChange={this.handlePageSizeChange}
                        />
                        : null
                }
            </div>
        );
    }
}
