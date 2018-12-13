import { Input, InputNumber, Card, Button,Table,message,Form,Icon,Popconfirm, Select, Modal, Divider } from 'antd'
import React from 'react'
import { connect } from 'dva';
//import EditableCell from '../../components/EditableCell'
//import EditableContext from '../../components/EditableCell/EditableContext'
import styles from './Equipment.less';

const { Option } = Select;

const typeStatus = ['装船机', '卸船机', '皮带机', '斗轮机', '装车楼'];//1-5

function setSelect (arr) {
  return arr.map( (value, index) => {
    if (value) {
      return <Option value={index+1} key={index+1}>{value}</Option>
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
          { setSelect(typeStatus) }
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
      title="新建设备"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="代码">
        {form.getFieldDecorator('code', {
          rules: [{ required: true, message: '请输入代码...' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="设备名称">
        {form.getFieldDecorator('cname', {
          rules: [{ required: true, message: '请输入设备名称...' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="设备类型">
        {form.getFieldDecorator('type', {
          initialValue: 1,  
          rules: [{ required: true, message: '请输入设备类型...' }],
        })(<Select placeholder="请输入" >
          { setSelect(typeStatus) }
        </Select>)}
      </FormItem>
    </Modal>
  );
});

class Equipment extends React.PureComponent{
    constructor(props){
        super(props)
        this.state={
            editingKey:'',
            modalVisible: false,

            currentID: -1,
        };
        this.columns=[
            {
                title:'代码',
                dataIndex:'code',
                key:'code',
                width:75,
                editable:true,
            },{
              title:'设备名称',
              dataIndex:'cname',
              key:'cname',
              width:120,
              editable:true,
            },
            {
              title:'设备类型',
              dataIndex:'type',
              key:'type',
              //width: 120,
              editable: true,
              filters: [
                {
                  text: typeStatus[0],
                  value: 1,
                },
                {
                  text: typeStatus[1],
                  value: 2,
                },
                {
                  text: typeStatus[2],
                  value: 3,
                },
                {
                  text: typeStatus[3],
                  value: 4,
                },
                {
                  text: typeStatus[4],
                  value: 5,
                },
              ],
              onFilter: (value, record) => record.type.toString() === value,
              render(val) {
                return <div>{typeStatus[val-1]}</div>;
              },
            }, 
            {
                title:'操作',
                dataIndex:'operater',
                key:'operater',
                width:90,
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

    onCreateEquipment = (params) => {
      const { dispatch } = this.props;
      dispatch({type: 'equipment/createEquipment', payload: params});
    };
    onDeleteEquipment = (id) => {
      const { dispatch } = this.props;
      dispatch({type: 'equipment/deleteEquipment', payload: {id}});
    };
    onUpdateEquipment = (params) => {
      const { dispatch } = this.props;
      dispatch({type: 'equipment/updateEquipment', payload: params});
    }; 
    onListEquipmentByPage = (params) => {
      const { dispatch } = this.props;
      dispatch({type: 'equipment/listEquipmentByPage', payload: params});
    };
    
    componentDidMount(){
      const params = {pageNo: 1};
      this.onListEquipmentByPage(params);
    }

    // 根据分页查询
    getEquipmentListByPage = (pageNumber)  => { 
      const values = {
        pageNo: pageNumber,
      };
      this.onListEquipmentByPage(values);
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
        const params = {id: id, code: row.code, cname: row.cname, type: row.type};
        this.onUpdateEquipment(params);
  
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
      const params = {code: fields.code, cname: fields.cname, type: fields.type};
      this.onCreateEquipment(params);
  
      message.success('添加成功');
      this.setState({
        modalVisible: false,
  
      });
    };
    
    handleDelete = (id) => {
      this.onDeleteEquipment(id);
      
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
                inputType: col.dataIndex === 'type' ? 'select' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: this.isEditing(record),
              }),
            };
        });

        
        
        return(
          <div>
            <Card title="设备管理" extra={<Button icon="plus" type="dashed" onClick={() => this.handleModalVisible(true)} size="small" />}>
            <Table 
              onRow={(record) => {
                return {
                  onClick: () =>this.setChange(record.id),       // 点击行
                };
              }}
              rowClassName={this.setClassName}
              components={components} 
              columns={columns} 
              dataSource={this.props.equipment.items} 
              rowKey="id" 
              size="small" 
              pagination={{total:Number(this.props.equipment.total), current:Number(this.props.equipment.pageNo), onChange:this.getEquipmentListByPage}} />
            </Card>
            <CreateForm {...parentMethods} modalVisible={modalVisible} />
          </div>
        )
    }
}

export default connect(({ equipment }) => ({equipment}))(Equipment);