import React from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { Route, Switch } from 'react-router-dom'
import { connect } from 'dva';
import styles from './style.less';

const { useState } =React;
const AnimatedSwitch = props => {
  const [ show, setShow] = useState(false);

  const { children, loading } = props;
  return (
    <div className={styles.route}>
      <Route
        render={({ location }) => (
          <TransitionGroup>
            <CSSTransition
              in={loading}
              timeout={{
                enter: 600,
                exit: 600,
              }}
              key={location.key}
              classNames='fade'
              className={styles.fade}
              exit
              onEnter={(node, isAppearing)=>{
                console.log(show);
                console.log('node');
                console.log('开始进入。。。');
                console.log(node)
                console.log(isAppearing)
                console.log('isAppearing')
             }}
              onEntering={(node, isAppearing) => {
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
                console.log(show);
                console.log(node);
                console.log('退出中....')
                console.log('onExiting222')
              }}
              onEntered={(node, isAppearing) => {
                setShow(false)
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
                setShow(true)
              }}
            >
              <Switch location={location}>{children}</Switch>
            </CSSTransition>
          </TransitionGroup>
        )}
      />
    </div>

  )
}
export default connect(({ loading }) => ({
  loading: loading.global,
}))(AnimatedSwitch);
