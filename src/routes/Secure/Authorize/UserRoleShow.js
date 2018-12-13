import React from 'react'

class UserRoleShow extends React.Component{
   
    render(){ 
        const { rolesDesc } = this.props
        return(
          <div style={{fontSize:10}}>
            {                
                `{${rolesDesc===undefined?'未授权':rolesDesc}`
            }
          </div>
        )
    }
}

export default UserRoleShow;