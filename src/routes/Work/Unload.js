import { Input, InputNumber, Card, Button,Table,message,Form,Icon,Popconfirm, Select, Modal, Divider, DatePicker, TimePicker } from 'antd'
import React from 'react'
import { connect } from 'dva';
//import EditableCell from '../../components/EditableCell'
//import EditableContext from '../../components/EditableCell/EditableContext'
import styles from './Unload.less';
import moment from 'moment';

const { Option } = Select;

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
      title="新建卸船工班作业动态"
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
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="首条皮带起动时刻">
        {form.getFieldDecorator('fristBeltTime', {
          initialValue: moment('00:00', 'HH:mm'),
          rules: [{ required: true, message: '请输入首条皮带起动时刻...' }],
        })(<TimePicker  format={'HH:mm'} style={{ width: 235 }} />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="卸船机抓料时刻">
        {form.getFieldDecorator('unloadTime', {
          initialValue: moment('00:00', 'HH:mm'),
          rules: [{ required: true, message: '请输入卸船机抓料时刻...' }],
        })(<TimePicker  format={'HH:mm'} style={{ width: 235 }} />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="斗轮机停止作业时刻">
        {form.getFieldDecorator('endBucketTime', {
          initialValue: moment('00:00', 'HH:mm'),
          rules: [{ required: true, message: '请输入斗轮机停止作业时刻...' }],
        })(<TimePicker  format={'HH:mm'} style={{ width: 235 }} />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="当班卸货量">
        {form.getFieldDecorator('weight', {
          initialValue: 0,  
          rules: [{ required: true, message: '请输入当班卸货量...' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

class Unload extends React.PureComponent{
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
                width:115,
                editable:true,
            },{
              title:'班次',
              dataIndex:'classNo',
              key:'classNo',
              width:100,
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
              title:'首条皮带起动时刻',
              dataIndex:'fristBeltTime',
              key:'fristBeltTime',
              width: 80,
              editable: true,             
            }, 
            {
              title:'卸船机抓料时刻',
              dataIndex:'unloadTime',
              key:'unloadTime',
              width: 80,
              editable: true,             
            }, 
            {
              title:'斗轮机停止作业时刻',
              dataIndex:'endBucketTime',
              key:'endBucketTime',
              width: 90,
              editable: true,             
            }, 
            {
              title:'当班卸货量',
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

    onCreateUnload = (params) => {
      const { dispatch } = this.props;
      dispatch({type: 'unload/createUnload', payload: params});
    };
    onDeleteUnload = (id) => {
      const { dispatch } = this.props;
      dispatch({type: 'unload/deleteUnload', payload: {id}});
    };
    onUpdateUnload = (params) => {
      const { dispatch } = this.props;
      dispatch({type: 'unload/updateUnload', payload: params});
    }; 
    onListUnload = (params) => {
      const { dispatch } = this.props;
      dispatch({type: 'unload/listUnload', payload: params});
    };
    
    componentDidMount(){
      const { unloadPlanId } = this.props;
        this.queryUnloads(unloadPlanId);
    }

    queryUnloads=(unloadPlanId)=>{
      const params = {unloadPlanId: unloadPlanId};
      this.onListUnload(params);
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
        const params = {
          id: id, 
          unloadPlanID: this.props.unloadPlanId, 
          beginDate: row.beginDate, 
          classNo: row.classNo, 
          fristBeltTime: row.fristBeltTime,
          unloadTime: row.unloadTime,
          endBucketTime: row.endBucketTime,
          weight: row.weight,
        };
        this.onUpdateUnload(params);
  
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
      const params = {
        unloadPlanID: this.props.unloadPlanId, 
        beginDate: fields.beginDate, 
        classNo: fields.classNo, 
        fristBeltTime: fields.fristBeltTime.format('HH:mm'),
        unloadTime: fields.unloadTime.format('HH:mm'),
        endBucketTime: fields.endBucketTime.format('HH:mm'),
        weight: fields.weight,
      };
      this.onCreateUnload(params);
  
      message.success('添加成功');
      this.setState({
        modalVisible: false,
  
      });
    };
    
    handleDelete = (id) => {
      this.onDeleteUnload(id);
      
      message.success('删除成功');
      this.setState({ editingKey: '' });
    };

    setClassName = (record, index) => {
      return ( record.id  === this.state.currentID ? styles.select : '')
    }

    setChange = (id) => {
      this.props.onChange(id);
      this.setState({ currentID:id });
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
                inputType: col.dataIndex === 'classNo' ? 'select' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: this.isEditing(record),
              }),
            };
        });

        
        
        return(
          <div>
            <Card title="卸船工班作业动态" extra={<Button icon="plus" type="dashed" onClick={() => this.handleModalVisible(true)} size="small" />}>
            <Table 
              onRow={(record) => {
                return {
                  onClick: () =>this.setChange(record.id),       // 点击行
                };
              }}
              rowClassName={this.setClassName}
              components={components} 
              columns={columns} 
              dataSource={this.props.unload.items} 
              rowKey="id" 
              size="small" 
              pagination={false} />
            </Card>
            <CreateForm {...parentMethods} modalVisible={modalVisible} />
          </div>
        )
    }
}

export default connect(({ unload }) => ({unload}))(Unload);