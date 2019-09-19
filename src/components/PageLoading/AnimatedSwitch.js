import React from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { Route, Switch } from 'react-router-dom'
import { connect } from 'dva';
import './style.css'

const AnimatedSwitch = props => {
  const { children, loading } = props;
  return (
    <div class='route'>
      <Route
        render={({ location }) => (
          <TransitionGroup>
            <CSSTransition
              timeout={500}
              key={location.key}
              classNames='fade'
              onEntered={(el) => console.log(el)&&console.log('onEntered')}
              onExited={() => {
                console.log('onExited')
              }}
              onExiting={() => {
                console.log('onExiting')
              }}
              OnEntering={() => {
                console.log('entering')
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
