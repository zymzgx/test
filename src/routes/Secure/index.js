import { Tabs,Card } from 'antd'
import React from 'react'

import AppList from './AppList'
import Authorize from './Authorize'
import PageheaderLayout from '../../layouts/PageHeaderLayout'
import UserList from './UserList'

const { TabPane } = Tabs

class Secure extends React.PureComponent{
    constructor(props){
        super(props)
        this.newTabIndex=0;
        const panes=[
            {
                title:'用户管理',
                key:'1',
                content:<UserList />,
                closable:false,
            },
            {
                title:'应用管理',
                key:'2',
                content:<AppList AddTab={(record)=>this.add(record)} />,
                closable:false,
            },
        ]
         
        this.state={
            selectKey:panes[1].key,
            panes,
        }
    }
    onChange = (selectKey) => {
        this.setState({ selectKey });
    }
    onEdit = (targetKey, action) => {
        this[action](targetKey);
    }
    add = (record) => {
        const { panes } = this.state;
        this.newTabIndex=this.newTabIndex+1;
        const selectKey = `newTab${this.newTabIndex}`;
        panes.push({ title:`${this.newTabIndex}:${record.name}`, content: <Authorize appid={record.id} />, key: selectKey });
        this.setState({ panes, selectKey });
    }
    remove = (targetKey) => {
        let { selectKey } = this.state;
        let lastIndex;
        this.state.panes.forEach((pane, i) => {
          if (pane.key === targetKey) {
            lastIndex = i - 1;
          }
        });
        const panes = this.state.panes.filter(pane => pane.key !== targetKey);
        if (lastIndex >= 0 && selectKey === targetKey) {
            selectKey = panes[lastIndex].key;
        }
        this.setState({ panes, selectKey });
    }

    render(){
        const { selectKey } = this.state;
        return(
          <PageheaderLayout>
            <Card>
              <Tabs
                hideAdd            
                onChange={this.onChange}
                activeKey={selectKey}
                type="editable-card"
                onEdit={this.onEdit}
              >
                {this.state.panes.map(pane=><TabPane tab={pane.title} key={pane.key} closable={pane.closable}>{pane.content}</TabPane>)}            
              </Tabs>
            </Card>
          </PageheaderLayout>
        );
    }
}

export default Secure