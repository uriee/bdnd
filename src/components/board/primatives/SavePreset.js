import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import {postData} from "../../../Util/Util";

//import "./SavePreset.css";

const SForm = styled.form`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #37474f;
  /* Change width of the form depending if the bar is opened or not */
  width: ${props => (props.barOpened ? "20rem" : "2rem")};
  /* If bar opened, normal cursor on the whole form. If closed, show pointer on the whole form so user knows he can click to open it */
  cursor: ${props => (props.barOpened ? "auto" : "pointer")};
  padding: 1rem;
  height: 20px;
  border-radius: 10rem;
  transition: width 300ms cubic-bezier(0.645, 0.045, 0.355, 1);
`;

const SInput = styled.input`
  font-size: 20px;
  line-height: 1;
  background-color: transparent;
  width: 100%;
  margin-left: ${props => (props.barOpened ? "1rem" : "0rem")};
  border: none;
  color: white;
  transition: margin 300ms cubic-bezier(0.645, 0.045, 0.355, 1);

  &:focus,
  &:active {
    outline: none;
  }
  &::placeholder {
    color: white;
  }
`;

const SButton = styled.button`
  line-height: 1;
  pointer-events: ${props => (props.barOpened ? "auto" : "none")};
  cursor: ${props => (props.barOpened ? "pointer" : "none")};
  background-color: transparent;
  border: none;
  outline: none;
  color: white;
  font-size: 18px;
`;

export default  function SavePreset(state, pushpreset) {
  console.log("pushpreset",pushpreset)
  const [input, setInput] = useState("");
  const [barOpened, setBarOpened] = useState(false);
  const formRef = useRef();
  const inputFocus = useRef();


  const savePreset = async (preset_name) =>{
    const user_id = await JSON.parse(localStorage.getItem('user_object')).user_id
    return postData("http://10.0.0.240:8443/save_preset",{"preset_name": preset_name , "user_id": user_id, state : state})
    .then(response => {
      console.log("SAVE PRESET",response)
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

  const onFormSubmit = e => {
    // When form submited, clear input, close the searchbar and do something with input
    e.preventDefault();
    setInput("");
    setBarOpened(false);
    // After form submit, do what you want with the input value
    savePreset(input)
    console.log(`Form was submited with input: ${input}`);
    //pushpreset(input);
  };

  return (
    <div className="SavePreset">
      <SForm
        barOpened={barOpened}
        onClick={() => {
          // When form clicked, set state of baropened to true and focus the input
          setBarOpened(true);
          inputFocus.current.focus();
        }}
        // on focus open search bar
        onFocus={() => {
          setBarOpened(true);
          inputFocus.current.focus();
        }}
        // on blur close search bar
        onBlur={() => {
          setBarOpened(false);
        }}
        // On submit, call the onFormSubmit function
        onSubmit={onFormSubmit}
        ref={formRef}
      >
        <SButton type="submit" barOpened={barOpened}>
          save
        </SButton>
        <SInput
          onChange={e => setInput(e.target.value)}
          ref={inputFocus}
          value={input}
          barOpened={barOpened}
          placeholder="Enter New Preset Name"
        />
      </SForm>
    </div>
  );
}

