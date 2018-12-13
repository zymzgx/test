import React from 'react'
import { Modal,Form,Input,Select,Button } from 'antd'

const FormItem = Form.Item;
const { Option } = Select;

class AddUser extends React.PureComponent{
    constructor(props){
        super(props)
        this.state={
            confirmDirty:false,
        }
    }
    okModal=()=>{
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              this.props.okModal(values);
              this.props.form.resetFields();
            }
        });
    }
     handleConfirmBlur = (e) => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
      }
      compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) {
          callback('两次输入的密码不同!');
        } else {
          callback();
        }
      }
      validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
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
          const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
          })(
            <Select style={{ width: 70 }}>
              <Option value="86">+86</Option>
              <Option value="87">+87</Option>
            </Select>
          );
        
        return(
          <div>
            <Modal
              title="用户信息"
              visible={visible}
              onOk={this.okModal}
              onCancel={cancelModal}
              okText="注册"
              cancelText="取消"
            >
              <Form onSubmit={this.okModal}>
                <FormItem {...formItemLayout} label="账号">
                  {getFieldDecorator('username', {
                    rules: [{
                      required: true, message: '请输入账号!',
                    }]})( <Input />)
                  }
                </FormItem>
                <FormItem  {...formItemLayout}  label="密码">
                  {getFieldDecorator('password', {
                    rules: [{
                      required: true, message: '请输入密码!',
                    }, {
                      validator: this.validateToNextPassword,
                    }],
                    })(
                      <Input type="password" />
                  )}
                </FormItem>
                <FormItem  {...formItemLayout} label="确认密码">
                  {getFieldDecorator('confirm', {
                    rules: [{
                      required: true, message: '请输入确认密码!',
                    }, {
                      validator: this.compareToFirstPassword,
                    }],
                    })(
                      <Input type="password" onBlur={this.handleConfirmBlur} />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="全名">
                  {getFieldDecorator('fullName', {
                    rules: [{
                      required: true, message: '请输入全名!',
                    }]})( <Input />)
                  }
                </FormItem>
                <FormItem {...formItemLayout} label="手机号码">
                  {getFieldDecorator('mobile', {
                    rules: [{
                      required: true, message: '请输入手机号码!',
                        }]})( <Input addonBefore={prefixSelector} style={{ width: '100%' }} />)
                  }
                </FormItem>
                <FormItem {...formItemLayout} label="邮箱">
                  {getFieldDecorator('email', {
                    rules: [
                      {
                        type: 'email', message: '请输入正确的邮件格式!',
                      },{
                        required: true, message: '请输入邮件!',
                      }]})( <Input />)
                  }
                </FormItem>
              </Form>
            </Modal>
          </div>
        )
    }
}

export default Form.create()(AddUser)