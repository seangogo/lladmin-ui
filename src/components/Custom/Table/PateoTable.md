Table 公共组件参数(*=常用,-=一般，~ :不常用，)

showSizeChanger  是否可以切换分页条数
showQuickJumper 是否显示快速跳转指定页码
Column 
列描述数据对象  columns 中的一项，Column 使用相同的 API
Sorter 
排序函数，需要服务端排序可设为 true
sortOrder
排序的受控属性，外界可用此控制列的排序，可设置为 'ascend' 'descend' false


Column
Title           列头显示文字                   string|ReactNode
Width         列宽度                              string|number
onFilter      本地模式下，确定筛选的运行函数  Function
onHeaderCell  设置头部单元格属性      function(visible) {}
onFilterDropdownVisibleChange
自定义筛选菜单可见变化时调用          Function(column)
Render        Function(text, record, index) {}
生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引，@return里面可以设置表格行/列合并
Key     string
React 需要的 key，如果已经设置了唯一的 dataIndex，可以忽略这个属性
Fixed    boolean|string 
是否固定，可选 true(等效于 left) 'left' 'right'
Filters  表头的筛选菜单项    object[]
~filterMultiple 是否多选  Boolean
filterIcon   自定义 fiter 图标    ReactNode
filteredValue    string[]
筛选的受控属性，外界可用此控制列的筛选状态，值为已筛选的 value 数组
Filtered   Boolean  false
标识数据是否经过过滤，筛选图标会高亮
filterDropdownVisible    boolean
用于控制自定义筛选菜单是否可见
filterDropdown     ReactNode
可以自定义筛选菜单，此函数只负责渲染图层，需要自行编写各种交互
dataIndex   string
列数据在数据项中对应的 key，支持 a.b.c 的嵌套写法
colSpan 表头列合并,设置为 0 时，不渲染  number
className 列的 className  string
      columns, // 列
      rowKey: record => record.id, // key
      // indentSize: 0, 展示树形数据时，每层缩进的宽度，以 px 为单位
      // scroll: { y: 500 }, // 高度
      // bordered: true, // 边框
      // expandRowByClick: true, // 点击展开
      loading, // 控制加载
      expandedRowKeys: this.state.expandedRowKeys,
      onExpandedRowsChange:
        (keys) => { this.setState({ expandedRowKeys: [keys[keys.length - 1]] }); },
      dataSource: list, // 远程数据
      pagination: paginationProps, // 分页
      rowSelection,
      selectedRows: this.state.selectedRowKeys,

// indentSize: 0, 展示树形数据时，每层缩进的宽度，以 px 为单位
      // scroll: { y: 500 }, // 高度
      // bordered: true, // 边框
      // expandRowByClick: true, // 点击展开
 expandedRowKeys: this.state.expandedRowKeys,
            onExpandedRowsChange:
              (keys) => { this.setState({ expandedRowKeys: [keys[keys.length - 1]] }); },
