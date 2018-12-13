import React from 'react'
import { Button,Input } from 'antd'

const { Search } = Input;
class AppMenu extends React.PureComponent{

    render(){
        const { onSearch,rigister } = this.props

        return(
          <div style={{borderLeft:'1px dashed #ccc',marginLeft:'10px',paddingLeft:'10px',minHeight:200}}>
            <Search placeholder="请输入查询内容" style={{width:200,marginBottom:16}} onSearch={onSearch} />
            <br />
            <Button icon="plus" type="dashed" onClick={rigister} style={{marginBottom:16}}>注册应用</Button>
          </div>           
        );
    }
}

export default AppMenu;