import React from 'react';
import { Layout } from 'antd';
import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import NProgress from 'nprogress';
import pathToRegexp from 'path-to-regexp';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import { Switch, Route } from 'react-router-dom';
import { formatMessage } from 'umi/locale';
import SiderMenu from '@/components/SiderMenu';
import SettingDrawer from '@/components/SettingDrawer';
import Home from '../pages/home';
import Info from '../pages/Account/Settings/BaseView';
import Center from '../pages/Account/Center/Center';
import logo from '../assets/menu-logo.png';
import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';
import { E403, E404, E500 } from '../pages/Exception';
import { dynamicRoute, dynamicModels } from '../utils/utils';
import { storageClear } from '../utils/helper';
import { getToken } from '@/utils/auth';
import AnimatedSwitch from '@/components/PageLoading/AnimatedSwitch';
import styles from './basicLayout.less';

const { Content } = Layout;
let lastHref;
// 转换路由器到菜单
function formatter(data, parentPath = '', parentAuthority, parentName) {
  return data.map(item => {
    let locale = 'menu';
    if (parentName && item.path) {
      locale = `${parentName}.${item.path}`;
    } else if (item.path) {
      locale = `menu.${item.path}`;
    } else if (parentName) {
      locale = parentName;
    }
    const result = {
      ...item,
      locale,
      path: `/${parentPath}${item.path}`,
      code: `${item.path}`,
      authority: item.authority || parentAuthority,
    };
    if (item.children.length > 0) {
      // 减少内存使用
      result.children = formatter(
        item.children,
        `${parentPath}${item.path}/`,
        item.authority,
        locale
      );
    }
    // delete result.children;
    return result;
  });
}

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.getBreadcrumbNameMap = memoizeOne(this.getBreadcrumbNameMap, isEqual);
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
  }

  state = {
    rendering: true,
    isMobile: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    if (getToken()) {
      dispatch({ type: 'login/fetchCurrent' });
    } else {
      dispatch(routerRedux.push('/guest/login'));
      storageClear();
    }
    dispatch({
      type: 'setting/getSetting',
    });
    this.renderRef = requestAnimationFrame(() => {
      this.setState({
        rendering: false,
      });
    });
    this.enquireHandler = enquireScreen(mobile => {
      const { isMobile } = this.state;
      if (isMobile !== mobile) {
        this.setState({
          isMobile: mobile,
        });
      }
    });
  }

  componentDidUpdate(preProps) {
    // 切换到手机模式后,如果折叠为true，则需要单击两次才能显示
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
    const { isMobile } = this.state;
    const { user, dispatch } = preProps;
    const {
      collapsed,
      user: { menuInfo },
    } = this.props;
    if (isMobile && !preProps.isMobile && !collapsed) {
      this.handleMenuCollapse(false);
    }
    if (!getToken()) {
      dispatch(routerRedux.push('/guest/login'));
      storageClear();
    }
    if (menuInfo && user.menuInfo !== menuInfo) {
      dynamicModels(menuInfo.children);
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.renderRef);
    unenquireScreen(this.enquireHandler);
  }

  getContext() {
    const { location } = this.props;
    return {
      location,
      breadcrumbNameMap: this.breadcrumbNameMap,
    };
  }

  getMenuData() {
    const {
      user: {
        menuInfo: { children },
      },
    } = this.props;
    return formatter(children);
  }

  /**
   * 获取面包屑映射
   */
  getBreadcrumbNameMap() {
    const routerMap = {};
    const mergeMenuAndRouter = data => {
      data.forEach(menuItem => {
        if (menuItem.children) {
          mergeMenuAndRouter(menuItem.children);
        }
        // 减少内存使用
        routerMap[menuItem.path] = menuItem;
      });
    };
    const data = this.getMenuData();
    mergeMenuAndRouter(data);
    return routerMap;
  }

  getPageTitle = pathname => {
    let currRouterData = null;
    // 匹配参数路径
    Object.keys(this.breadcrumbNameMap).forEach(key => {
      if (pathToRegexp(key).test(pathname)) {
        currRouterData = this.breadcrumbNameMap[key];
      }
    });
    if (!currRouterData) {
      return 'lladmin';
    }
    const message = formatMessage({
      id: currRouterData.locale || currRouterData.name,
      defaultMessage: currRouterData.name,
    });
    return `${message} - lladmin`;
  };

  getLayoutStyle = () => {
    const { isMobile } = this.state;
    const { fixSiderbar, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px',
      };
    }
    return null;
  };

  getContentStyle = () => {
    const { fixedHeader } = this.props;
    return {
      margin: '24px 24px 0',
      paddingTop: fixedHeader ? 64 : 0,
      position: 'relative',
    };
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  renderSettingDrawer() {
    const { rendering } = this.state;
    if ((rendering || process.env.NODE_ENV === 'production') && APP_TYPE !== 'site') {
      return null;
    }
    return <SettingDrawer />;
  }

  render() {
    const {
      loading,
      globalLoading,
      navTheme,
      layout: PropsLayout,
      user: {
        menuInfo: { children },
      },
      location: { pathname },
    } = this.props;
    const { href } = window.location;
    if (lastHref !== href) {
      NProgress.start();
      if (!globalLoading) {
        NProgress.done();
        lastHref = href;
      }
    }
    const { isMobile } = this.state;
    const isTop = PropsLayout === 'topmenu';
    const menuData = this.getMenuData();
    const layout = (
      <Layout>
        {isTop && !isMobile && menuData.length > 0 ? null : (
          <SiderMenu
            logo={logo}
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            menuData={menuData}
            isMobile={isMobile}
            {...this.props}
          />
        )}
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
          }}
        >
          <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            logo={logo}
            isMobile={isMobile}
            {...this.props}
          />
          <Content style={this.getContentStyle()}>
            {loading === false && (
              <AnimatedSwitch>
                <Route exact path="/home" component={Home} />
                <Route exact path="/userInfo" component={Info} />
                <Route exact path="/userCenter" component={Center} />
                <Route exact path="/exception403" component={E403} />
                <Route exact path="/exception405" component={E500} />
                {dynamicRoute(children)}
                <Route component={E404} />
              </AnimatedSwitch>
            )}
          </Content>
          <Footer />
        </Layout>
      </Layout>
    );
    return (
      <React.Fragment>
        <DocumentTitle title={this.getPageTitle(pathname)}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
        {this.renderSettingDrawer()}
      </React.Fragment>
    );
  }
}

export default connect(({ loading, global, setting, login }) => ({
  user: login.user,
  collapsed: global.collapsed,
  layout: setting.layout,
  loading: loading.models.login,
  globalLoading: loading.global,
  ...setting,
}))(BasicLayout);
