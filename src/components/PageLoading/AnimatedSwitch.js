import React from 'react'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import { Route, Switch } from 'react-router-dom'
import styles from './style.less';

const AnimatedSwitch = props => {

  const { children } = props;
  return (
    <div className={styles.route}>
      <Route
        render={({ location, match }) => (
          <SwitchTransition>
            <CSSTransition
              appear
              in={match != null}
              timeout={{
                appear: 500,
                enter: 500,
                exit: 300,
              }}
              key={location.key}
              classNames='fade'
              mountOnExit
            >
              <Switch location={location} children={children} />
            </CSSTransition>
          </SwitchTransition>
        )}
      />
    </div>
  )
};
export default AnimatedSwitch
