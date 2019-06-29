import React, { PureComponent, Fragment } from 'react';
import { Card, Row, Col } from 'antd';

export default class home extends PureComponent {
  state = {};

  render() {
    return (
      <Fragment>
        <Card bordered={false}>
          <Row style={{ minHeight: 400 }}>
            <Col span={24}>
              <div>
                <Row gutter={16} style={{ marginBottom: 24 }}>
                  <Col span={24}>
                    <div style={{ lineHeight: 2 }}>
                      <h1 style={{ textAlign: 'center' }}>系统公告</h1>
                      <h2 style={{ textAlign: 'left' }}>尊敬的用户：</h2>
                      <h2 style={{ paddingLeft: 45 }}>欢迎进入运营运维管理系统！</h2>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Card>
      </Fragment>
    );
  }
}
