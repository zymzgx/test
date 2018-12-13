import React from 'react';
import { Card,Row,Col,Table,Form, Button,message,Input,Icon,Popconfirm } from 'antd';
import { connect } from 'dva';
import EditableCell from '../../components/EditableCell'
import EditableContext from  '../../components/EditableCell/EditableContext'

import HOST from '../HostConfig';

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

const { Search } = Input;

const jtUserColumns=[
    {
      title:'采集点',
      key:'object',
      dataIndex:'object',     
    },{
      title:'倍率',
      key:'rate',
      dataIndex:'rate',
    },
]

class Points extends React.Component{
    constructor(props){
        super(props);
        this.state={
            jituanSelectRowKeys:[],
            localSelectRowKeys:[],
            jituanDataSource:[],

            total: 0,
            pageNo: 0,
            searchValue: '',
            editingKey:'',
        }
    }

    onCreatePoints = (params) => {
      const { dispatch } = this.props;
      dispatch({type: 'points/createPoints', payload: params});
      };
    
    onDeletePoints = (id) => {
        const { dispatch } = this.props;
        dispatch({type: 'points/deletePoints', payload: {id}});
        };
    onListPoints = (params) => {
      const { dispatch } = this.props;
      dispatch({type: 'points/listPoints', payload: params});
      };

    componentDidMount(){
        const { equipmentid } = this.props;
        this.queryPoints(equipmentid);
    }

    componentWillReceiveProps(newProps) {
      if (this.props.equipmentid !== newProps.equipmentid) {
        this.queryPoints(newProps.equipmentid);
      }
    }
    
    onListCounterCodesByPage=(value, pageNo)=>{
      fetch(`${HOST}/api/countercodes/listByPage?pageNo=${pageNo}&object=${value}`,{  
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
          console.log(json);
          if(json)
          this.setState({
              jituanDataSource:json.items,
              pageNo: json.pageNo,
              total: json.total,
              searchValue: value,
          })
      }).catch((error)=>{
          alert(error);
      });
    }

    onSearchJT = (value)  => { 
      this.onListCounterCodesByPage(value, 1);
    }
  
    // 根据分页查询
    getListByPage = (pageNumber)  => { 
      this.onListCounterCodesByPage(this.state.searchValue, pageNumber);
    }
   

    queryPoints=(equipmentid)=>{
      const params = {equipmentid: equipmentid};
      this.onListPoints(params);
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
        fetch(`${HOST}/api/countercodes/${id}?rate=${row.rate}`,{  
          credentails: 'include',  
          mode: "cors",
          method:'PUT', 
          //body:JSON.stringify({'rate':row.rate}),
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
              //return response.json()
          }).catch((err)=>{
              message.error('访问网络出错',err);
          })

        this.queryPoints(this.props.equipmentid);
        this.setState({ editingKey: '' });
      });
    }

    cancel = () => {
      this.setState({ editingKey: '' });
    };

    render(){
        const userColumns=[
            {
                title:'采集点',
                key:'object',
                dataIndex:'object',
                
            },{
                title:'倍率',
                key:'rate',
                dataIndex:'rate',
                editable: true,
            },{
                title:'修改倍率',
                dataIndex:'author',
                key:'author',
                render:(text,record)=>{
                  const editable = this.isEditing(record);
                  return(
                    <div>
                      {editable ? (
                        <span>
                          <EditableContext.Consumer>
                            {form => (
                              <a
                                onClick={() => this.handleUpdate(form, record.counterId)}
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
                    </div>
                  );

                    //return(<a onClick={()=>this.autor(record)}><Icon type="edit" style={{marginRight:10}} /></a>);
                },
            },
        ]     

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
              inputType: col.dataIndex === 'type' ? 'select' : 'text',
              dataIndex: col.dataIndex,
              title: col.title,
              editing: this.isEditing(record),
            }),
          };
      });

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
            //console.log('props.points.items',this.props.points.items);
            //console.log('this.state.jituanSelectRowKeys',this.state.jituanSelectRowKeys);
            let rowkeys = [];
            let counteridList = [];
            this.props.points.items.map((item) => (counteridList.push(item.counterId)) );
            this.state.jituanSelectRowKeys.map((item) => 
              {
                if (counteridList.indexOf(item) < 0) 
                rowkeys.push(item); 
              }
            );
            //console.log('rowkeys',rowkeys);
            rowkeys.map((item) =>(this.onCreatePoints({ equipmentId: this.props.equipmentid, counterId:item})));
            this.queryPoints(this.props.equipmentid);                        
          }

        const removeButtonClick=()=>{
            if(this.state.localSelectRowKeys.length===0){
                message.info('请选择要移除的采集点!');
                return;
            }
            this.state.localSelectRowKeys.map((item) =>(this.onDeletePoints(item)));
            this.queryPoints(this.props.equipmentid);      
        }

        return(
          <Row>
            <Col span={11}>
                            
              <Card title="设备采集点">            
                <Table rowKey="id" pagination={false} size="small" rowSelection={localRowSelection} components={components} columns={columns} dataSource={this.props.points.items} />
              </Card>   
            </Col>
            <Col span={3} style={{textAlign:'center'}}>
              <div style={{margin:'50px 5px 5px 5px'}}>
                <Button type="primary" onClick={addButtonClick} style={{marginBottom:10}} icon="left">添加</Button>
                <Popconfirm title="确定要移除采集点吗?" placement="bottom" onConfirm={removeButtonClick}>
                  <Button type="dashed">移除<Icon type="right" /></Button>
                </Popconfirm>
              </div>
            </Col>
            <Col span={10}>
              <Card title="采集点" extra={<Search placeholder="请输入采集点名称" size="small" onSearch={this.onSearchJT} style={{ width: 180 }}/>}>            
                <Table 
                  rowKey='counterID' 
                  size="small" 
                  pagination={{total:Number(this.state.total), current:Number(this.state.pageNo), onChange:this.getListByPage}}
                  rowSelection={jituanRowSelection} 
                  columns={jtUserColumns} 
                  dataSource={this.state.jituanDataSource} />
              </Card>  
            </Col>
          </Row> 
        );
    }
}

export default connect(({ points }) =>({points}))(Points)