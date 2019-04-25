import React from 'react';
import { Upload, Icon, message, Modal } from 'antd';

class PateoUploadImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [],
    };
    const defaultFileList = props.value;
    if (defaultFileList) {
      const files = this.convertValueToFileList(defaultFileList);
      this.state = { fileList: files };
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
    this.setState({
      fileList: nextProps.value ? this.convertValueToFileList(nextProps.value) : [],
    });
  }

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleSize = file => {
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJPG) {
      message.error('只能上传JPG或PNG图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能大于2MB!');
    }
    return isJPG && isLt2M;
  };

  convertValueToFileList = defaultFileList => {
    // 获取图片列表
    const files = [];
    if (defaultFileList !== undefined) {
      defaultFileList.split(';').map((val, index) => {
        files.push({
          uid: index,
          name: val,
          status: 'done',
          url: val,
        });
      });
    }
    // 获取图片列表 end
    return files;
  };

  handleChange = info => {
    const { onUploadSuccess, formItem } = this.props;
    if (info.file.status === 'done') {
      message.success('图片上传成功');
      // 2.读取响应并显示文件链接
      info.fileList.map(file => {
        if (file.response) {
          onUploadSuccess(formItem, file.response.url);
        }
        return file;
      });
    } else if (info.file.status === 'error') {
      message.error('图片服务器不可用');
    } else if (info.file.status === 'removed') {
      message.success('图片删除成功');
      onUploadSuccess(formItem, '');
    }
    this.setState({ fileList: info.fileList });
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const { maxCount, text, otherProps } = this.props;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">{text || '上传照片'}</div>
      </div>
    );
    const domain = 'localhost:8080/';
    const url = '/common/picupload';
    const str = `${domain}${url}`;
    const uploadProps = {
      action: str,
      listType: 'picture-card',
      fileList: this.state.fileList,
      onChange: this.handleChange,
      onPreview: this.handlePreview,
      beforeUpload: this.handleSize,
      accept: 'image/*',
      ...otherProps,
    };
    return (
      <div className="clearfix">
        <Upload {...uploadProps}>
          {fileList && fileList.length >= (maxCount || 1) ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={() => this.setState({ previewVisible: false })}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
export default PateoUploadImage;
