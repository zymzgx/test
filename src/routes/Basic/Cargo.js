import React from 'react';
import { Table, Input, Popconfirm, Form, Divider, Button, Modal, message, Pagination, Row, Col } from 'antd';
import { connect } from 'dva';
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
      title="新建货物"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="代码">
        {form.getFieldDecorator('code', {
          rules: [{ required: true, message: '请输入代码...' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="货物名称">
        {form.getFieldDecorator('cname', {
          rules: [{ required: true, message: '请输入货物名称...' }],
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

@Form.create()
class Cargo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      editingKey: '',
      modalVisible: false,
    };
    this.columns = [
        {
            title:'代码',
            dataIndex:'code',
            key:'code',
            width: '25%',
            editable: true,
        },
        {
            title:'货物名称',
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
                      <a
                        href="javascript:;"
                        onClick={() => this.handleUpdate(form, record.id)}
                        style={{ marginRight: 8 }}
                      >
                        保存
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                    title="确认取消?"
                    onConfirm={() => this.cancel(record.id)}
                  >
                    <a>取消</a>
                  </Popconfirm>
                </span>
              ) : (
                <span>
                <a onClick={() => this.edit(record.id)}>修改</a>
                <Divider type="vertical" />
                <Popconfirm
                  title="确认删除?"
                  onConfirm={() => this.handleDelete(record.id)}
                >
                <a>删除</a>
                </Popconfirm>   
                </span>
              )}
            </div>
          );
        },
      },
    ];
  }

  onCreateCargo = (params) => {
	const { dispatch } = this.props;
	dispatch({type: 'cargo/createCargo', payload: params});
  };
  onDeleteCargo = (id) => {
	const { dispatch } = this.props;
	dispatch({type: 'cargo/deleteCargo', payload: {id}});
  };
  onUpdateCargo = (params) => {
	const { dispatch } = this.props;
	dispatch({type: 'cargo/updateCargo', payload: params});
  }; 
  onListCargoByPage = (params) => {
	const { dispatch } = this.props;
	dispatch({type: 'cargo/listCargoByPage', payload: params});
  };

  componentDidMount(){
      const params = {pageNo: 1};
      this.onListCargoByPage(params);
  }

  componentWillReceiveProps(nextProps){
  //  this.setState({data: nextProps.dataSource}); 
  }

    // 根据分页查询
    getCargoListByPage = (pageNumber)  => {
        const { form } = this.props;

        form.validateFields((err, fieldsValue) => {
          if (err) return;
    
          const values = {
            ...fieldsValue,
            pageNo: pageNumber,
          };
          this.onListCargoByPage(values);

        });
    }

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    const params = {code: fields.code, cname: fields.cname};
    this.onCreateCargo(params);

    message.success('添加成功');
    this.setState({
      modalVisible: false,

    });
  };

  handleUpdate(form, id) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const params = {id: id, code: row.code, cname: row.cname};
      this.onUpdateCargo(params);

      message.success('修改成功');
      this.setState({ editingKey: '' });
    });
  }   
  
  handleDelete = (id) => {
    this.onDeleteCargo(id);
    
    message.success('删除成功');
    this.setState({ editingKey: '' });
  };

  isEditing = (record) => {
    return record.id === this.state.editingKey;
  };

  edit(key) {
    this.setState({ editingKey: key });
  }

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();

    const params = {pageNo: 1};
    this.onListCargoByPage(params);
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        pageNo: 1,
      };
      this.onListCargoByPage(values);
    });
  };

  renderQueryForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="代码">
              {getFieldDecorator('code')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="货物名称">
                {getFieldDecorator('cname')(<Input placeholder="请输入" />)} 
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

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
      <div>
          <div>{this.renderQueryForm()}</div>
        <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
          新建
        </Button>
        <Table
          components={components}
          bordered
          dataSource={this.props.cargo.items}
          columns={columns}
          rowClassName="editable-row"
          rowKey="id"
          pagination={false}
        />
        <Pagination
            current={Number(this.props.cargo.pageNo)}
            total={Number(this.props.cargo.total)}
            onChange={this.getCargoListByPage}
            style={{float: 'right', marginTop: '20px'}}
          />
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </div>
      );
    }
}
  

export default connect(({ cargo }) => ({cargo}))(Cargo);