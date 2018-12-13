import { Row, Col, Card, Icon } from 'antd'
import React from 'react'
import PageheaderLayout from '../../layouts/PageHeaderLayout'

import LoadCar from './LoadCar'
import LoadCarEquipment from './LoadCarEquipment'

class LoadCarManage extends React.PureComponent{
  constructor(props){
    super(props);
    this.state = {
      loadcarId: 0,
    };

  }

  changeHandler(value) {
    this.setState({
      loadcarId: value
    });
  }


   render(){
       return(
         <PageheaderLayout>
         <Card>
         <Row>
           <Col span={15}>
             <LoadCar onChange={this.changeHandler.bind(this)}  />
           </Col>
           <Col span={9}  style={{paddingLeft:10}}>
            <LoadCarEquipment loadcarId={this.state.loadcarId} />
           </Col>
         </Row>
         </Card>
       </PageheaderLayout>
       )
   }
}


export default LoadCarManage;
