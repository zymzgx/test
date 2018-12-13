import { Modal,Table,message } from 'antd'
import React from 'react'

import HOST from '../HostConfig';

class RoleForm extends React.Component{
    constructor(props){
        super(props);
        this.state={
            data:[],
            localSelectRowKeys:[],
        };
        this.columns=[
            {
                title:'角色名称',
                dataIndex:'roleName',
                key:'roleName',
                width:120,
            },
            {
              title:'权限',
              dataIndex:'authority',
              key:'authority',
              width:120,
            },
            {
              title:'描述',
              dataIndex:'description',
              key:'description',
            },
        ];
    }
    componentWillReceiveProps(props){
        const { appid,userId } = props
        if(userId===""){
            return
        }
        this.queryRoles(appid);                
        this.queryRoleUsers(appid,userId);
    }
    queryRoleUsers=(appid,userid)=>{
        fetch(`${HOST}/api/apps/${appid}/${userid}/authorities`,{  
            credentails: 'include',  
            mode: "cors",
            method:'GET', 
            headers: {  
                'Accept': '*/*',  
                'Content-Type': 'application/json; charset=utf-8',
            }}).then((response)=>{
                return response.json()
            }).then((json)=>{      
                if(json){
                    const localSelectRowKeys = []
                    json.forEach(el=>{
                        localSelectRowKeys.push(el.id)
                    })
                    this.setState({
                        localSelectRowKeys,
                    })
                }          
            }).catch((err)=>{
                message.error('访问网络出错',err);
            })
    }
    queryRoles=(appid)=>{
        fetch(`${HOST}/api/apps/${appid}/roles`,{  
            credentails: 'include',  
            mode: "cors",
            method:'GET', 
            headers: {  
                'Accept': '*/*',  
                'Content-Type': 'application/json; charset=utf-8',
            }}).then((response)=>{
                return response.json()
            }).then((json)=>{      
                this.setState({
                    data:json,
                })          
            }).catch((err)=>{
                message.error('访问网络出错',err);
            })
    }
    render() {
        const { visible, onCancel, onCreate } = this.props;
        const selectedRowKeys = this.state.localSelectRowKeys;
        const localRowSelection={
            selectedRowKeys,
            onChange: (selectRowKeys,) => {
                this.setState({
                    localSelectRowKeys : selectRowKeys,
                });
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
            }),
        }
        return (
          <Modal
            visible={visible}
            title="选择角色"
            okText="授权"
            cancelText="取消"
            onCancel={onCancel}
            onOk={onCreate}
          >
            <Table dataSource={this.state.data} rowKey="id" columns={this.columns} rowSelection={localRowSelection} pagination={false} />
          </Modal>
        );
    }
  }

  export default RoleForm;