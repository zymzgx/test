import { Input, InputNumber, Card, Button,Table,message,Form,Icon,Popconfirm, Select, Modal, Divider, DatePicker, TimePicker, Pagination, Row, Col } from 'antd'
import React from 'react'
import { connect } from 'dva';
//import EditableCell from '../../components/EditableCell'
//import EditableContext from '../../components/EditableCell/EditableContext'
import styles from './LoadCar.less';
import moment from 'moment';

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
          <Option value={1}>00:00-08:00</Option>
          <Option value={2}>08:00-18:00</Option>
          <Option value={3}>18:00-24:00</Option>
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

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, listCargo } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      title="新建装车工班作业动态"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="开工日期">
        {form.getFieldDecorator('beginDate', {
          rules: [{ required: true, message: '请输入开工日期...' }],
        })(<DatePicker  style={{ width: '100%' }} placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="班次">
        {form.getFieldDecorator('classNo', {
          rules: [{ required: true, message: '请输入班次...' }],
        })(<Select placeholder="请输入" style={{ width: 235 }}>
        <Option value="1">00:00-08:00</Option>
        <Option value="2">08:00-18:00</Option>
        <Option value="3">18:00-24:00</Option>
      </Select>)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="本班次作业次序">
        {form.getFieldDecorator('orders', {
          initialValue: 1,  
          rules: [{ required: true, message: '请输入本班次作业次序...' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="首条皮带起动时刻">
        {form.getFieldDecorator('fristBucketTime', {
          initialValue: moment('00:00', 'HH:mm'),
          rules: [{ required: true, message: '请输入首条皮带起动时刻...' }],
        })(<TimePicker  format={'HH:mm'} style={{ width: 235 }} />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="斗轮机取料时刻">
        {form.getFieldDecorator('loadTime', {
          initialValue: moment('00:00', 'HH:mm'),
          rules: [{ required: true, message: '请输入斗轮机取料时刻...' }],
        })(<TimePicker  format={'HH:mm'} style={{ width: 235 }} />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="斗轮机停止作业时刻">
        {form.getFieldDecorator('endBucketTime', {
          initialValue: moment('00:00', 'HH:mm'),
          rules: [{ required: true, message: '请输入斗轮机停止作业时刻...' }],
        })(<TimePicker  format={'HH:mm'} style={{ width: 235 }} />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="货名">
        {form.getFieldDecorator('cargoId', {
          rules: [{ required: true, message: '请输入货名...' }],
          })(<Select placeholder="请输入" style={{ width: 235 }}>
          { setOptionForSelect(listCargo) }
        </Select>)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="当班装货量">
        {form.getFieldDecorator('weight', {
          initialValue: 0,  
          rules: [{ required: true, message: '请输入当班装货量...' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

@Form.create()
class LoadCar extends React.PureComponent{
    constructor(props){
        super(props)
        this.state={
            editingKey:'',
            modalVisible: false,

            currentID: -1,
        };
        this.columns=[
            {
                title:'开工日期',
                dataIndex:'beginDate',
                key:'beginDate',
                width:80,
                editable:true,
            },{
              title:'班次',
              dataIndex:'classNo',
              key:'classNo',
              width:80,
              editable:true,
              render(val, record) {
                switch (val) {
                  case 1: return <div>00:00-08:00</div>;break;
                  case 2: return <div>08:00-18:00</div>;break;
                  case 3: return <div>18:00-24:00</div>;break;
                  default: return <div>{val}</div>;
                }
              },
            },
            {
              title:'次序',
              dataIndex:'orders',
              key:'orders',
              width: 45,
              editable: true,             
            }, 
            {
              title:'首条皮带起动时刻',
              dataIndex:'fristBucketTime',
              key:'fristBucketTime',
              width: 75,
              editable: true,             
            }, 
            {
              title:'斗轮机取料时刻',
              dataIndex:'loadTime',
              key:'loadTime',
              width: 75,
              editable: true,             
            }, 
            {
              title:'斗轮机停止作业时刻',
              dataIndex:'endBucketTime',
              key:'endBucketTime',
              width: 75,
              editable: true,             
            }, 
            {
              title:'货名',
              dataIndex:'cargoId',
              key:'cargoId',
              width: 50,
              editable: true,
              render(val, record) {
                return <div>{record.cargoName}</div>;
              },
            },
            {
              title:'当班装货量',
              dataIndex:'weight',
              key:'weight',
              //width: 120,
              editable: true,             
            }, 
            {
                title:'操作',
                dataIndex:'operater',
                key:'operater',
                width:75,
                render:(text,record)=>{
                    const editable = this.isEditing(record);
                            return(
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
                                    <a onClick={() => this.edit(record.id)} ><Icon type="edit" /></a>
                                    <Divider type="vertical" />
                                    <Popconfirm title="确定要删除吗？" onConfirm={()=>this.handleDelete(record.id)}><a><Icon type="delete" /></a></Popconfirm>
                                  </span>
                                )
                               }
                                
                              </div>
                            );
                },
            },
        ]
    }

    onCreateLoadCar = (params) => {
      const { dispatch } = this.props;
      dispatch({type: 'loadcar/createLoadCar', payload: params});
    };
    onDeleteLoadCar = (id) => {
      const { dispatch } = this.props;
      dispatch({type: 'loadcar/deleteLoadCar', payload: {id}});
    };
    onUpdateLoadCar = (params) => {
      const { dispatch } = this.props;
      dispatch({type: 'loadcar/updateLoadCar', payload: params});
    }; 
    onListLoadCarByPage = (params) => {
      const { dispatch } = this.props;
      dispatch({type: 'loadcar/listLoadCarByPage', payload: params});
    };

    onListCargo = (params) => {
	    const { dispatch } = this.props;
	    dispatch({type: 'loadcar/listCargo'});
    };
    
    componentDidMount(){
      const params = {pageNo: 1};
        this.onListLoadCarByPage(params);
        this.onListCargo();
    }

    isEditing = (record) => {
        return record.id === this.state.editingKey;
    };
    edit(key) {
        this.setState({ editingKey: key });
    }
    
    handleUpdate(form, id) {
      form.validateFields((error, row) => {
        if (error) {
          return;
        }
        let listCargoId = [];
        this.props.loadcar.listCargo.map((item)=> listCargoId.push(item.id));
        const params = {
          id: id, 
          beginDate: row.beginDate, 
          classNo: row.classNo, 
          orders: row.orders,
          fristBucketTime: row.fristBucketTime,
          loadTime: row.loadTime,
          endBucketTime: row.endBucketTime,
          cargoId: row.cargoId,
          cargoName: this.props.loadcar.listCargo[listCargoId.indexOf(row.cargoId.toString())].cname,
          weight: row.weight,
        };
        this.onUpdateLoadCar(params);
  
        message.success('修改成功');
        this.setState({ editingKey: '' });
      });
    }

    cancel = () => {
      this.setState({ editingKey: '' });
    };

    handleModalVisible = flag => {
      this.setState({
        modalVisible: !!flag,
      });
    };
  
    handleAdd = fields => {
      let listCargoId = [];
      this.props.loadcar.listCargo.map((item)=> listCargoId.push(item.id));
      const params = {
        beginDate: fields.beginDate.format('YYYY-MM-DD'),
        classNo: fields.classNo, 
        orders: fields.orders,
        fristBucketTime: fields.fristBucketTime.format('HH:mm'),
        loadTime: fields.loadTime.format('HH:mm'),
        endBucketTime: fields.endBucketTime.format('HH:mm'),
        cargoId: fields.cargoId,
        cargoName: this.props.loadcar.listCargo[listCargoId.indexOf(fields.cargoId.toString())].cname,
        weight: fields.weight,
      };
      this.onCreateLoadCar(params);
  
      message.success('添加成功');
      this.setState({
        modalVisible: false,
  
      });
    };
    
    handleDelete = (id) => {
      this.onDeleteLoadCar(id);
      
      message.success('删除成功');
      this.setState({ editingKey: '' });
    };

    handleSearch = e => {
      e.preventDefault();
      this.handleList(1);
    };

      // 根据分页查询
    getLoadCarListByPage = (pageNumber)  => {
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
        'beginDate1': beginDate1,
        'beginDate2': beginDate2,
        pageNo: pageNo,
      };
      this.onListLoadCarByPage(values);
    });
  }

    setClassName = (record, index) => {
      return ( record.id  === this.state.currentID ? styles.select : '')
    }

    setChange = (id) => {
      this.props.onChange(id);
      this.setState({ currentID:id });
    }

    renderQueryForm() {
      const { form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Form onSubmit={this.handleSearch} layout="inline">

              <FormItem label="开工日期">
                {getFieldDecorator('beginDate')(
                  <RangePicker  style={{ width: 280 }} placeholder={['请输入', '请输入']} />
                )}
              </FormItem>

              <span>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
              </span >
              <Divider type="vertical" />
              <Button icon="plus" type="dashed" onClick={() => this.handleModalVisible(true)}  />
        </Form>
      );
    }

    render(){
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
                inputType: col.dataIndex === 'classNo' ? 'select' : (col.dataIndex === 'cargoId' ? 'selectCargo' : 'text'),
                dataIndex: col.dataIndex,
                title: col.title,
                editing: this.isEditing(record),
                listcargo: this.props.loadcar.listCargo, 
              }),
            };
        });

        
        
        return(
          <div>
            <Card title="装车工班作业动态" extra={<div>{this.renderQueryForm()}</div>}>
            
            <Table 
              onRow={(record) => {
                return {
                  onClick: () =>this.setChange(record.id),       // 点击行
                };
              }}
              rowClassName={this.setClassName}
              components={components} 
              columns={columns} 
              dataSource={this.props.loadcar.items} 
              rowKey="id" 
              size="small" 
              pagination={false} />
              <Pagination
                current={Number(this.props.loadcar.pageNo)}
                total={Number(this.props.loadcar.total)}
                onChange={this.getLoadCarListByPage}
                style={{float: 'right', marginTop: '20px'}}
              />
            </Card>
            <CreateForm {...parentMethods} modalVisible={modalVisible} listCargo={this.props.loadcar.listCargo} />
          </div>
        )
    }
}

export default connect(({ loadcar }) => ({loadcar}))(LoadCar);