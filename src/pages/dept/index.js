import React from 'react';
import { connect } from 'dva';
import { Card, Col, Row, Tree, Tag, Icon, Menu, Dropdown, Popconfirm } from 'antd';
import { ModalForm } from '@/components/Custom';
import DescriptionList from '../../components/DescriptionList';
import styles from '@/components/Custom/Table/TableList.less';

const { Description } = DescriptionList;
const { TreeNode } = Tree;

@connect(({ dept, project, loading }) => ({
  dept,
  project,
  loading: loading.models.dept,
}))
class dept extends React.PureComponent {
  state = {
    visible: false,
    formData: {},
    expandedKeys: [],
    autoExpandParent: true,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    // 左边树形数据
    dispatch({ type: 'dept/fetch' });
  }

  onSelect = (selectedKeys, e) => {
    const { expandedKeys } = this.state;
    const {
      node: {
        props: { eventKey },
      },
    } = e;
    this.setState({
      expandedKeys: expandedKeys.includes(eventKey)
        ? expandedKeys.filter(d => eventKey !== d)
        : expandedKeys.concat(eventKey),
    });
  };

  // 验证组织编码是否存在
  checkCode = (rule, value, callback) => {
    if (this.state.formData.id) {
      callback();
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'dept/checkCode',
      payload: value,
      callback: data => {
        return data ? callback() : callback('编码已存在');
      },
    });
  };

  render() {
    const { formData, autoExpandParent, expandedKeys } = this.state;
    const {
      loading,
      dept: { treeData },
      dispatch,
    } = this.props;
    console.log(treeData);
    const formItems = [
      {
        type: 'treeSelect',
        title: '上级组织',
        key: 'parentId',
        require: true,
        options: treeData,
      },
      {
        type: 'input',
        title: '组织名称',
        key: 'name',
        rules: [{ required: true, message: '名称不可为空' }],
        require: true,
      },
      {
        type: 'input',
        title: '组织编码',
        key: 'code',
        require: true,
        editDisabled: true,
        rules: [
          {
            required: true,
            message: '由数字、26个英文字母或者下划线组成的2-10位字符!',
            pattern: /^[\w]{2,10}$/,
          },
          {
            validator: this.checkCode,
          },
        ],
      },
      {
        type: 'textArea',
        title: '组织简介',
        key: 'remark',
      },
    ];

    // const loop = data =>
    //   data.map(item => {
    //     console.log(item)
    //     console.log(345)
    //     if (item.children) {
    //       return (
    //         <TreeNode key={item.value} title={item.title}>
    //           {loop(item.children)}
    //         </TreeNode>
    //       );
    //     }
    //     return (
    //       <TreeNode
    //         icon={<Icon type="smile-o" />}
    //         key={item.value}
    //         title={<span>{item.title}</span>}
    //       />
    //     );
    //   });
    return (
      <Card bordered={false} className={styles.card}>
        <div style={{ background: '#ECECEC', padding: '20px' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Card
                title="组织机构"
                loading={loading}
                bordered={false}
                extra={<a onClick={() => this.setState({ visible: true })}>新增</a>}
                type="inner"
                className={styles.card}
              >
                <div style={{ minHeight: 680, overflowY: 'auto', maxHeight: 380 }}>
                  {treeData ? (
                    <Tree
                      showLine
                      onSelect={this.onSelect}
                      onExpand={keys =>
                        this.setState({
                          expandedKeys: keys,
                          autoExpandParent: false,
                        })
                      }
                      expandedKeys={expandedKeys}
                      autoExpandParent={autoExpandParent}
                      treeData={treeData}
                    />
                  ) : (
                    'loading tree'
                  )}
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card
                title="组织信息"
                bordered={false}
                type="inner"
                style={{ height: 794, fontSize: 16 }}
              >
                {
                  <DescriptionList col={1} gutter={10} size="large">
                    <Description term="组织名称">
                      <Tag color="purple">{formData.name || '暂无'}</Tag>
                    </Description>
                    <Description term="组织编码">
                      <Tag color="blue">{formData.code || '暂无'}</Tag>
                    </Description>
                    <Description term="层级编码">
                      <Tag color="lime">{formData.levelCode || '暂无'}</Tag>
                    </Description>
                    <Description term="组织简介">{formData.remark || '暂无'}</Description>
                  </DescriptionList>
                }
              </Card>
            </Col>
          </Row>
        </div>
        <ModalForm
          changeVisible={() => this.setState({ visible: false, formData: {} })}
          formItems={formItems}
          visible={this.state.visible}
          formData={this.state.formData}
          updateUrl="/org/edit"
          addUrl="/org/add"
          dispatch={dispatch}
          selectArrList={['brandIds']}
          callBackFetch={() => dispatch({ type: 'dept/fetchTree' })}
        />
      </Card>
    );
  }
}
export default dept;
