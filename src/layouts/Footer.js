import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import styles from './footer.less'

const FooterView = () => (
  <div className={styles['main-footer']}>
    <Fragment>
      <span>
        © 2019 Xiao Jun
        <a href="http://www.apache.org/licenses/LICENSE-2.0">
          Apache License 2.0
        </a>
      </span>
      <span> ⋅ </span>
      <a href="http://www.beian.miit.gov.cn">
        浙ICP备xxxxxxx号
      </a>
    </Fragment>
  </div>
);
export default FooterView;
