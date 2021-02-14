import React, { Component } from "react";
import styled from "@emotion/styled";
import { Global, css } from "@emotion/core";
import { colors } from "@atlaskit/theme";
//import { Fab, Action } from 'react-tiny-fab';
import { Fab, Action } from "../fab/index.tsx";
import SavePreset from "./primatives/SavePreset";
import Column from "./column";
import {postData} from "../../Util/Util";
import reorder, { reorderQuoteMap } from "./reorder";
import { DragDropContext, Droppable, resetServerContext } from "react-beautiful-dnd";
import { getUnitsState } from "./data";
import io from 'socket.io-client';
const socket = io("http://10.0.0.240:8443");

socket.emit('hello',{messgae :'hello'});

const ParentContainer = styled.div`
  /* height: ${({ height }) => height}; */
  /* overflow-x: hidden;
  overflow-y: auto; */
  /*flex-wrap: wrap;*/
`;

const Container = styled.div`
  /*background-color: ${colors.B100};*/
  /* min-height: 100vh; */
  /* like display:flex but will allow bleeding over the window width */
  /* min-width: 100vw; */
  display: inline-flex;
  flex-wrap: wrap;
`;

class Board extends Component {
  /* eslint-disable react/sort-comp */
  static defaultProps = {
    isCombineEnabled: false
  };

  state = {
    columns: [],
    ordered: [],
    rxs_by_id : {},
    presets: [],
    txs: [],
    last_render : 0
  };

  fetchData = async (route) => {
    const {state, txs ,presets} = await getUnitsState();
    
    if (state) {
      let rxs_by_id = {}
      Object.keys(state).map(x => state[x].map( rx => rxs_by_id[rx.id] = {name : rx.name, mac: rx.mac}))
      let ordered = this.state.ordered
      Object.keys(state).map(tx=>{
        if(!ordered.includes(tx)) {
          ordered = ordered.concat(tx)
        }
      })

      this.setState({
        columns: state,
        ordered: ordered,
        rxs_by_id: rxs_by_id,
        presets: presets,
        txs: txs,
        last_render : new Date()
      });
    }    
  }

  async componentDidMount() {
    socket.on('route', async massage => {
      console.log("got massage :",massage)
      console.log("last_render :",this.state.last_render)
      let route = {}
      try{
        route = JSON.parse(massage)
      }catch(e){
        console.log("error parsing JSON:",massage)
      }
      await this.fetchData(route);
    });
    if (this.state.last_render == 0) await this.fetchData();
  }

  boardRef;

  pushpreset = (preset)=> {
    this.setState({
      presets: [...this.state.presets, preset]
    });
  }
  
  changeColumn = (result, simulated) => {
    const rx = this.state.rxs_by_id[result.draggableId] && this.state.rxs_by_id[result.draggableId].name;
    const rx_mac = this.state.rxs_by_id[result.draggableId] && this.state.rxs_by_id[result.draggableId].mac
    const tx = result.destination && result.destination.droppableId;
    console.log("FT",result,this.state);
    console.log("RX:",rx,"\nTX:",tx,"/nRX_MAC:",rx_mac);
    if (result.combine) {
      if (result.type === "COLUMN") {
        const shallow = [...this.state.ordered];
        shallow.splice(result.source.index, 1);
        this.setState({ ordered: shallow });
        return;
      }

      const column = this.state.columns[result.source.droppableId];
      const withQuoteRemoved = [...column];
      withQuoteRemoved.splice(result.source.index, 1);
      const columns = {
        ...this.state.columns,
        [result.source.droppableId]: withQuoteRemoved
      };
      console.log("columns:",columns)
      this.setState({ columns });
      return;
    }

    // dropped nowhere
    if (!result.destination) {
      return;
    }

    const source = result.source;
    const destination = result.destination;

    // did not move anywhere - can bail early
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // reordering column
    if (result.type === "COLUMN") {
      const ordered = reorder(
        this.state.ordered,
        source.index,
        destination.index
      );

      this.setState({
        ordered
      });

      return;
    }
    if(!simulated) {
    // USE API
      console.log("XXXXXXXXXXXX:",tx)
      if(tx == "Available Rxs") {
        postData("http://10.0.0.240:8443/disconnect",{"rx": rx_mac})
        .then(response => {
            console.log("DIS RES",response)
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
      else{
        postData("http://10.0.0.240:8443/connect",{"rx": rx, "tx": tx})
        .then(response => {
          console.log("CON RES",response)
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
    }

    const data = reorderQuoteMap({
      quoteMap: this.state.columns,
      source,
      destination
    });

    this.setState({
      columns: data.quoteMap
    });
  };

  onDragEnd = result => this.changeColumn(result,0)

  setPreset = (preset_name) =>{
    return postData("http://10.0.0.240:8443/set_preset",{"preset_name": preset_name})
    .then(response => {
      console.log("SET PRESET",response)
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

  render() {
    const columns = this.state.columns;
    const ordered = this.state.ordered;
    const presets = this.state.presets;
    const { containerHeight } = this.props;
    const board = (
      <Droppable
        droppableId="board"
        type="COLUMN"
        direction="horizontal"
        ignoreContainerClipping={Boolean(containerHeight)}
        isCombineEnabled={this.props.isCombineEnabled}
      >
        {provided => (
          <Container ref={provided.innerRef} {...provided.droppableProps}>
            {ordered.map((key, index) => (
              <Column
                key={key}
                index={index}
                title={key}
                quotes={columns[key]}
                isScrollable={this.props.withScrollableColumns}
                isCombineEnabled={this.props.isCombineEnabled}
              />
            ))}
            {provided.placeholder}
          </Container>
        )}
      </Droppable>
    );
    
    const current_set = this.state.txs
      .filter(x=> x.mac)
      .map(tx=> {
        return this.state.columns[tx.name].map(rx =>{
          //current_set.push({tx: tx.mac, rx: rx.mac})
          return {tx: tx.mac, rx: rx.mac}
        })
      })
      .flat()
    console.log("PEREE",current_set)
      
    return (
      <React.Fragment>

      <Fab alwaysShowTitle={true} icon='Preset' event={'click'} mainButtonStyles={{ backgroundColor: '#27ae60'}}>

      {
          <SavePreset state={current_set} pushpreset={()=> console.log("PPPPPpushpreset")}/>
      }          
      {
        this.state.presets.map(preset => (<Action key={preset.name} onClick={() => this.setPreset(preset.name)}>{preset.name}</Action>))
      }
          
      </Fab>

        <DragDropContext onDragEnd={this.onDragEnd}>
          {containerHeight ? (
            <ParentContainer height={containerHeight}>{board}</ParentContainer>
          ) : (
            board
          )}
        </DragDropContext>
        <Global
          styles={css`
          .css-19q5lcn {
              background: ${colors.B75};
            }
          `}
        />
      </React.Fragment>
    );
  }
}

export default Board;
//const rootElement = document.getElementById("root");
//ReactDOM.render(<Board initial={authorQuoteMap} />, rootElement);
