import { Table, Input, InputNumber, Popconfirm, Form, Divider, Button, Modal, message, Col, Row, DatePicker, Card, Tabs } from 'antd';
import { TimelineChart } from 'components/Charts';
import moment from 'moment';
import React from 'react'
import { connect } from 'dva'

const FormItem = Form.Item;

const typeStatus = ['装船机', '卸船机', '皮带机', '斗轮机', '装车楼'];//1-5

@Form.create()
class Equipment extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      currentTabKey: '',
    };
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
        type:'equipment/fetchBasic',
        payload:{},
    })
    console.log(this.props);
  }

  componentWillReceiveProps(nextProps){
  //  this.setState({data: nextProps.dataSource}); 
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
  
        message.success('查询成功');
        
        this.setState({
          chartShow: this.props.equipment.chartShow,
          currentTabKey: '',
        });
      }
    }); 
  }

  handleTabChange = key => {
    this.setState({
      currentTabKey: key,
    });
  };

  render() {
    const { form } = this.props;
    const { currentTabKey } = this.state;

    const activeKey = currentTabKey || (this.props.equipment.chartMaster[0] && this.props.equipment.chartMaster[0].counterID);

    return (
      <div>
        <Card
          bordered={false}
          bodyStyle={{ padding: '0 0 32px 0' }}
          //style={{ marginTop: 32 }}
        >
            <Tabs activeKey={activeKey} onChange={this.handleTabChange}>
            {this.props.equipment.chartMaster.map(item => (
              <Tabs.TabPane tab={item.yname1} key={item.counterID}>
                <div style={{ padding: '0 24px' }}>
                  <TimelineChart
                    height={400}
                    data={this.props.equipment.chartShow.filter((i) => i.counterID === item.counterID)}
                    titleMap={{ y1: '电度量' }}
                  />
                </div>
              </Tabs.TabPane>
            ))}
          </Tabs>
        </Card>
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
          dataSource={this.props.equipment.dataSource}
          columns={this.columns}
          rowClassName="editable-row"
          rowKey="id"
          pagination={{pageSize: 5}}
          size="small"
        />      
      </div>
      );
    }
  }
  
  export default connect(({equipment, loading})=>({
    equipment, 
    //chartShow:equipment.chartShow,
    loading:loading.effects['equipment/fetchBasic'],
  }))(Equipment);
  