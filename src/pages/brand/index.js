import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, List, Popconfirm } from 'antd';
import { ModalForm } from '@/components/Custom';
import Ellipsis from '@/components/Ellipsis';
import styles from './style.less';

@connect(({ base, project, brand, loading }) => ({
  base,
  brand,
  project,
  loading: loading.models.project,
}))
class brand extends PureComponent {
  state = {
    visible: false,
    formData: {},
    formValues: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'base/list', payload: { url: '/brand/list' } });
  }

  handleRemove = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/remove',
      payload: { url: '/brand/delete', id },
    }).then(() => {
      dispatch({ type: 'base/list', payload: { url: '/brand/list' } });
    });
  };

  render() {
    const {
      base: { listData, loading },
      dispatch,
    } = this.props;
    const { visible, formData } = this.state;
    const formItems = [
      {
        type: 'input',
        title: '品牌名称',
        key: 'name',
        rules: [
          {
            required: true,
            message: '由数字、字母或中文组成的2-8位字符',
            whitespace: true,
            pattern: /^[\w|^\u4E00-\u9FA5]{2,8}$/,
          },
        ],
        require: true,
      },
      {
        type: 'input',
        title: '品牌编码',
        key: 'code',
        rules: [{ required: true, message: '2-20位字符!', whitespace: true, max: 20, min: 2 }],
      },
      {
        type: 'textArea',
        title: '品牌简介',
        key: 'remark',
        rules: [{ required: true, message: '2-30位字符!', whitespace: true, max: 30, min: 2 }],
      },
      {
        type: 'img',
        title: '品牌logo',
        key: 'logo',
        text: '上传logo',
        // maxCount: 2,
      },
    ];
    return (
      <Fragment>
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={['', ...listData]}
            renderItem={item =>
              item ? (
                <List.Item key={item.id}>
                  <Card
                    className={styles.card}
                    actions={[
                      <Popconfirm
                        title="是否确认删除此品牌"
                        onConfirm={() => this.handleRemove(item.id)}
                      >
                        <a>删除</a>
                      </Popconfirm>,
                    ]}
                  >
                    <Card.Meta
                      avatar={<img alt="" className={styles.cardAvatar} src={item.logo} />}
                      title={<a>{item.name}</a>}
                      description={
                        <Ellipsis className={styles.item} lines={3}>
                          {item.remark}
                        </Ellipsis>
                      }
                    />
                  </Card>
                </List.Item>
              ) : (
                <List.Item>
                  <Button
                    htmlType="button"
                    size="small"
                    icon="plus"
                    type="dashed"
                    className={styles.newButton}
                    onClick={() => this.setState({ visible: true })}
                  >
                    新增品牌
                  </Button>
                </List.Item>
              )
            }
          />
        </div>
        <ModalForm
          changeVisible={() => this.setState({ visible: false, formData: {} })} // 取消modal回调
          formItems={formItems} // 表单元素以及配置
          visible={visible} // 控制弹框
          formData={formData} // 表单绑定的数据对象
          updateUrl="/brand/edit" // 修改的URL
          addUrl="/brand/add" // 新增的URL
          dispatch={dispatch}
          callBackFetch={() =>
            dispatch({
              type: 'bestForm/list',
              payload: { url: '/brand/list', ...this.state.formValues },
            })
          } // 刷新回调
        />
      </Fragment>
    );
  }
}
export default brand;
