import { Table, Input, InputNumber, Popconfirm, Form, Divider, Button, Modal, message, Card, Icon } from 'antd';
import React from 'react'
import { connect } from 'dva'
import PageheaderLayout from '../../layouts/PageHeaderLayout'
import EditableCell from '../../components/EditableCell'
import EditableContext from  '../../components/EditableCell/EditableContext'

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      title="新建国籍"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="代码">
        {form.getFieldDecorator('code', {
          rules: [{ required: true, message: '请输入代码...' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="国籍名称">
        {form.getFieldDecorator('cname', {
          rules: [{ required: true, message: '请输入国籍名称...' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

const FormItem = Form.Item;
//const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class Nationality extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
    //  data: props.dataSource, 
      editingKey: '',
      modalVisible: false,
    };
    this.columns = [
        /*{
            title:'ID',
            dataIndex:'id',
            key:'id',
            width: '25%',
            editable: true,
        },*/
        {
            title:'代码',
            dataIndex:'code',
            key:'code',
            width: '25%',
            editable: true,
        },
        {
            title:'国籍名称',
            dataIndex:'cname',
            key:'cname',
            width: '50%',
            editable: true,
        },  
      
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a onClick={() => this.handleUpdate(form, record.id)} >
                         <Icon type="check" style={{color:'green'}} />
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Divider type="vertical" />
                  <Popconfirm
                    title="确定要取消吗？"
                    onConfirm={() => this.cancel(record.id)} >
                    <a><Icon type="close" style={{color:'red'}} /></a>
                  </Popconfirm>
                </span>
              ) : (
                <span>
                  <a onClick={() => this.edit(record.id)}><Icon type="edit" /></a>
                  <Divider type="vertical" />
                  <Popconfirm
                    title="确定要删除吗？"
                    onConfirm={() => this.handleDelete(record.id)} >
                    <a><Icon type="delete" /></a>
                  </Popconfirm>   
                </span>
              )}
            </div>
          );
        },
      },
    ];
  }

  componentDidMount(){
    const { dispatch } = this.props;
   
    dispatch({
        type:'nationality/fetchBasic',
        payload:{},
    })
  }

  componentWillReceiveProps(nextProps){
  //  this.setState({data: nextProps.dataSource}); 

  
  }

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'nationality/add',
      payload: {
        code: fields.code,
        cname: fields.cname,
      },
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
      //data: this.state.data + this.props.dataSource
    });
  };

  //修改数据
  handleUpdate(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }

      const { dispatch } =  this.props;
      dispatch({
        type: 'nationality/update',
        payload: {id: key, code: row.code, cname: row.cname},
      });

      message.success('修改成功');
      this.setState({ editingKey: '' });
    });
  }

  handleDelete(key) {
    const { dispatch } =  this.props;
    dispatch({
      type: 'nationality/remove',
      payload: {id : key},
    });

    message.success('删除成功');
    this.setState({ editingKey: '' });
  }         

  isEditing = (record) => {
    return record.id === this.state.editingKey;
  };

  edit(key) {
    this.setState({ editingKey: key });
  }

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  render() {
    const { modalVisible } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
  
    return (
      <PageheaderLayout>
        <Card>
        <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
          新建
        </Button>
        <Table
          components={components}
          bordered
          dataSource={this.props.dataSource}
          columns={columns}
          rowClassName="editable-row"
          rowKey="id"
          size="small" 
        />
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        </Card>
      </PageheaderLayout>
      );
    }
  }
  
  export default connect(({nationality, loading})=>({
    dataSource:nationality.dataSource, loading:loading.effects['nationality/fetchBasic'],
  }))(Nationality);
  