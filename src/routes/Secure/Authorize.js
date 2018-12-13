import { Row,Col } from 'antd'
import React from 'react'

import AppUser from './Authorize/AppUser'
import Role from './Authorize/Role'

class Authorize extends React.PureComponent{
  
   render(){
       const { appid }=this.props;
       return(
         <Row>
           <Col span={10}>
             <Role appid={appid} />
           </Col>
           <Col span={14}  style={{paddingLeft:10}}>
             <AppUser appid={appid} />
           </Col>
         </Row>
       )
   }
}


export default Authorize