import React from 'react';
import { Table, Input, Popconfirm, Form, Divider, Button, Modal, message, Pagination, Row, Col, Card, Select, Icon, DatePicker } from 'antd';
import { connect } from 'dva';
import PageheaderLayout from '../../layouts/PageHeaderLayout'
import moment from 'moment';
//import EditableCell from '../../components/EditableCell'
//import EditableContext from  '../../components/EditableCell/EditableContext'
import { routerRedux } from 'dva/router';

const { Option } = Select;
const RangePicker = DatePicker.RangePicker;

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
  const { modalVisible, form, handleAdd, handleModalVisible, listShip, listCargo } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      title="新建装船计划"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="开工日期">
        {form.getFieldDecorator('beginDate', {
          rules: [{ required: true, message: '请输入开工日期...' }],
        })(<DatePicker  style={{ width: '100%' }} placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="中文船名">
        {form.getFieldDecorator('shipId', {
          rules: [{ required: true, message: '请输入中文船名...' }],
          })(<Select placeholder="请输入" style={{ width: 295 }}>
          { setOptionForSelect(listShip) }
        </Select>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="货名">
        {form.getFieldDecorator('cargoId', {
          rules: [{ required: true, message: '请输入货名...' }],
          })(<Select placeholder="请输入" style={{ width: 295 }}>
          { setOptionForSelect(listCargo) }
        </Select>)}
      </FormItem>
      
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="货物总量">
        {form.getFieldDecorator('totalWeight', {
          initialValue: 0,  
          rules: [{ required: true, message: '请输入货物总量...' }],
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
    if (this.props.inputType === 'selectShip') {
      return  (
        <Select>
          { setOptionForSelect(this.props.listship) }
        </Select> );
    }
    if (this.props.inputType === 'selectCargo') {
      return  (
        <Select>
          { setOptionForSelect(this.props.listcargo) }
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
class LoadPlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      editingKey: '',
      modalVisible: false,
    };
    this.columns = [
        {
            title:'开工日期',
            dataIndex:'beginDate',
            key:'beginDate',
            width: '18%',
            editable: true,
        },
        {
            title:'中文船名',
            dataIndex:'shipId',
            key:'shipId',
            width: '18%',
            editable: true,
            render(val, record) {
                return <div>{record.shipName}</div>;
            },
            render:(text,record)=>(
              <a onClick={()=>this.ToLoad(record)}>{record.shipName}</a>
            ),
        },  
        {
            title:'货名',
            dataIndex:'cargoId',
            key:'cargoId',
            width: '18%',
            editable: true,
            render(val, record) {
                return <div>{record.cargoName}</div>;
            },
        },
        {
            title:'货物总量',
            dataIndex:'totalWeight',
            key:'totalWeight',
            width: '18%',
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

  onCreateLoadPlan = (params) => {
	const { dispatch } = this.props;
	dispatch({type: 'loadplan/createLoadPlan', payload: params});
  };
  onDeleteLoadPlan = (id) => {
	const { dispatch } = this.props;
	dispatch({type: 'loadplan/deleteLoadPlan', payload: {id}});
  };
  onUpdateLoadPlan = (params) => {
	const { dispatch } = this.props;
	dispatch({type: 'loadplan/updateLoadPlan', payload: params});
  }; 
  onListLoadPlanByPage = (params) => {
	const { dispatch } = this.props;
	dispatch({type: 'loadplan/listLoadPlanByPage', payload: params});
  };

  onListShip = () => {
	const { dispatch } = this.props;
	dispatch({type: 'loadplan/listShip'});
  };
  onListCargo = (params) => {
	const { dispatch } = this.props;
	dispatch({type: 'loadplan/listCargo'});
  };

  ToLoad=(record)=>{
    //console.log('record', record);
    const { dispatch } = this.props;

    dispatch(routerRedux.push(`/work/loadmanage?key=${record.id}`));
  }

  componentDidMount(){
      const params = {pageNo: 1};
      this.onListLoadPlanByPage(params);
      this.onListShip();
      this.onListCargo();
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
    let listShipId = [];
    this.props.loadplan.listShip.map((item)=> listShipId.push(item.id));
    let listCargoId = [];
    this.props.loadplan.listCargo.map((item)=> listCargoId.push(item.id));
    const params = {
      beginDate: fields.beginDate.format('YYYY-MM-DD'),
      shipId: fields.shipId,
      shipName: this.props.loadplan.listShip[listShipId.indexOf(fields.shipId.toString())].cname,
      cargoId: fields.cargoId,
      cargoName: this.props.loadplan.listCargo[listCargoId.indexOf(fields.cargoId.toString())].cname,
      totalWeight: fields.totalWeight,

    };
    this.onCreateLoadPlan(params);

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
      let listShipId = [];
      this.props.loadplan.listShip.map((item)=> listShipId.push(item.id));
      let listCargoId = [];
      this.props.loadplan.listCargo.map((item)=> listCargoId.push(item.id));
      const params = {
        id: id, 
        beginDate: row.beginDate,
        shipId: row.shipId,
        shipName: this.props.loadplan.listShip[listShipId.indexOf(row.shipId.toString())].cname,
        cargoId: row.cargoId,
        cargoName: this.props.loadplan.listCargo[listCargoId.indexOf(row.cargoId.toString())].cname,
        totalWeight: row.totalWeight,
      };
      this.onUpdateLoadPlan(params);

      message.success('修改成功');
      this.setState({ editingKey: '' });
    });
  }   
  
  handleDelete = (id) => {
    this.onDeleteLoadPlan(id);
    
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
    this.onListLoadPlanByPage(params);
  };

  handleSearch = e => {
    e.preventDefault();
    this.handleList(1);
  };

  // 根据分页查询
  getLoadPlanListByPage = (pageNumber)  => {
    this.handleList(pageNumber)
  }

  handleList = (pageNo) => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let beginDate1 = undefined;
      let beginDate2 = undefined;
      if (fieldsValue['beginDate'] && fieldsValue['beginDate'].length > 0) {
        beginDate1 = fieldsValue['beginDate'][0].format('YYYY-MM-DD');
        beginDate2 = fieldsValue['beginDate'][1].format('YYYY-MM-DD');
      }
     
      const values = {
        //...fieldsValue,
        'shipName': fieldsValue.shipName,
        'beginDate1': beginDate1,
        'beginDate2': beginDate2,
        pageNo: pageNo,
      };
      this.onListLoadPlanByPage(values);
    });
  }

  

  renderQueryForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={11} sm={24}>
            <FormItem label="开工日期">
              {getFieldDecorator('beginDate')(
                <RangePicker  style={{ width: '100%' }} placeholder={['请输入', '请输入']} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="中文船名">
                {getFieldDecorator('shipName')(<Input placeholder="请输入" />)} 
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
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
          inputType: col.dataIndex === 'shipId' ? 'selectShip' : (col.dataIndex === 'cargoId' ? 'selectCargo' : 'text'),
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),      
          listship: this.props.loadplan.listShip,    
          listcargo: this.props.loadplan.listCargo, 
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
          dataSource={this.props.loadplan.items}
          columns={columns}
          rowClassName="editable-row"
          rowKey="id"
          size="small" 
          pagination={false}
        />
        <Pagination
            current={Number(this.props.loadplan.pageNo)}
            total={Number(this.props.loadplan.total)}
            onChange={this.getLoadPlanListByPage}
            style={{float: 'right', marginTop: '20px'}}
          />
        <CreateForm {...parentMethods} modalVisible={modalVisible} listShip={this.props.loadplan.listShip} listCargo={this.props.loadplan.listCargo} />
        </Card>
      </PageheaderLayout>
      );
    }
}
  

export default connect(({ loadplan }) => ({loadplan}))(LoadPlan);