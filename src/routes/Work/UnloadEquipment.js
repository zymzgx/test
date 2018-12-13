import React from 'react';
import { Card,Row,Col,Table,Form, Button,message,Input,Icon,Popconfirm, Divider, Select, TimePicker, Modal } from 'antd';
import { connect } from 'dva';
//import EditableCell from '../../components/EditableCell'
//import EditableContext from  '../../components/EditableCell/EditableContext'
import moment from 'moment';

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
          { setOptionForSelect(this.props.listequipment) }
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
  const { modalVisible, form, handleAdd, handleModalVisible, listEquipment } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      title="新建卸船工班设备"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="设备名称">
        {form.getFieldDecorator('equipmentID', {
          rules: [{ required: true, message: '请输入设备名称...' }],
          })(<Select placeholder="请输入" style={{ width: 235 }}>
          { setOptionForSelect(listEquipment) }
        </Select>)}
      </FormItem>

      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="开始作业时间">
        {form.getFieldDecorator('beginTime', {
          initialValue: moment('00:00', 'HH:mm'),
          rules: [{ required: true, message: '请输入开始作业时间...' }],         
        })(<TimePicker  format={'HH:mm'} style={{ width: 235 }} />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="结束作业时间">
        {form.getFieldDecorator('endTime', {
          initialValue: moment('00:00', 'HH:mm'),
          rules: [{ required: true, message: '请输入结束作业时间...' }],
        })(<TimePicker  format={'HH:mm'} style={{ width: 235 }} />)}
      </FormItem>
    </Modal>
  );
});

class UnloadEquipment extends React.Component{
    constructor(props){
        super(props);
        this.state={
            editingKey:'',
            modalVisible: false,
        }
    }

    onCreateUnloadEquipment = (params) => {
      const { dispatch } = this.props;
      dispatch({type: 'unloadequipment/createUnloadEquipment', payload: params});
    };   
    onDeleteUnloadEquipment = (id) => {
      const { dispatch } = this.props;
      dispatch({type: 'unloadequipment/deleteUnloadEquipment', payload: {id}});
    };
    onUpdateUnloadEquipment = (params) => {
      const { dispatch } = this.props;
      dispatch({type: 'unloadequipment/updateUnloadEquipment', payload: params});
    }; 
    onListUnloadEquipment = (params) => {
      const { dispatch } = this.props;
      dispatch({type: 'unloadequipment/listUnloadEquipment', payload: params});
    };

    onListEquipment = () => {
      const { dispatch } = this.props;
      dispatch({type: 'unloadequipment/listEquipment'});
    };

    componentDidMount(){
        const { unloadId } = this.props;
        this.queryUnloadEquipment(unloadId);
        this.onListEquipment();
    }

    componentWillReceiveProps(newProps) {
      if (this.props.unloadId !== newProps.unloadId) {
        this.queryUnloadEquipment(newProps.unloadId);
      }
    }
    
    handleModalVisible = flag => {
      console.log('unloadId', this.props.unloadId);
      if (this.props.unloadId === 0) {
        message.warning('请选择卸船工班作业动态！');
        return;
      }

      this.setState({
        modalVisible: !!flag,
      });
    };
   

    queryUnloadEquipment=(unloadId)=>{
      const params = {unloadId: unloadId};
      this.onListUnloadEquipment(params);
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
        let listEquipmentId = [];
        this.props.unloadequipment.listEquipment.map((item)=> listEquipmentId.push(item.id));
        console.log("equipmentId:", listEquipmentId);
        const params = {
          id: id, 
          unloadID: this.props.unloadId, 
          beginDate: row.beginDate,
          equipmentID: row.equipmentID,
          equipmentName: this.props.unloadequipment.listEquipment[listEquipmentId.indexOf(row.equipmentID.toString())].cname,
          beginTime: row.beginTime,
          endTime: row.endTime,
        };
        this.onUpdateUnloadEquipment(params);
  
        message.success('修改成功');
        this.setState({ editingKey: '' });
      });
    }   
    cancel = () => {
      this.setState({ editingKey: '' });
    };

    handleAdd = fields => {
      let listEquipmentId = [];
      this.props.unloadequipment.listEquipment.map((item)=> listEquipmentId.push(item.id));
      const params = {
        unloadID: this.props.unloadId, 

        equipmentID: fields.equipmentID, 
        equipmentName: this.props.unloadequipment.listEquipment[listEquipmentId.indexOf(fields.equipmentID.toString())].cname,
        beginTime: fields.beginTime.format('HH:mm'), 
        endTime: fields.endTime.format('HH:mm'), 
      };
      this.onCreateUnloadEquipment(params);
  
      message.success('添加成功');
      this.setState({
        modalVisible: false,
  
      });
    };
    
    handleDelete = (id) => {
      this.onDeleteUnloadEquipment(id);
      
      message.success('删除成功');
      this.setState({ editingKey: '' });
    };

    render(){
        const userColumns=[
            {
                title:'装卸设备',
                key:'equipmentID',
                dataIndex:'equipmentID',
                editable: true,
                render(val, record) {
                  return <div>{record.equipmentName}</div>;
              },
            },{
                title:'开始作业时间',
                key:'beginTime',
                dataIndex:'beginTime',
                editable: true,
            },{
              title:'结束作业时间',
              key:'endTime',
              dataIndex:'endTime',
              editable: true,
            },{
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


        const columns = userColumns.map((col) => {
          if (!col.editable) {
            return col;
          }
          return {
            ...col,
            onCell: record => ({
              record,
              inputType: col.dataIndex === 'equipmentID' ? 'select' : 'text',
              dataIndex: col.dataIndex,
              title: col.title,
              editing: this.isEditing(record),
              listequipment: this.props.unloadequipment.listEquipment,    
            }),
          };
      });







        return(
          <Row>
            <Col span={24}>
                            
              <Card title="卸船工班设备" extra={<Button icon="plus" type="dashed" onClick={() => this.handleModalVisible(true)} size="small" />}>          
                <Table rowKey="id" pagination={false} size="small" components={components} columns={columns} dataSource={this.props.unloadequipment.items} />
              </Card>   
            </Col>
            <CreateForm {...parentMethods} modalVisible={modalVisible}  listEquipment={this.props.unloadequipment.listEquipment} />
          </Row> 
        );
    }
}

export default connect(({ unloadequipment }) =>({unloadequipment}))(UnloadEquipment)