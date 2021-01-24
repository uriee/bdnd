import { colors } from "@atlaskit/theme";
import {postData} from "../../Util/Util";


export const getUnitsState = async () =>{

 return await postData("https://localhost:8443/get_units",{"user_id" : 1})
  .then(response => {
    
    if (response.status == 200) {
        const units = response.data
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
          name: "Avaiable Rxs",
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
        return state
    } else{
        console.log("Error: ",response.message);
    }
    
  })
  .catch(err => {
    console.log(err);
    return 0
  });
}


const Avaiable_Rxs = {
  id: "1",
  name: "Avaiable Rxs",
  colors: {
    soft: colors.Y50,
    hard: colors.Y200
  }
};

const BMO = {
  id: "2",
  name: "Tx 1",
  colors: {
    soft: colors.G50,
    hard: colors.G200
  }
};

const finn = {
  id: "3",
  name: "Tx 2",
  colors: {
    soft: colors.B50,
    hard: colors.B200
  }
};

const princess = {
  id: "4",
  name: "Tx 3",
  colors: {
    soft: colors.P50,
    hard: colors.P200
  }
};

export const groups = [Avaiable_Rxs, BMO, finn, princess];

export const quotes = [
  {
    id: "1",
    content: "Sometimes life is scary and dark",
    group: BMO
  },
  {
    id: "2",
    content:
      "Sucking at something is the first step towards being sorta good at something.",
    group: Avaiable_Rxs
  },
  {
    id: "3",
    content: "You got to focus on what's real, man",
    group: Avaiable_Rxs
  },
  {
    id: "4",
    content: "Is that where creativity comes from? From sad biz?",
    group: finn
  },
  {
    id: "5",
    content: "Homies help homies. Always",
    group: finn
  },
  {
    id: "6",
    content: "Responsibility demands sacrifice",
    group: princess
  },
  {
    id: "7",
    content: "That's it! The answer was so simple, I was too smart to see it!",
    group: princess
  },
  {
    id: "8",
    content: "People make mistakes. It’s a part of growing up",
    group: finn
  },
  {
    id: "9",
    content: "Don't you always call sweatpants 'give up on life pants,' Avaiable_Rxs?",
    group: finn
  },
  {
    id: "10",
    content: "I should not have drunk that much tea!",
    group: princess
  },
  {
    id: "11",
    content: "Please! I need the real you!",
    group: princess
  },
  {
    id: "12",
    content: "Haven't slept for a solid 83 hours, but, yeah, I'm good.",
    group: princess
  }
];

const getBygroup = (group, items) =>
  items.filter(quote => quote.group === group);
/*
export const Rxs(user_id) => {}
*/
const xxx = 
groups.reduce(
  (previous, group) => ({
    ...previous,
    [group.name]: getBygroup(group, quotes)
  }),
  {}
);

