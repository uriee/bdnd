import React, { Component } from "react";
import TreeMenu from 'react-simple-tree-menu';

import {postData , groupBy } from "../Util/Util";
import '../../node_modules/react-simple-tree-menu/dist/main.css';
/*
Object.defineProperty(Array.prototype, 'flat', {
  value: function(depth = 1) {
    return this.reduce(function (flat, toFlatten) {
      return flat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flat(depth-1) : toFlatten);
    }, []);
  }
});
*/
class Vwall extends Component {


  state = {
    data : {}
  };


  getVWPresets = async () =>{
    let user_id = 0;
    try{
      user_id = JSON.parse(localStorage.getItem('user_object')).user_id
    }catch{
      console.log("ERROR: no user is loged in");
    }
    return await postData("http://10.0.0.240:8443/vwall",{"user_id" : user_id})
    .then(response => {
      
      if (response.status == 200) {
        return response

      } else{
          console.log("Error: ",response.message);
      }   
    })
    .catch(err => {
      console.log(err);
      return 0
    });
  }


  onClick = (item) => {
    const start_num = item.key.indexOf("/");
    const start_name = item.label.indexOf(":::");
    const preset_name = item.parent || item.label.substring(start_name +4) || "None"
    const layout_num = item.key.substring(start_num + 1) || "0"
    const user_name = JSON.parse(localStorage.getItem('user_object')).user_name
    console.log("fff",item, preset_name, layout_num, user_name)
    return postData("http://10.0.0.240:8443/set_vwall",{"preset_name" : preset_name, "layout_num": layout_num , "user_name": user_name})
    .then(response => {
      console.log("SET VWALL",response)
        if (response.status == 200) {
          console.log("YES");
        } else{
            console.log("Error: ",response.massage);                
        }       
    })
    .catch(err => {
      console.log(err);
    });    
  }

  fetchData = async () => {
    const {data} = await this.getVWPresets();
    const gb = groupBy(data,'preset_name')
    const tree = Object.keys(gb).map(x=> { return {
        key: x,
        label: "Preset ::: " +data.filter(y => y.preset_name == x)[0].preset_name,
        nodes : gb[x].map( y => {return {key : y.layout_id, label: y.vw_name +" ::: "+y.layout_name , nodes :[]}})
       }})
       console.log("tree",tree)
      this.setState({
        data : tree
      });
  }

  async componentDidMount() {
     await this.fetchData();
  }

  render() {
    
      
    return (
        <TreeMenu data={this.state.data} onClickItem={this.onClick} />
    );
  }
}

export default Vwall;

