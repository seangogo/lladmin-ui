import React from 'react'
import { SwitchTransition,TransitionGroup, CSSTransition } from 'react-transition-group'
import { Route, Switch } from 'react-router-dom'
import { connect } from 'dva';
import { Spin } from 'antd';
import styles from './style.less';

const { useState } =React;
const AnimatedSwitch = props => {
  const [ show, setShow] = useState(false);

  const { children, loading } = props;
  console.log(show);
  return (
    <div className={styles.route}>
      <Spin
        spinning={show}
        size="large"
        style={{margin: 'auto', width: '100%'}}
      >
        <Route
          render={({ location,match }) => (
            <SwitchTransition>
              <CSSTransition
                appear
                in={show}
                timeout={300}
                key={location.key}
                classNames='fade'
                unmountOnExit
                onEnter={(node, isAppearing)=>{
                  console.log('match')
                  console.log(match)
                  console.log(show);
                  console.log('node');
                  console.log('开始进入。。。');
                  console.log(node)
                  console.log(isAppearing)
                  console.log('isAppearing')
               }}
                onEntering={(node, isAppearing) => {
                  setShow(false)
                  console.log(show);
                  console.log('进入中。。。');
                  console.log('entering11')
                  console.log('onEntering-node')
                  console.log(node)
                  console.log(isAppearing)
                }}
                onExit={(node) => {
                  console.log(show);
                  console.log(node);
                  console.log('退出之前')
                  console.log('onExiting？？？')
                }}
                onExiting={(node) => {
                  setShow(true)
                  console.log(show);
                  console.log(node);
                  console.log('退出中....')
                  console.log('onExiting222')
                }}
                onEntered={(node, isAppearing) => {
                  console.log(show);
                  console.log('进入完成....')
                  console.log(node,isAppearing)
                  console.log('onEntered3333')
                }}
                onExited={(node) => {
                  console.log(show);
                  console.log(node);
                  console.log('退出完成....')
                  console.log('onExited444')

                }}
              >
                <Switch location={location}>{children}</Switch>
              </CSSTransition>
            </SwitchTransition>
          )}
        />
      </Spin>
    </div>
  )
}
export default connect(({ loading }) => ({
  loading: loading.global,
}))(AnimatedSwitch);
