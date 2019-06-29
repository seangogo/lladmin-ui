<PateoModalForm
              changeVisible={() => this.setState({ visible: false })}     //控制弹框
              formItems={formItems}                                       //表单元素
              visible={this.state.visible}                                  
              changedFields={this.changedFields}                          //数据修改时调用
              edit={this.state.formedit}
              formData={this.state.formData}                              //修改回显的对象数据
              updateUrl="/formDemo/edit"                                  //修改url
              addUrl="/formDemo/add"                                      //新增url
              dispatch={dispatch}                                         //fetch工具，调用远程
              dateFormatList={['createdDate']}                            //时间key
            />
 动态select:
{
        type: 'select',
        title: '关联车系',
        key: 'seriesName',
        mode: 'combobox',
      },
      
       comboboxDispatchType="basedata/searchSeries"


case 'cascaderTree': {
            return (
              <FormItem {...formItemLayout} label={title} key={key} hasFeedback>
                {componentDecorator(
                  <Cascader
                    options={item.options}
                    expandTrigger="hover"
                    changeOnSelect
                    showSearch
                    placeholder="请选择"
                    displayRender={label => label[label.length - 1]}
                  />
                )}
              </FormItem>
            );
          }
