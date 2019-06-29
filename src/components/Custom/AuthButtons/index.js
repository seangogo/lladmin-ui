import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Popconfirm, Divider } from 'antd';

class AuthButtons extends PureComponent {
  static contextTypes = {
    authButton: PropTypes.array,
  };

  render() {
    const { authStr, btns } = this.props;
    // const isAuth = this.context.authButton.includes(authStr);
    const authButtons = btns.map(
      (item, index) =>
        item.Popconfirm ? (
          <span key={item.key}>
            {index !== 0 ? <Divider type="vertical" /> : null}
            <Popconfirm key={item.key} title={item.message} onConfirm={item.onConfirm}>
              <a key={item.key}>{item.title}</a>
            </Popconfirm>
          </span>
        ) : (
          <span key={item.key}>
            {index !== 0 ? <Divider type="vertical" /> : null}
            <a key={item.key} onClick={item.onConfirm}>
              {item.title}
            </a>
          </span>
        )
    );
    return authButtons;
  }
}

export default AuthButtons;
