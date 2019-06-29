import React from 'react';
import { Drawer, Card } from 'antd';
import { OmpIcon } from '@/components/Custom';
import styles from './style.less';

const icons = [
  { x: 'xitongrizhiguanli', y: '系统日志' },
  { x: 'shujuzidianguanli', y: '数据字典' },
  { x: 'pinpai1', y: '品牌管理' },
  { x: 'pinpai', y: '品牌' },
  { x: 'jichushujuguanli', y: '基础数据' },
  { x: 'yunshuzhongwuliu-xianxing', y: '运输、物流' },
  { x: 'baoguofahuo-xianxing', y: '包裹、发货' },
  { x: 'chaibaoguoqujian-xianxing', y: '拆包、取件' },
  { x: 'zitigui-xianxing', y: '自提柜' },
  { x: 'caigou-xianxing', y: '采购' },
  { x: 'shangpin-xianxing', y: '商品' },
  { x: 'peizaizhuangche-xianxing', y: '配载、装车' },
  { x: 'zhiliang-xianxing', y: '质量' },
  { x: 'anquanbaozhang-xianxing', y: '安全、保障' },
  { x: 'cangkucangchu-xianxing', y: '仓库、仓储' },
  { x: 'zhongzhuanzhan-xianxing', y: '中转站' },
  { x: 'kucun-xianxing', y: '库存' },
  { x: 'moduanwangdian-xianxing', y: '末端网点' },
  { x: 'qianshoushenpitongguo-xianxing', y: '签收、审批通过' },
  { x: 'juqianshou-xianxing', y: '拒签收' },
  { x: 'jijianfasong-xianxing', y: '寄件、发送' },
  { x: 'qiyeyuanquwuye-xianxing', y: '企业、园区、物业' },
  { x: 'jiesuan-xianxing', y: '结算' },
  { x: 'jifen-xianxing', y: '积分' },
  { x: 'youhuijuan-xianxing', y: '优惠券' },
  { x: 'ziliaoshouce-xianxing', y: '资料、手册' },
  { x: 'guize', y: '规则' },
  { x: 'danju-xianxing', y: '单据' },
  { x: 'zuzhijiagoujiekou', y: '组织架构、接口' },
  { x: 'chuangjiandanju-xianxing', y: '创建单据' },
  { x: 'zhangdan-xianxing', y: '账单' },
  { x: 'tijikongjian-xianxing', y: '体积、空间' },
  { x: 'yewu-xianxing', y: '业务' },
  { x: 'yingyongchengxu-xianxing', y: '应用程序' },
  { x: 'biaozhun-xianxing', y: '标准' },
  { x: 'quanxianyuechi-xianxing', y: '权限、钥匙' },
  { x: 'ziyuan-xianxing', y: '资源' },
  { x: 'mobankuangjia-xianxing', y: '模板框架' },
  { x: 'xinwenzixun-xianxing', y: '新闻咨询' },
  { x: 'hezuoguanxi-xianxing', y: '合作、关系' },
  { x: 'xianlu', y: '线路' },
  { x: '-fuwu-xianxing', y: '服务' },
  { x: '-kefu-xianxing', y: '客服' },
  { x: '-guoji-xianxing', y: '国际' },
  { x: 'haiguan-xianxing', y: '海关' },
  { x: 'touchengkongyun', y: '头程、空运' },
  { x: 'weicheng', y: '尾程' },
  { x: 'caiwu-xianxing', y: '财务' },
  { x: 'mianfei-xianxing', y: '免费' },
  { x: 'tuikuan', y: '退款' },
  { x: 'jisuanqilishuai-xianxing', y: '计算器、利率' },
  { x: 'checkbox-weixuan', y: '未选中' },
  { x: 'checkbox-xuanzhong', y: '选中' },
  { x: 'sousuo-xianxing', y: '搜索' },
  { x: 'shezhi-xianxing', y: '设置' },
  { x: 'shouye-xianxing', y: '首页' },
  { x: 'wenti-xianxing', y: '问题' },
  { x: 'dianhua-xianxingyuankuang', y: '电话-圆形' },
  { x: 'liaotianduihua-xianxing', y: '聊天、对话' },
  { x: 'dianhua', y: '电话' },
  { x: 'xin-xianxing', y: '信' },
  { x: 'lingdang-xianxing', y: '铃铛' },
  { x: 'laba-xianxing', y: '喇叭' },
  { x: 'maikefeng-xianxing', y: '麦克风' },
  { x: 'shoucang-xianxing', y: '收藏' },
  { x: 'xihuan-xianxing', y: '喜欢' },
  { x: 'shijian-xianxing', y: '时间' },
  { x: 'shengboyuyinxiaoxi', y: '声波、语音消息' },
  { x: 'xiazaidaoru', y: '下载、导入' },
  { x: 'shangchuandaochu', y: '上传、导出' },
  { x: 'baocun-xianxing', y: '保存' },
  { x: 'shanguangdeng', y: '闪光灯' },
  { x: 'shanguangdeng-zidong', y: '闪光灯-自动' },
  { x: 'shanguangdeng-guanbi', y: '闪光灯-关闭' },
  { x: 'yonghu-xianxing', y: '用户' },
  { x: 'jiaosequnti', y: '角色、群体' },
  { x: 'zhucetianjiahaoyou', y: '注册、添加好友' },
  { x: 'renwu', y: '任务' },
  { x: 'zhongwenmoshi', y: '中文模式' },
  { x: 'fujian', y: '附件' },
  { x: 'bianjishuru-xianxing', y: '编辑、输入' },
  { x: 'yingwenmoshi', y: '英文模式' },
  { x: 'jianpan-xianxing', y: '键盘' },
  { x: 'rili', y: '日历' },
  { x: 'weichuqin', y: '未出勤' },
  { x: 'kaoqinchuqin', y: '考勤、出勤' },
  { x: 'paizhao-xianxing', y: '拍照' },
  { x: 'tupian-xianxing', y: '图片' },
  { x: 'saomiao', y: '扫描' },
  { x: 'xianshikejian', y: '显示、可见' },
  { x: 'yincangbukejian', y: '不可见' },
  { x: 'suoding', y: '锁定' },
  { x: 'jiesuo', y: '解锁' },
  { x: 'anzhuangshigong-xianxing', y: '安装、施工' },
  { x: 'shaixuanguolv', y: '筛选过滤' },
  { x: 'zhuxiaoguanji', y: '注销、关机' },
  { x: 'haoping-yuankuang', y: '好评-圆框' },
  { x: 'chaping-yuankuang', y: '差评-圆框' },
  { x: 'chaping', y: '差评' },
  { x: 'haoping', y: '好评' },
  { x: 'liebiaoshitucaidan', y: '列表视图、菜单' },
  { x: 'gonggeshitu', y: '宫格视图' },
  { x: 'Phoneshouji', y: 'Phone手机' },
  { x: 'PCtaishiji', y: 'PC台式机' },
  { x: 'PDAshouchigongzuoshebei', y: 'PDA手持工作设备' },
  { x: 'weizhi-xianxing', y: '位置' },
  { x: 'jiankongshexiangtou-xianxing', y: '监控、摄像头' },
  { x: 'dingwei', y: '定位' },
  { x: 'tuodiantu', y: '拓点图' },
  { x: 'leidatance', y: '雷达、探测' },
  { x: 'baobiao-xianxing', y: '报表' },
  { x: 'bingtu-xianxing', y: '饼图' },
  { x: 'tiaoxingtu-xianxing', y: '条形图' },
  { x: 'zhexiantu-xianxing', y: '折线图' },
  { x: 'zhinanzhidao-xianxing', y: '指南、指导' },
  { x: 'ditu', y: '地图' },
  { x: 'tousu', y: '投诉' },
  { x: 'xunjianjianyan', y: '巡检、检验' },
  { x: 'dianpu-xianxing', y: '店铺' },
  { x: 'kuaidiyuan-xianxing', y: '快递员' },
  { x: 'daikuan-xianxing', y: '贷款' },
  { x: 'huankuan-xianxing', y: '还款' },
  { x: 'tuikuan-xi', y: '退款' },
  { x: 'rili-xianxing-xi', y: '日历' },
  { x: 'jisuanqilishuai-xianxing-xi', y: '计算器、利率' },
  { x: 'yonghuziliao-xianxing', y: '用户资料' },
  { x: 'pifuzhuti-xianxing', y: '皮肤&主题' },
  { x: 'diamond-o', y: '钻石' },
  { x: 'sheji-xianxing', y: '设计' },
  { x: 'kaifa-xianxing', y: '开发' },
  { x: 'yinhangqia-xianxing', y: '银行卡' },
  { x: 'hongbao-xianxing', y: '红包' },
];

const DrawerIcon = ({ drawerVisible, formData, checkIcon, setPropsState }) => (
  <Drawer
    title="请选择菜单图标"
    placement="right"
    closable={false}
    onClose={() => setPropsState({ drawerVisible: false })}
    visible={drawerVisible}
    width={1131}
  >
    <div className="gutter-box">
      <Card bordered>
        <ul className={styles.iconsList}>
          {icons.map(d => (
            <li
              className={d.x === formData.icon ? styles.checkedLi : undefined}
              key={d.x}
              onClick={() => checkIcon(d.x)}
            >
              <OmpIcon key={d.x} type={d.x} style={{ fontSize: 30 }} />
              <span>{d.y}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  </Drawer>
);

export default DrawerIcon;
