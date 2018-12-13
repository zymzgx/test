import { Table, Input, InputNumber, Popconfirm, Form, Divider, Button, Modal, message, Col, Row, DatePicker, Card, Tabs } from 'antd';
import { TimelineChart } from 'components/Charts';
import moment from 'moment';
import React from 'react'
import { connect } from 'dva'
import PageheaderLayout from '../../layouts/PageHeaderLayout'

const FormItem = Form.Item;

const typeStatus = ['装船机', '卸船机', '皮带机', '斗轮机', '装车楼'];//1-5

@Form.create()
class AiChart extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      selectedEquipmentKeys: [],  
      selectedRowKeys: [],
    };
    this.columns = [
        {
            title:'代码',
            dataIndex:'code',
            key:'code',
            width: '30%',
            editable: true,
        },
        {
            title:'装卸设备名称',
            dataIndex:'cname',
            key:'cname',
            width: '40%',
            editable: true,
        },  
        {
            title:'设备类型',
            dataIndex:'type',
            key:'type',
            width: '30%',
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
    ]; 

  }

  componentDidMount(){
    const { dispatch } = this.props;
   
    dispatch({
        type:'equipment/getAiEquipment',       
        payload:{},
    })
  }

  
  handleSelect = () => {
    const { form, dispatch } =  this.props;
    const {selectedRowKeys} = this.state;

    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'equipment/getAiChart',
          payload: { "obj":this.state.selectedRowKeys.join(","), date1: values.date.format('YYYY-MM-DD')},

        });
      }
    }); 
  }

  selectRow = (record) => {
    const selectedRowKeys = [...this.state.selectedRowKeys];
    if (selectedRowKeys.indexOf(record.key) >= 0) {
      selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
    } else {
      selectedRowKeys.push(record.key);
    }
    this.setState({ selectedRowKeys });
  }
  onSelectedRowKeysChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }

expandedRowRender = (record) => {
  
    const columns = [
      { title: 'Ai属性', dataIndex: 'ai', key: 'ai',width: '40%' },
      { title: '名称', dataIndex: 'object', key: 'object',width: '60%' },
    ];
 
let datadetails = [];
datadetails = this.props.equipment.aiEquipmentPoint.filter(items => items.id===record.id);

const { selectedRowKeys } = this.state;    
const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectedRowKeysChange,
    };
    return (
      <Table
        rowKey='aiid'
        rowSelection={rowSelection}        
        columns={columns}
        dataSource={datadetails}
        size="small"
        pagination={false}
        onRow={(record) => ({
          onClick: () => {
            this.selectRow(record);
          },
        })}
      />
      
    );
  };

  render() {
    const { form } = this.props;
    
    return (
      <PageheaderLayout>
        <Card
          bordered={false}
          bodyStyle={{ padding: '0 0 32px 0' }}
          //style={{ marginTop: 32 }}
        >
        <ul >
          {this.props.equipment.aiChartMaster.map(item => (             
            <li key={item.aiid}>
              <span>{item.yname1}</span>
              <div style={{ padding: '0 24px' }}>                
              <TimelineChart
                height={200}
                data={this.props.equipment.aiChart.filter((i) => i.aiid === item.aiid)}
                titleMap={{ y1:`${item.typename}`}}
              />
              </div>
            </li>
          ))}
        </ ul>
        

        <Form>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ height: 32 }}>                  
          <Col md={8} sm={24}>
            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="查询日期">
              {form.getFieldDecorator('date',{      
                    initialValue: moment(new Date(), 'YYYY-MM-DD'),              
                    rules: [{ required: true, message: '请选择查询日期' }],
                  })(
                <DatePicker placeholder="请输入查询日期" />                
              )}
            </FormItem>           
          </Col> 

          <Col md={16} sm={24}>          
            <Button type="primary" onClick={this.handleSelect} htmlType="submit">
              查询
            </Button>         
          </Col>
        </Row>
        </Form>

        <Table
        bordered
        rowKey="id"
        className="components-table-demo-nested"
        columns={this.columns}
        expandedRowRender ={this.expandedRowRender}
        pagination={{pageSize: 5}}
        size="small"
        dataSource={this.props.equipment.aiEquipment}
        />   
        </Card>
      </PageheaderLayout>
      );
    }
  }
  
  export default connect(({equipment,loading})=>({
    equipment, 
   }))(AiChart);
  