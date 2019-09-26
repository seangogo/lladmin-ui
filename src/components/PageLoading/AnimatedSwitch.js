import React from 'react'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import { Route, Switch } from 'react-router-dom'
import { Spin } from 'antd';
import styles from './style.less';

const { useState } =React;
const AnimatedSwitch = props => {
  const [ show, setShow] = useState(false);

  const { children } = props;
  return (
    <div className={styles.route}>
      {/*<Spin*/}
        {/*spinning={show}*/}
        {/*size="large"*/}
        {/*style={{margin: 'auto', width: '100%'}}*/}
      {/*>*/}
        <Route
          render={({ location, match }) => (
            <SwitchTransition>
              <CSSTransition
                appear
                in={show}
                timeout={{
                  appear: 500,
                  enter: 500,
                  exit: 300,
                }}
                key={location.key}
                classNames='fade'
                mountOnExit
                onEntering={() => {
                  setShow(false)
                }}
                onExiting={() => {
                  setShow(true)
                }}
              >
                <Switch location={location}>{children}</Switch>
              </CSSTransition>
            </SwitchTransition>
          )}
        />
      {/*</Spin>*/}
    </div>
  )
}
export default AnimatedSwitch
