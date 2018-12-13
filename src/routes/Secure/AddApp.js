import { Modal,Form,Input,Button } from 'antd'
import React from 'react'

const FormItem = Form.Item;

class AddApp extends React.PureComponent{
    okModal=()=>{
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              this.props.okModal(values);
              this.props.form.resetFields();
            }
        });
    }
     render(){
        const { visible,cancelModal }=this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 6 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 16 },
            },
          };
        const tailFormItemLayout = {
            wrapperCol: {
              xs: {
                span: 24,
                offset: 0,
              },
              sm: {
                span: 16,
                offset: 8,
              },
            },
        };
        
        return(
          <div>
            <Modal
              title="应用信息"
              visible={visible}
              onOk={this.okModal}
              onCancel={cancelModal}
              okText="注册"
              cancelText="取消"
            >
              <Form onSubmit={this.okModal}>
                <FormItem  {...formItemLayout}  label="名称">
                  {getFieldDecorator('name', {
                    rules: [{
                      required: true, message: '请输入应用名称!',
                    }],
                  })(
                    <Input type="name" />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="描述">
                  {getFieldDecorator('description', {
                    rules: [{
                      required: true, message: '请输入描述!',
                    }]})( <Input type="description" />)
                  }
                </FormItem>
              </Form>
            </Modal>
          </div>
        )
    }
}

export default Form.create()(AddApp)