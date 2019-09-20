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
              in={show&&loading}
              timeout={500}
              key={location.key}
              classNames='fade'
              exit
              unmountOnExit
              onEnter={(node, isAppearing)=>{
                console.log('node');
                console.log(node)
                console.log('isAppearing')
                console.log(isAppearing)
              }}
              onEntering={(node, isAppearing) => {
                console.log('entering11')
              }}
              onExiting={() => {console.log('onExiting222')}}
              onEntered={(node, isAppearing) => {
                console.log(node,isAppearing)
                console.log('onEntered3333')
                setShow(false)
              }}
              onExited={() => {
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
