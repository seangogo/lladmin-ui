import React from 'react';
import { Card, Col, Row, Avatar, Modal, Button, Tabs, Tag } from 'antd';
import DescriptionList from '../../components/DescriptionList';

const { Description } = DescriptionList;
const { TabPane } = Tabs;
export default class userDetailModal extends React.PureComponent {
  state = {
    detailModelData: {},
  };
  componentWillReceiveProps(nextProps) {
    const { detailModelData } = nextProps;
    if (detailModelData.id !== this.state.detailModelData.id) {
      this.setState({ detailModelData });
    }
  }
  render() {
    const { changeVisible, detailModelData } = this.props;
    const colors = [
      'pink-inverse',
      'red-inverse',
      'orange-inverse',
      'green-inverse',
      'cyan-inverse',
      'blue-inverse',
      'purple-inverse',
      '#f50',
      '#2db7f5',
      '#87d068',
      '#108ee9',
    ];
    // noinspection JSUnresolvedVariable
    const tabPane =
      detailModelData.roles &&
      detailModelData.roles.map((d, j) => (
        <TabPane tab={d.name} key={j}>
          {d.resourceName.map((f, i) => (
            <Tag color={colors[i % 11]} key={i} style={{ marginBottom: 10 }}>
              {f}
            </Tag>
          ))}
        </TabPane>
      ));
    const type = {
      ROOT: '根组织',
      PATEO: '项目组',
      FIRM: '厂商',
      DEALER: '经销商',
    };
    return (
      <Modal
        title=""
        style={{ top: 20 }}
        width="40%"
        visible={this.props.visible}
        closable={false}
        onCancel={() => changeVisible()}
        maskClosable
        footer={
          <Button type="primary" onClick={() => changeVisible()}>
            返回
          </Button>
        }
      >
        <div style={{ background: '#ECECEC', marginTop: 30 }}>
          <Row gutter={16}>
            <Col span={24}>
              <Card title="基本信息" bordered type="inner">
                <Col span={6}>
                  <Avatar
                    style={{ width: 100, height: 125 }}
                    shape="square"
                    src={detailModelData.imgUrl}
                    size="large"
                  />
                </Col>
                <Col span={18}>
                  <DescriptionList col={2} gutter={10} size="small">
                    <Description term="登陆帐户">{detailModelData.username}</Description>
                    <Description term="用户姓名">{detailModelData.realName}</Description>
                    <Description term="用户性别">
                      {detailModelData.sex === 'MALE' ? '男性' : '女性'}
                    </Description>
                    <Description term="联系方式">{detailModelData.phone}</Description>
                    <Description term="始创建人">{detailModelData.createdBy}</Description>
                  </DescriptionList>
                  <DescriptionList col={2} gutter={10} size="small" style={{ marginTop: 10 }}>
                    <Description term="电子邮箱">{detailModelData.email}</Description>
                  </DescriptionList>
                </Col>
              </Card>
              <Card title="授权信息" bordered type="inner">
                <Col span={24}>
                  <div className="card-container">
                    <Tabs defaultActiveKey="0" size="small">
                      {tabPane}
                    </Tabs>
                  </div>
                </Col>
              </Card>
              <Card title="组织信息" bordered type="inner">
                <Col span={16}>
                  <DescriptionList col={1} gutter={30} size="small">
                    <Description term="组织类型">{type[detailModelData.orgType]}</Description>
                    <Description term="组织名称">{detailModelData.orgName}</Description>
                    <Description term="组织简介">{detailModelData.remark}</Description>
                    <Description term="层级编码">{detailModelData.orgCode}</Description>
                  </DescriptionList>
                </Col>
              </Card>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}
