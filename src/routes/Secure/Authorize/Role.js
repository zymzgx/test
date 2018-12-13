import { Card, Button,Table,message,Form,Icon,Popconfirm } from 'antd'
import React from 'react'

import EditableCell from '../../../components/EditableCell'
import EditableContext from '../../../components/EditableCell/EditableContext'

import HOST from '../HostConfig'

const host = HOST;

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class Role extends React.PureComponent{
    constructor(props){
        super(props)
        this.state={
            dataSource:[],
            editingKey:'',
        };
        this.columns=[
            {
                title:'角色名称',
                dataIndex:'roleName',
                key:'roleName',
                width:125,
                editable:true,
            },{
              title:'权限',
              dataIndex:'authority',
              key:'authority',
              width:120,
              editable:true,
            },{
                title:'描述',
                dataIndex:'description',
                key:'description',
                editable:true,
            },
            {
                title:'操作',
                dataIndex:'operater',
                key:'operater',
                width:120,
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
                                )
                               }
                                <Popconfirm title="确定要删除吗？" onConfirm={()=>this.delete(record.id)}><a><Icon type="delete" /></a></Popconfirm>
                              </div>
                            );
                },
            },
        ]
    }
    
    componentDidMount(){
        const { appid } = this.props;
        this.queryRoles(appid);
    }

    queryRoles=(id)=>{
        fetch(`${host}/api/apps/${id}/roles`,{  
            credentails: 'include',  
            mode: "cors",
            method:'GET', 
            headers: {  
                'Accept': '*/*',  
                'Content-Type': 'application/json; charset=utf-8',
            }}).then((response)=>{
                if(response.status===200){
                  console.log(response.status);
                }else{
                    return
                }
                return response.json()
            }).then((json)=>{      
                this.setState({
                    dataSource:json,
                })          
            }).catch((err)=>{
                message.error('访问网络出错',err);
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
          if(key==='0'){
            fetch(`${host}/api/apps/${this.props.appid}/roles`,{  
              credentails: 'include',  
              mode: "cors",
              method:'POST', 
              body:JSON.stringify(row),
              headers: {  
                  'Accept': '*/*',  
                  'Content-Type': 'application/json; charset=utf-8',
              }}).then((response)=>{
                  if(response.status===200){
                      message.success('添加成功');
                  }else{
                      message.error('添加失败');
                      return
                  }
                  return response.json()
              }).then((json)=>{
                if(json){
                  this.setState({
                    dataSource:this.state.dataSource.filter(item=>item.id!=='0').concat([json]),
                  })
                }                
              }).catch((err)=>{
                  message.error('访问网络出错',err);
              })
          }else{
            fetch(`${host}/api/apps/${this.props.appid}/roles`,{  
              credentails: 'include',  
              mode: "cors",
              method:'PUT', 
              body:JSON.stringify({'id':key,'roleName':row.roleName,'authority':row.authority,'description':row.description}),
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
              }).then((json)=>{
                if(json){
                  console.log(json);
                }                
              }).catch((err)=>{
                  message.error('访问网络出错',err);
              })
          }          
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
      if(this.state.editingKey==='0'){
        this.setState({
          dataSource:this.state.dataSource.filter(item=>item.id!==0),
        })       
      }
      this.setState({ editingKey: '' });
    };

    addRole=()=>{
      const newRow={'id':'0','authority':'ROLE_USER','roleName':'','description':''}
      this.setState({
        dataSource:this.state.dataSource.concat([newRow]),
        editingKey:'0',
      })      
    }
    delete=(id)=>{
      fetch(`${host}/api/apps/${this.props.appid}/roles/${id}`,{  
        credentails: 'include',  
        mode: "cors",
        method:'DELETE', 
        headers: {  
            'Accept': '*/*',  
            'Content-Type': 'application/json; charset=utf-8',
        }}).then((response)=>{
            if(response.status===200){
                message.success('删除成功');
            }else{
                message.error('删除失败');
                return
            }
            return response.json()
        }).then(()=>{          
          this.setState({
            dataSource:this.state.dataSource.filter(item=>item.id!==id),
          })      
        }).catch((err)=>{
            message.error('访问网络出错',err);
        })
    }
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
                inputType: 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: this.isEditing(record),
              }),
            };
        });
        
        return(
          <Card title="角色管理" extra={<Button icon="plus" type="dashed" onClick={this.addRole} size="small" />}>
            <Table components={components} columns={columns} dataSource={this.state.dataSource} rowKey="id" size="middle" pagination={false} />
          </Card>
        )
    }
}

export default Role