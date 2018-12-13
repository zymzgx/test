import { Row, Col, Card, Icon } from 'antd'
import React from 'react'
import { connect } from 'dva';
import PageheaderLayout from '../../layouts/PageHeaderLayout'
import { routerRedux } from 'dva/router';

import Load from './Load'
import LoadEquipment from './LoadEquipment'

class LoadManage extends React.PureComponent{
  constructor(props){
    super(props);
    this.state = {
      loadPlanId : this.props.location.search.replace('?key=', ''),
      loadId: 0,
    };

  }

  onGetLoadPlanById = (id) => {
    const { dispatch } = this.props;
    dispatch({type: 'load/getLoadPlanById', payload: {id}});
    };

  componentDidMount(){
    this.onGetLoadPlanById(this.state.loadPlanId);
}

  changeHandler(value) {
    this.setState({
      loadId: value
    });
  }

  back() {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/work/loadplan`));
  }

   render(){
    const content = (
      <div >
        <div >
          <p>开工日期：{this.props.load.loadPlan.beginDate}   /    
             船名：{this.props.load.loadPlan.shipName}  /  
             货名：{this.props.load.loadPlan.cargoName}  /  
             货物总量：{this.props.load.loadPlan.totalWeight}</p>
          <a onClick={() => this.back()}>
            <Icon type="left-circle" /> 返回
          </a>
        </div>
      </div>
    );

       return(
         <PageheaderLayout title="装船计划" content={content}>
         <Card>
         <Row>
           <Col span={14}>
             <Load onChange={this.changeHandler.bind(this)}  loadPlanId={this.state.loadPlanId} />
           </Col>
           <Col span={10}  style={{paddingLeft:10}}>
            <LoadEquipment loadId={this.state.loadId} />
           </Col>
         </Row>
         </Card>
       </PageheaderLayout>
       )
   }
}


export default connect(({ load }) => ({load}))(LoadManage);
