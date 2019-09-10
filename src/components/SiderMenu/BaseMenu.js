import React, { PureComponent } from 'react';
import { Menu } from 'antd';
import Link from 'umi/link';
import { formatMessage } from 'umi/locale';
import pathToRegexp from 'path-to-regexp';
import { urlToList } from '../_utils/pathTools';
import { OmpIcon } from '@/components/Custom';
import styles from './index.less';

const { SubMenu } = Menu;

//   允许菜单。js config图标作为string或React节点
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = icon => {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return <img src={icon} alt="icon" className={styles.icon} />;
  }
  if (typeof icon === 'string') {
    return <OmpIcon type={icon} className={`${styles.icon} sider-menu-item-img`} />;
  }
  return icon;
};

export const getMenuMatches = (flatMenuKeys, path) =>
  flatMenuKeys.filter(item => item && pathToRegexp(item).test(path));

export default class BaseMenu extends PureComponent {
  constructor(props) {
    super(props);
    // this.flatMenuKeys = this.getFlatMenuKeys(props.menuData);
  }

  /**
   * Recursively flatten the data
   * [{path:string},{path:string}] => {path,path2}
   * @param  menus
   */
  getFlatMenuKeys(menus) {
    let keys = [];
    menus.forEach(item => {
      if (item.children) {
        keys = keys.concat(this.getFlatMenuKeys(item.children));
      }
      keys.push(item.path);
    });
    return keys;
  }

  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = (menusData, parent) => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => {
        // make dom
        const ItemDom = this.getSubMenuOrItem(item, parent);
        return this.checkPermissionItem(item.authority, ItemDom);
      })
      .filter(item => item);
  };

  // 获取当前选中的菜单
  getSelectedMenuKeys = () => {
    const {
      location: { pathname },
    } = this.props;
    // .map(itemPath => getMenuMatches(this.flatMenuKeys, itemPath).pop())
    return urlToList(pathname);
  };

  /**
   * 获取子菜单或项
   */
  getSubMenuOrItem = item => {
    // doc: add hideChildrenInMenu
    if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
      // const name = formatMessage({ id: item.locale });
      return (
        <SubMenu
          title={
            item.icon ? (
              <span>
                {getIcon(item.icon)}
                <span style={{ verticalAlign: "middle" }}>{item.name}</span>
              </span>
            ) : (
              item.name
            )
          }
          key={item.path}
        >
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    }
    return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;
  };

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = item => {
    // const name = formatMessage({ id: item.locale });
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon);
    const { target } = item;
    // 是http链接吗
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{item.name}</span>
        </a>
      );
    }
    const { location, isMobile, onCollapse } = this.props;
    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === location.pathname}
        onClick={
          isMobile
            ? () => {
                onCollapse(true);
              }
            : undefined
        }
      >
        {icon}
        <span>{item.name}</span>
      </Link>
    );
  };

  // 权限检查
  checkPermissionItem = (authority, ItemDom) => {
    const { Authorized } = this.props;
    if (Authorized && Authorized.check) {
      const { check } = Authorized;
      return check(authority, ItemDom);
    }
    return ItemDom;
  };

  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };

  render() {
    const { openKeys, theme, mode } = this.props;
    // 如果路径名不能匹配，使用最近的父键
    let selectedKeys = this.getSelectedMenuKeys();
    if (!selectedKeys.length && openKeys) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }
    let props = {};
    if (openKeys) {
      props = {
        openKeys,
      };
    }
    const { handleOpenChange, style, menuData } = this.props;
    return (
      <Menu
        key="Menu"
        mode={mode}
        theme={theme}
        onOpenChange={handleOpenChange}
        selectedKeys={selectedKeys}
        style={style}
        {...props}
      >
        {this.getNavMenuItems(menuData)}
      </Menu>
    );
  }
}
