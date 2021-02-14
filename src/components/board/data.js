import { colors } from "@atlaskit/theme";
import {postData} from "../../Util/Util";


export const getUnitsState = async () =>{
  let user_id = 0;
  try{
    user_id = JSON.parse(localStorage.getItem('user_object')).user_id
  }catch{
    console.log("ERROR: no user is loged in");
  }
  return await postData("http://10.0.0.240:8443/get_units",{"user_id" : user_id})
  .then(response => {
    
    if (response.status == 200) {
      console.log(response)
        const presets = JSON.parse(response.ret.presets)
        const units = JSON.parse(response.ret.units)
        
        console.log("u:",units ,"P",presets)
        //const presets = response.data.presets
        const txs = units.filter((x)=> x.model == 0).map((x)=> {
          return {...x ,
                  colors: {
                    soft: colors.Y50,
                    hard: colors.Y200
                  },
                  id : x.id+"",
                 }
          });
          console.log("tx:",txs)
        const available_rxs = {
          id : "-1",
          name: "Available Rxs",
          colors: {
            soft: colors.G50,
            hard: colors.G200
          },
        } 
        const groups = [available_rxs, ...txs]
        console.log("groups:",groups)
        const rxs = units.filter((x)=> x.model == 1).map((x)=> {
          return {...x ,
                  content: x.name + ":" + x.ip,
                  id : x.id+"",
                  group_id : (x.tx ? x.tx : "-1"),
                  group: (x.tx ? txs.filter(y => y.id == x.tx)[0] : available_rxs),
                  mac : x.mac
                 }
          });   
          
          console.log("rx:",rxs)
        const state = groups.reduce(
          (previous, group) => ({
            ...previous,
            [group.name]: rxs.filter((x)=> x.group_id == group.id)
          }),
          {}
        );          
        console.log("RES:",txs,rxs,state)
        return {
          state : state,
          txs : groups.map(x=> { return {mac : x.mac, name : x.name}}),
          presets : presets
        }
    } else{
        console.log("Error: ",response.message);
    }
    
  })
  .catch(err => {
    console.log(err);
    return 0
  });
}