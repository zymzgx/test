import { Row, Col, Card, Icon } from 'antd'
import React from 'react'
import { connect } from 'dva';
import PageheaderLayout from '../../layouts/PageHeaderLayout'
import { routerRedux } from 'dva/router';

import Unload from './Unload'
import UnloadEquipment from './UnloadEquipment'

class UnloadManage extends React.PureComponent{
  constructor(props){
    super(props);
    this.state = {
      unloadPlanId : this.props.location.search.replace('?key=', ''),
      unloadId: 0,
    };

  }

  onGetUnloadPlanById = (id) => {
    const { dispatch } = this.props;
    dispatch({type: 'unload/getUnloadPlanById', payload: {id}});
    };

  componentDidMount(){
    this.onGetUnloadPlanById(this.state.unloadPlanId);
}

  changeHandler(value) {
    this.setState({
      unloadId: value
    });
  }

  back() {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/work/unloadplan`));
  }

   render(){
    const content = (
      <div >
        <div >
          <p>开工日期：{this.props.unload.unloadPlan.beginDate}   /    
             船名：{this.props.unload.unloadPlan.shipName}  /  
             货名：{this.props.unload.unloadPlan.cargoName}  /  
             货物总量：{this.props.unload.unloadPlan.totalWeight}</p>
          <a onClick={() => this.back()}>
            <Icon type="left-circle" /> 返回
          </a>
        </div>
      </div>
    );

       return(
         <PageheaderLayout title="卸船计划" content={content}>
         <Card>
         <Row>
           <Col span={14}>
             <Unload onChange={this.changeHandler.bind(this)}  unloadPlanId={this.state.unloadPlanId} />
           </Col>
           <Col span={10}  style={{paddingLeft:10}}>
            <UnloadEquipment unloadId={this.state.unloadId} />
           </Col>
         </Row>
         </Card>
       </PageheaderLayout>
       )
   }
}


export default connect(({ unload }) => ({unload}))(UnloadManage);
