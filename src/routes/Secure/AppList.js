import { Table,Row,Col,message,Form,Popconfirm,Icon } from 'antd'
import React from 'react'

import AddApp from './AddApp'
import AppMenu from './AppMenu'
import HOST from './HostConfig'
import EditableCell from '../../components/EditableCell'
import EditableContext from  '../../components/EditableCell/EditableContext'
import styles from './UserList.less'

// const EditableContext = React.createContext();
const host = HOST;

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class AppList extends React.PureComponent{
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
                title:"ID",
                dataIndex:'id',
                key:'id',
                width:220,
            },{
                title:'key',
                dataIndex:'appKey',
                key:'appKey',
                width:350,
            },{
                title:'名称',
                dataIndex:'name',
                key:'name',
                width:200,
                editable:true,
                render:(text,record)=>(
                  <a onClick={()=>this.AddTab(record)}>{text}</a>
                ),
            },{
                title:'描述',
                dataIndex:'description',
                key:'description',
                editable:true,
            },{
                title:'操作',
                dataIndex:'',
                key:'oprate',
                width:130,
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
                        <Popconfirm title="刷新会导致认证及授权失败，确认刷新吗？" onConfirm={()=>this.refresh(record.id)}><a style={{marginLeft:10}}><Icon type='loading-3-quarters' /></a></Popconfirm>
                      </div>
                    );
                },
            },
        ]
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
    
    AddTab=(record)=>{
        this.props.AddTab(record);
    }

    queryUsers=(page,word)=>{
        fetch(`${host}/api/apps?pageNo=${page}&word=${word}`,{  
            credentails: 'include',  
            mode: "cors", 
            headers: {  
                'Accept': '*/*',  
            }}).then((response)=>response.json())
            .then((json)=>{
                this.setState({
                    dataSource:json.items,
                    count:parseInt(json.total,10),
                })
            })
            .catch((err)=>{
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
        fetch(`${host}/api/apps/${key}`,{  
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
        fetch(`${host}/api/apps`,{  
            credentails: 'include',  
            mode: "cors",
            method:'POST', 
            body:JSON.stringify(values),
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
            }).then((json)=>{   
                this.setState({
                    dataSource:this.state.dataSource.concat([json]),
                })             
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
    }

    edit(key) {
        this.setState({ editingKey: key });
    }

    save(form, key) {
        form.validateFields((error, row) => {
          if (error) {
            return;
          }
          fetch(`${host}/api/apps/${key}`,{  
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

    refresh=(id)=>{
        // 刷新key/api/apps/refresh_appkey
        fetch(`${host}/api/apps/refresh_appkey?id=${id}`,{  
            credentails: 'include',  
            mode: "cors", 
            headers: {  
                'Accept': '*/*',  
            }}).then((response)=>response.json()).then((json)=>{
                if(json){
                    const dataSource = []
                    this.state.dataSource.forEach(el=>{
                        const elm = el;
                        if(elm.id === json.id){
                            elm.appKey=json.appKey;
                        }
                        dataSource.push(elm)
                    })
                    this.setState({
                        dataSource,
                    })
                }                
            }).catch((err)=>{
                message.error('访问网络出错',err);
            })
    }

    render(){
        const components = {
            body: {
              row: EditableFormRow,
              cell: EditableCell ,
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
              <AddApp visible={this.state.modaVisible} okModal={this.okModal} cancelModal={this.cancelModal} />
              <Table rowClassName={styles.editableRow} components={components} columns={columns} dataSource={this.state.dataSource} rowKey="id" pagination={{total:this.state.count,pageSize:10,current:this.state.current,onChange:this.onPageChange}} />                       
            </Col>
            <Col span={4}>
              <AppMenu rigister={this.rigister} onSearch={this.search} />
            </Col>
          </Row>                
        );
    }
}

export default AppList;