import React from 'react';
import { Upload, Button, Icon, message } from 'antd';

class PateoUploadFile extends React.Component {
  state = {
    fileList: [
      {
        uid: -1,
        name: 'xxx.png',
        status: 'done',
        url: 'http://www.baidu.com/xxx.png',
      },
    ],
  };

  handleChange = info => {
    const { onFileUploadSuccess, formItem, maxCount = 1 } = this.props;
    if (info.file.status === 'done') {
      message.success('文件上传成功');
      // 2.读取响应并显示文件链接
      info.fileList.map(file => {
        if (file.response) {
          file.url = file.response.url;
          onFileUploadSuccess(formItem, file.url);
        }
        return file;
      });
    } else if (info.file.status === 'error') {
      message.error('图片服务器不可用');
    } else if (info.file.status === 'removed') {
      message.success('图片删除成功');
      onFileUploadSuccess(formItem, '');
    }
    this.setState({ fileList: info.fileList.slice(0 - maxCount) });
  };

  render() {
    const domain = 'localhost:8080/';
    const url = '/common/picupload';
    const str = `${domain}${url}`;
    const props = {
      action: str,
      onChange: this.handleChange,
      multiple: true,
    };
    return (
      <Upload {...props} fileList={this.state.fileList}>
        <Button>
          <Icon type="upload" /> 上传
        </Button>
      </Upload>
    );
  }
}
export default PateoUploadFile;
