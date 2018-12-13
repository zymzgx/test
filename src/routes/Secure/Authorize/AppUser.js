import React from 'react';
import { Card,Row,Col,Table,Form, Button,message,Input,Icon,Popconfirm } from 'antd';

import HOST from '../HostConfig';
import RoleForm from './RoleForm';
import UserRoleShow from './UserRoleShow';

const { Search } = Input;

const jtUserColumns=[
    {
        title:'全名',
        key:'fullName',
        dataIndex:'fullName',
    },
    {
        title:'工号',
        key:'username',
        dataIndex:'username',
    },
]

class AppUser extends React.Component{
    constructor(props){
        super(props);
        this.state={
            jituanSelectRowKeys:[],
            localSelectRowKeys:[],
            jituanDataSource:[],
            dataSource:[],
            count:0,
            current:1,
            visible:false,
            userId:'',
            rolesDesc:'',
        }
    }
    
    componentDidMount(){
        const { appid } = this.props;
        this.queryUsers(appid,1);
    }
    onPageChange=(page)=>{
        this.queryUsers(this.props.appid,page);
    }
    
    onSearchJT=(value)=>{
        fetch(`${HOST}/api/users/search?incl=id,username,fullName&word=${value}`,{  
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
            if(json)
            this.setState({
                jituanDataSource:json,
            })
        }).catch((error)=>{
            alert(error);
        });
    }
    // 授权
    handleCreate = () => {
        const selectKeys = this.formRef.state.localSelectRowKeys;
        if(selectKeys.length===0){
            message.info("没有选择角色");
            return
        }
        // /api/apps/{appid}/{userId}/authorize
        fetch(`${HOST}/api/apps/${this.props.appid}/${this.state.userId}/authorize`,{  
            credentails: 'include',  
            mode: "cors",  
            method:"POST",
            body:JSON.stringify(selectKeys),
            headers: {  
                'Accept': 'application/json',  
                'Content-Type': 'application/json;charset=utf-8',
            },            
        }).then((response)=>{
            if(response.status===200){
                message.success("授权成功");
                return  response.json()
            }else{
                message.error("授权失败");
                return null;
            }
        })
        .then((json)=>{
            if(json){                // this.queryUsers(this.props.appid,this.state.current);
                const dataSource =[];
                this.state.dataSource.forEach(el=>{
                    const elm = el;
                    if(elm.userId===json.userId)
                       elm.rolesDesc = json.rolesDesc
                    dataSource.push(elm)
                })
                this.setState({
                    dataSource,
                })
                this.handleCancel();
            }                
        }).catch((error)=>{
            alert(error);
        });
    }
    
    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }
    
    showModal = () => {
        this.setState({ visible: true });
    }
   
    handleCancel = () => {
        this.setState({ visible: false });
    }
    
    queryUsers=(appid,page)=>{
        fetch(`${HOST}/api/apps/${appid}/users?pageNo=${page}`,{  
            credentails: 'include',  
            mode: "cors",  
            headers: {  
                'Accept': 'application/json',  
                'Content-Type': 'application/json;charset=utf-8',
            },                        
        }).then((response)=>{
            if(response.status===200){
                return  response.json()
            }
        })
        .then((json)=>{
            if(json)
            this.setState({
                dataSource:json.items,
                count:parseInt(json.total,10),
            })
        }).catch((error)=>{
            alert(error);
        });
    }
    
    autor=(record)=>{
       this.showModal();
       this.setState({
           userId:record.userId,
           rolesDesc:record.rolesDesc,
       })
    }

    render(){
        const userColumns=[
            {
                title:'全名',
                key:'fullName1',
                dataIndex:'fullName',
                render:(text,record)=>{
                  return(
                    <div>
                      {text}
                      <UserRoleShow rolesDesc={record.rolesDesc} />
                    </div>
                  )
                },
            },{
                title:'工号',
                key:'username1',
                dataIndex:'username',
            },{
                title:'授权',
                dataIndex:'author',
                key:'author',
                render:(text,record)=>{
                    return(<a onClick={()=>this.autor(record)}><Icon type="user" style={{marginRight:10}} /></a>);
                },
            },
        ]        
        const localRowSelection={
            onChange: (selectedRowKeys,) => {
                this.setState({
                    localSelectRowKeys : selectedRowKeys,
                });
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
            }),
        }
        const jituanRowSelection = {
            onChange: (selectedRowKeys, ) => {
               this.setState({
                   jituanSelectRowKeys : selectedRowKeys,
               });
             },
            getCheckboxProps: record => ({
              disabled: record.name === 'Disabled User', // Column configuration not to be checked
              name: record.name,
            }),
          };
        const addButtonClick=()=>{
            if(this.state.jituanSelectRowKeys.length===0){
                message.info('请选择要添加的用户!');
                return;
            }
            fetch(`${HOST}/api/apps/${this.props.appid}/users`,{  
                credentails: 'include',  
                mode: "cors",  
                method:"POST",
                body:JSON.stringify(this.state.jituanSelectRowKeys),
                headers: {  
                    'Accept': 'application/json',  
                    'Content-Type': 'application/json;charset=utf-8',
                },            
            }).then((response)=>{
                if(response.status===200){
                    return  response.json()
                }else{
                    message.error("网络错误");
                    return null
                }
            })
            .then((json)=>{
                if(json){
                    this.queryUsers(this.props.appid,this.state.current);
                }                
            }).catch((error)=>{
                alert(error);
            });                         
        }
        const removeButtonClick=()=>{
            if(this.state.localSelectRowKeys.length===0){
                message.info('请选择要添加的用户!');
                return;
            }
            fetch(`${HOST}/api/apps/${this.props.appid}/users`,{  
                credentails: 'include',  
                mode: "cors",  
                method:"DELETE",                
                body:JSON.stringify(this.state.localSelectRowKeys),
                headers: {  
                    'Accept': 'application/json',  
                    'Content-Type': 'application/json;charset=utf-8',
                },            
            }).then((response)=>{
                if(response.status===200){
                    return  response.json()
                }else{
                    message.error('网络错误');
                    return null
                }
            })
            .then((json)=>{
                if(json){
                    this.state.localSelectRowKeys.forEach(el=>{
                        this.setState({
                            dataSource:this.state.dataSource.filter(item=>item.userId!==el),
                        })
                    })
                    
                }                
            }).catch((error)=>{
                alert(error);
            });
        }
        return(
          <Row>
            <Col span={10}>
              <RoleForm
                ref={this.saveFormRef}
                visible={this.state.visible}
                onCancel={this.handleCancel}
                onCreate={this.handleCreate}
                appid={this.props.appid}
                userId={this.state.userId}
                rolesDesc={this.state.rolesDesc}
              />                
              <Card title="应用用户">            
                <Table rowKey="userId" pagination={{total:this.state.count,pageSize:10,current:this.state.current,onChange:this.onPageChange}} size="middle" rowSelection={localRowSelection} columns={userColumns} dataSource={this.state.dataSource} />
              </Card>   
            </Col>
            <Col span={3} style={{textAlign:'center'}}>
              <div style={{margin:'50px 5px 5px 5px'}}>
                <Button type="primary" onClick={addButtonClick} style={{marginBottom:10}}>添加用户</Button>
                <Popconfirm title="确定要移除用户吗?" placement="bottom" onConfirm={removeButtonClick}>
                  <Button type="dashed">移除用户</Button>
                </Popconfirm>
              </div>
            </Col>
            <Col span={11}>
              <Card title="所有集团用户" extra={<Search placeholder="请输入用户名称或账号" size="small" onSearch={this.onSearchJT} />}>            
                <Table rowKey='id' size="middle" pagination={false} rowSelection={jituanRowSelection} columns={jtUserColumns} dataSource={this.state.jituanDataSource} />
              </Card>  
            </Col>
          </Row> 
        );
    }
}

export default AppUser