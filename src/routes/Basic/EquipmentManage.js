import { Row,Col, Card } from 'antd'
import React from 'react'

import PageheaderLayout from '../../layouts/PageHeaderLayout'

import Points from './Points'
import Equipment from './Equipment'

class EquipmentManage extends React.PureComponent{
  constructor(props){
    super(props);
    this.state = {
      equipmentid : 0,
    };

  }

  changeHandler(value) {
    this.setState({
      equipmentid: value
    });
  }

   render(){
       //const { appid }=this.props;
       return(
         
         <PageheaderLayout>
         <Card>
         <Row>
           <Col span={9}>
             <Equipment onChange={this.changeHandler.bind(this)} />
           </Col>
           <Col span={15}  style={{paddingLeft:10}}>
             <Points equipmentid={this.state.equipmentid} />
           </Col>
         </Row>
         </Card>
       </PageheaderLayout>
       )
   }
}


export default EquipmentManage