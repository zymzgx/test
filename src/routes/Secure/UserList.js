import { Table,Row,Col,message,Form,Popconfirm,Icon } from 'antd'
import React from 'react'

import AddUser from './AddUser'
import HOST from './HostConfig'
import RightContent from './RightContent'
import EditableCell from '../../components/EditableCell'
import EditableContext from  '../../components/EditableCell/EditableContext'

import styles from './UserList.less'

const host = HOST;

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class UserList extends React.PureComponent{
    constructor(props){
        super(props)
        this.state={
            dataSource:[],
            count:1,
            current:1,
            modaVisible:false,
            searchText:'',
            editingKey:'',
        }
        this.columns =[
            {
                title:"账号",
                dataIndex:'username',
                key:'username',
            },{
                title:'全名',
                dataIndex:'fullName',
                key:'fullName',
                editable:true,
            },{
                title:'手机',
                dataIndex:'mobile',
                key:'mobile',
                editable:true,
            },{
                title:'邮箱',
                dataIndex:'email',
                key:'email',
                editable:true,
            },{
                title:'创建时间',
                dataIndex:'createdAt',
                key:'createdAt',
            },{
                title:'操作',
                dataIndex:'',
                key:'oprate',
                render:(text,record)=>{
                    const editable = this.isEditing(record);
                    return(
                      <div>
                        {editable ? (
                          <span>
                            <EditableContext.Consumer>
                              {form => (
                                <a
                                  onClick={() => this.save(form, record.id)}
                                  style={{ marginRight: 8 }}
                                >
                                  <Icon type="check" style={{color:'green'}} />
                                </a>
                              )}
                            </EditableContext.Consumer>                          
                            <a onClick={() => this.cancel(record.id)} style={{marginRight:10}}><Icon type="close" style={{color:'red'}} /></a>
                          </span>
                          ) : (
                            <a onClick={() => this.edit(record.id)} style={{marginRight:10}}><Icon type="edit" /></a>
                        )}
                        <Popconfirm title="确定要删除吗？" onConfirm={()=>this.delete(record.id)}><a><Icon type="delete" /></a></Popconfirm>
                      </div>
                    );
                },
            },
        ];
    }

    componentDidMount(){
        this.queryUsers(this.state.current,'');
    }

    onPageChange=(page)=>{
        this.setState({
            current:page,
        })
        this.queryUsers(page,this.state.searchText);
    }
    
    queryUsers=(page,word)=>{
        fetch(`${host}/api/users?pageNo=${page}&word=${word}`,{  
            credentails: 'include',  
            mode: "cors", 
            headers: {  
                'Accept': '*/*',  
            }}).then((response)=>response.json()).then((json)=>{
                this.setState({
                    dataSource:json.items,
                    count:json.total,
                })
            }).catch((err)=>{
                message.error('访问网络出错',err);
            })
    }

    rigister=()=>{
        this.setState({
             modaVisible:true,
        })
    }

    search=(value)=>{
        this.queryUsers(this.state.current,value);
        this.setState({
            searchText:value,
        })
    }

    delete=(key)=>{
        fetch(`${host}/api/users/${key}`,{  
            credentails: 'include',  
            mode: "cors",
            method:'DELETE', 
            headers: {  
                'Accept': '*/*',  
            }}).then((response)=>response.json()).then(()=>{
                this.setState({
                    dataSource:this.state.dataSource.filter(item=>item.id!==key),
                })
            }).catch((err)=>{
                message.error('访问网络出错',err);
            })
    }

    okModal=(values)=>{
        fetch(`${host}/api/users`,{  
            credentails: 'include',  
            mode: "cors",
            method:'POST', 
            body:JSON.stringify({'username':values.username,'fullName':values.fullName,'password':values.password,'mobile':values.mobile,'email':values.email}),
            headers: {  
                'Accept': '*/*',  
                'Content-Type': 'application/json; charset=utf-8',
            }}).then((response)=>{
                if(response.status===200){
                    message.success('注册成功');
                }else{
                    message.error('注册失败');
                }
                return response.json()
            }).then(()=>{                
            }).catch((err)=>{
                message.error('访问网络出错',err);
            })        
    }
    cancelModal=()=>{
        this.setState({
            modaVisible:false,
        })
    }

    isEditing = (record) => {
        return record.id === this.state.editingKey;
    };
    edit(key) {
        this.setState({ editingKey: key });
    }
    save(form, key) {
        form.validateFields((error, row) => {
          if (error) {
            return;
          }
          fetch(`${host}/api/users/${key}`,{  
            credentails: 'include',  
            mode: "cors",
            method:'PUT', 
            body:JSON.stringify(row),
            headers: {  
                'Accept': '*/*',  
                'Content-Type': 'application/json; charset=utf-8',
            }}).then((response)=>{
                if(response.status===200){
                    message.success('修改成功');
                }else{
                    message.error('修改失败');
                    return
                }
                return response.json()
            }).then(()=>{                
            }).catch((err)=>{
                message.error('访问网络出错',err);
            })
          const newData = [...this.state.dataSource];
          const index = newData.findIndex(item => key === item.id);
          if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, {
              ...item,
              ...row,
            });
            this.setState({ dataSource: newData, editingKey: '' });
          } else {
            this.setState({ dataSource: newData, editingKey: '' });
          }
        });
    }
    cancel = () => {
        this.setState({ editingKey: '' });
    };

    render(){
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
                inputType: col.dataIndex === 'moblie' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: this.isEditing(record),
              }),
            };
        });
        return(
          <Row>
            <Col span={20}>
              <AddUser visible={this.state.modaVisible} okModal={this.okModal} cancelModal={this.cancelModal} />
              <Table rowClassName={styles.editableRow} components={components} columns={columns} dataSource={this.state.dataSource} rowKey="id" pagination={{total:this.state.count,pageSize:10,current:this.state.current,onChange:this.onPageChange}} />                   
            </Col>
            <Col span={4}>
              <RightContent rigister={this.rigister} onSearch={this.search} />
            </Col>
          </Row>                
        );
    }
}

export default UserList