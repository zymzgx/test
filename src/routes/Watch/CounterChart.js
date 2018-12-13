import { Table, Input, InputNumber, Popconfirm, Form, Divider, Button, Modal, message, Col, Row, DatePicker, Card, Tabs } from 'antd';
import { TimelineChart } from 'components/Charts';
import moment from 'moment';
import React from 'react'
import { connect } from 'dva'
import PageheaderLayout from '../../layouts/PageHeaderLayout'

const FormItem = Form.Item;

const typeStatus = ['装船机', '卸船机', '皮带机', '斗轮机', '装车楼'];//1-5

@Form.create()
class CounterChart extends React.Component {

  constructor(props) {
    super(props);
    this.columns = [
        {
            title:'代码',
            dataIndex:'code',
            key:'code',
            width: '25%',
            editable: true,
        },
        {
            title:'装卸设备名称',
            dataIndex:'cname',
            key:'cname',
            width: '25%',
            editable: true,
        },  
        {
            title:'设备类型',
            dataIndex:'type',
            key:'type',
            width: '25%',
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
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {        
          return (
            <div>            
              <span>
                <a
                  href="javascript:;"
                  onClick={() => this.handleSelect(record.id)}
                  style={{ marginRight: 8 }}
                >
                查询
                </a>               
                </span>          
            </div>
          );
        },
      },
    ]; 
  }

  componentDidMount(){
    const { dispatch } = this.props;
   
    dispatch({
        type:'equipment/getCounterEquipment',
        payload:{},
    })
    console.log(this.props);
  }

  componentWillReceiveProps(nextProps){
 
  }
  
  handleSelect(key) {
    const { form, dispatch } =  this.props;
    form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
      if (!err) {
        dispatch({
          type: 'equipment/getCounterChart',
          payload: {id: key, date1: values.date.format('YYYY-MM-DD')},
        });
  
        //message.success('查询成功');
       }
    }); 
  }

  render() {
    const { form } = this.props;
 
    return (
      <PageheaderLayout>
        <Card
          bordered={false}
          bodyStyle={{ padding: '0 0 32px 0' }}
          //style={{ marginTop: 32 }}
        >

         <ul>
            {this.props.equipment.counterChartMaster.map(item => (
                 <li key={item.counterID}>
                   <span>{item.yname1}</span>
                <div style={{ padding: '0 24px' }}>                
                  <TimelineChart
                    height={200}
                    data={this.props.equipment.counterChartShow.filter((i) => i.counterID === item.counterID)}
                    titleMap={{ y1:"电表读数"}}
                  />
                </div>
                </li>    
            ))}
        </ ul>
        
        <Form>
        <Row style={{ height: 32 }}>                  
          <Col>
            <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 15 }} label="查询日期">
              {form.getFieldDecorator('date',{      
                    initialValue: moment(new Date(), 'YYYY-MM-DD'),              
                    rules: [{ required: true, message: '请选择查询日期' }],
                  })(
                <DatePicker placeholder="请输入查询日期" />
              )}
            </FormItem>
          </Col>          
        </Row>
        </Form>
        <Table
          //components={components}
          bordered
          dataSource={this.props.equipment.counterEquipment}
          columns={this.columns}
          rowClassName="editable-row"
          rowKey="id"
          pagination={{pageSize: 5}}
          size="small"
        />      
        </Card>
      </PageheaderLayout>
      );
    }
  }
  
  export default connect(({equipment, loading})=>({
    equipment, 
    //loading:loading.effects['equipment/fetchBasic'],
  }))(CounterChart);
  