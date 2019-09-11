import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Tabs, Form, Button, Input, Icon  } from 'antd';
import styles from './index.less';

const { TabPane } = Tabs;
const { Item } = Form;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

@connect(({ coder, loading }) => ({
  coder,
  loading: loading.effects['coder/generatorBySQL'],
}))
@Form.create()
class coder extends PureComponent {
  state = {
  };

  generatorCode = () => {
   const { form: { getFieldsValue }, dispatch} =this.props;
   const params = {
     tableSql:"CREATE TABLE `auth_brand` (\n `sid` varchar(36) NOT NULL,\n `create_by` varchar(255) DEFAULT NULL,\n `created_dt` datetime DEFAULT NULL,\n `del_flg` int(11) DEFAULT NULL,\n `update_by` varchar(36) DEFAULT NULL,\n `updated_dt` datetime DEFAULT NULL,\n `version` int(11) DEFAULT NULL,\n `code` varchar(20) DEFAULT NULL,\n `logo` varchar(255) DEFAULT NULL,\n `name` varchar(255) DEFAULT NULL,\n `remark` varchar(255) DEFAULT NULL,\n PRIMARY KEY (`sid`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8"
   };
   dispatch({ type: 'coder/generatorBySQL', payload: params });
  };

  render() {
    const { form: { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched }, coder } = this.props;
    console.log(coder.SQLResult);
    return (
      <Fragment>
        <div className={styles['card-container']}>
          <Tabs type="card">
            <TabPane tab="SQL代码生成" key="1">
              <h2>Spring Boot Code Generator!</h2>
              <p className="lead">
                基于
                <code>SpringBoot2</code>+<code>Freemarker</code>的代码生成器，用<code>DDL
                SQL</code>语句生成<code>JPA</code>/<code>JdbcTemplate</code>/<code>Mybatis</code>/<code>BeetlSQL</code>相关代码，支持<code>mysql</code>/<code>oracle</code>/<code>pgsql</code>三大数据库。以<code>释放双手</code>为目的，各大模板也在陆续补充和优化。欢迎大家多多提交模板和交流想法，如果发现有SQL语句不能识别，请<a
                href="https://github.com/moshowgame/SpringBootCodeGenerator/issues">留言</a>给我分析，谢谢！
              </p>
              <div>
                <Form  onSubmit={this.handleSearch} style={{backgroundColor: '#f0f2f5'}}>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item label="创建者" {...formItemLayout}>
                        {getFieldDecorator("creator", {
                          rules: [{
                            required: true,
                            message: 'Input something!',
                          }],
                        })(
                          <Input placeholder="placeholder" />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                    <Form.Item label="包路径" {...formItemLayout}>
                      {getFieldDecorator("packPath", {
                        rules: [{
                          required: true,
                          message: 'Input something!',
                        }],
                      })(
                        <Input placeholder="placeholder" />
                      )}
                    </Form.Item>
                  </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={20}>
                      <Form.Item
                        label="建表SQL"
                        labelCol={{
                          xs: { span: 24 },
                          sm: { span: 2 },
                        }}
                      wrapperCol={{
                        xs: { span: 24 },
                        sm: { span: 20 },
                      }}
                      >
                        {getFieldDecorator("SQL", {
                          rules: [{
                            required: true,
                            message: 'Input something!',
                          }],
                        })(
                          <TextArea
                            rows={4}
                            placeholder="CREATE TABLE `userinfo` (
                            `user_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
                            `username` varchar(255) NOT NULL COMMENT '用户名',
                            `addtime` datetime NOT NULL COMMENT '创建时间',
                            PRIMARY KEY (`user_id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户信息'"
                          />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Button onClick={this.generatorCode}> 开始生成 </Button>
                </Form>
              </div>
            </TabPane>
            <TabPane tab="JPA自定义生成" key="2">
              <p>Content of Tab Pane 2</p>
              <p>Content of Tab Pane 2</p>
              <p>Content of Tab Pane 2</p>
            </TabPane>
          </Tabs>
        </div>
      </Fragment>
    );
  }
}
export default coder;
