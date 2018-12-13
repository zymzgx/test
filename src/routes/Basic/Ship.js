import React from 'react';
import { Table, Input, Popconfirm, Form, Divider, Button, Modal, message, Pagination, Row, Col, Card, Select, Icon } from 'antd';
import { connect } from 'dva';
import PageheaderLayout from '../../layouts/PageHeaderLayout'
//import EditableCell from '../../components/EditableCell'
//import EditableContext from  '../../components/EditableCell/EditableContext'

import HOST from '../HostConfig';

const { Option } = Select;

function setOptionForSelect (arr) {
  console.log("arr", arr);
  //return null;
  return arr.map( (value, index) => {
    if (value) {
      return <Option value={value.id} key={value.id}>{value.cname}</Option>
    }
  });
}



const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, listNationality } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      title="新建船舶"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="代码">
        {form.getFieldDecorator('code', {
          rules: [{ required: true, message: '请输入代码...' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="中文船名">
        {form.getFieldDecorator('cname', {
          rules: [{ required: true, message: '请输入中文船名...' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="英文船名">
        {form.getFieldDecorator('ename', {
          rules: [{ required: true, message: '请输入英文船名...' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="船籍">
        {form.getFieldDecorator('nationalityID', {
          rules: [{ required: true, message: '请输入船籍...' }],
          })(<Select placeholder="请输入" style={{ width: 295 }}>
          { setOptionForSelect(listNationality) }
        </Select>)}
      </FormItem>
      
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="总吨">
        {form.getFieldDecorator('grossTon', {
          initialValue: 0,  
          rules: [{ required: true, message: '请输入总吨...' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="净吨">
        {form.getFieldDecorator('netTon', {
          initialValue: 0, 
          rules: [{ required: true, message: '请输入净吨...' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="载重吨">
        {form.getFieldDecorator('loadTon', {
          initialValue: 0, 
          rules: [{ required: true, message: '请输入载重吨...' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    if (this.props.inputType === 'select') {
      return  (
        <Select>
          { setOptionForSelect(this.props.listnationality) }
        </Select> );
    }
    return <Input />;
  };

  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
    return (    
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: `Please Input ${title}!`,
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

@Form.create()
class Ship extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      editingKey: '',
      modalVisible: false,
      listNationality: [],
    };
    this.columns = [
        {
            title:'代码',
            dataIndex:'code',
            key:'code',
            width: 100,
            editable: true,
        },
        {
            title:'中文船名',
            dataIndex:'cname',
            key:'cname',
            width: 200,
            editable: true,
        },  
        {
            title:'英文船名',
            dataIndex:'ename',
            key:'ename',
            width: 180,
            editable: true,
        },
        {
            title:'船籍',
            dataIndex:'nationalityID',
            key:'nationalityID',
            width: 120,
            editable: true,
            render(val, record) {
                return <div>{record.nationalityName}</div>;
              },
        },
        /*{
            title:'船籍',
            dataIndex:'nationalityName',
            key:'nationalityName',
            width: 120,
            editable: true,
        },*/
        {
            title:'总吨',
            dataIndex:'grossTon',
            key:'grossTon',
            width: 120,
            editable: true,
        },
        {
            title:'净吨',
            dataIndex:'netTon',
            key:'netTon',
            width: 120,
            editable: true,
        },
        {
            title:'载重吨',
            dataIndex:'loadTon',
            key:'loadTon',
            width: 120,
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

  onCreateShip = (params) => {
	const { dispatch } = this.props;
	dispatch({type: 'ship/createShip', payload: params});
  };
  onDeleteShip = (id) => {
	const { dispatch } = this.props;
	dispatch({type: 'ship/deleteShip', payload: {id}});
  };
  onUpdateShip = (params) => {
	const { dispatch } = this.props;
	dispatch({type: 'ship/updateShip', payload: params});
  }; 
  onListShipByPage = (params) => {
	const { dispatch } = this.props;
	dispatch({type: 'ship/listShipByPage', payload: params});
  };

  onListNationality = () => {
       fetch(`${HOST}/api/nationalities/list`,{  
            credentails: 'include',  
            mode: "cors",  
            headers: {  
                'Accept': 'application/json',  
                'Content-Type': 'application/json;charset=utf-8',
            },                        
        }).then((response)=>{
            if(response.status===200){
                return  response.json()
            }else{
                return null
            }
        })
        .then((json)=>{
          console.log(json);
            if(json)
            this.setState({
                listNationality:json,
            })
        }).catch((error)=>{
            alert(error);
        });

    }

  componentDidMount(){
      const params = {pageNo: 1};
      this.onListShipByPage(params);
      this.onListNationality();
  }

  componentWillReceiveProps(nextProps){
  //  this.setState({data: nextProps.dataSource}); 
  }

    // 根据分页查询
    getShipListByPage = (pageNumber)  => {
        const { form } = this.props;

        form.validateFields((err, fieldsValue) => {
          if (err) return;
    
          const values = {
            ...fieldsValue,
            pageNo: pageNumber,
          };
          this.onListShipByPage(values);

        });
    }

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    let listNationalityId = [];
    this.state.listNationality.map((item)=> listNationalityId.push(item.id));
    const params = {
      code: fields.code,
      cname: fields.cname, 
      ename: fields.ename,
      nationalityID: fields.nationalityID,
      nationalityName: this.state.listNationality[listNationalityId.indexOf(fields.nationalityID.toString())].cname,
      grossTon: fields.grossTon,
      netTon: fields.netTon,
      loadTon: fields.loadTon,
    };
    this.onCreateShip(params);

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
      let listNationalityId = [];
      this.state.listNationality.map((item)=> listNationalityId.push(item.id));
      const params = {
        id: id, 
        code: row.code, 
        cname: row.cname,
        ename: row.ename,
        nationalityID: row.nationalityID,
        nationalityName: this.state.listNationality[listNationalityId.indexOf(row.nationalityID.toString())].cname,
        grossTon: row.grossTon,
        netTon: row.netTon,
        loadTon: row.loadTon,
      };
      this.onUpdateShip(params);

      message.success('修改成功');
      this.setState({ editingKey: '' });
    });
  }   
  
  handleDelete = (id) => {
    this.onDeleteShip(id);
    
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
    this.onListShipByPage(params);
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
      this.onListShipByPage(values);
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
            <FormItem label="中文船名">
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
          inputType: col.dataIndex === 'nationalityID' ? 'select' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),      
          listnationality: this.state.listNationality,    
        }),
      };
    });
  
    return (
      <PageheaderLayout>
        <Card>
          <div>{this.renderQueryForm()}</div>
        <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
          新建
        </Button>
        <Table
          components={components}
          bordered
          dataSource={this.props.ship.items}
          columns={columns}
          rowClassName="editable-row"
          rowKey="id"
          size="small" 
          pagination={false}
        />
        <Pagination
            current={Number(this.props.ship.pageNo)}
            total={Number(this.props.ship.total)}
            onChange={this.getShipListByPage}
            style={{float: 'right', marginTop: '20px'}}
          />
        <CreateForm {...parentMethods} modalVisible={modalVisible} listNationality={this.state.listNationality} />
        </Card>
      </PageheaderLayout>
      );
    }
}
  

export default connect(({ ship }) => ({ship}))(Ship);