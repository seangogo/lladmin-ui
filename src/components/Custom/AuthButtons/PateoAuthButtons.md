 const btns = [
            {
              key: '修改', 
              onConfirm: () => this.setState({ formData: record, visible: true }),
            }, {
              key: '删除',
              title: '是否要删除此行',
              Popconfirm: true,
              onConfirm: () => this.handleDeleteDate.bind(this)(record.id),
            },
          ]
      //所有按钮集合 
        btns
        key 按键显示的文字
        onConfirm 点击触发事件
        Popconfirm ：是否有确认框
        title：确认框提示信息
  
return <PateoAuthButtons authStr="project_edit" btns={btns} />;
    //操作权限字符串 authStr

 static contextTypes = {
    authButton: PropTypes.array,
  };
  const isAuth = this.context.authButton.includes(authStr);
  // authStr = 按钮的权限字符串
  //获取登陆的权限按钮数组 得出是否显示按钮
