import React, { Component } from "react";
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import logo from './bg-clouds.jpg';
import './App.css';

class App extends Component{
  constructor(props){
      super(props);
      this.state = { 
        currentTemp: {temp_f:"",condition: {text:"",icon:""}}, 
        location: {name:"",region:"",country:"", localtime:new Date().toDateString()}, 
        forecast:{
          forecastday:[{
            date:"",
            day:{
              maxtemp_f:"",
              mintemp_f:"",
              condition:{
                text:"",
                icon:""
              }
            }
          }]
        },
        weatherWindow: "none", 
        weatherError: "none", 
        errorCode: "", 
        zipCode: "" 
      };
  }
  getWeather(){
    //CLEAN FORM
    this.setState({weatherError:"none"});
    this.setState({errorCode:""});
    this.setState({weatherWindow:"none"});
      //Query Data
      if(this.state.zipCode.length > 4){//and number
        fetch("http://localhost:7744/weather/"+this.state.zipCode)
            .then(res => res.text())
            .then(res => {
              //CHECK IF ERROR
              if (JSON.parse(res).error) {
                console.log(res);
                this.setState({ errorCode: JSON.parse(res).error.message });
                this.setState({ weatherWindow: "inline" });
              }else{
                this.setState({ location: JSON.parse(res).location });
                this.setState({ forecast: JSON.parse(res).forecast });
                this.setState({ currentTemp: JSON.parse(res).current });
                this.setState({ weatherWindow: "inline" });
              }
            });
      }else{
        this.setState({weatherError:"inline"});
      }
    
  }
  
  render(){
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    //THIS forecastItems COULD HAVE BEEN MOVED TO ITS OWN COMPONENT
    const forecastItems = this.state.forecast.forecastday.map(item =>
      <Col md="3" className="text-center" style={{zIndex: "40", borderRadius: "5px",backgroundColor: "rgba(0,0,0,0.3)", display: this.state.weatherWindow}}>
        <h4 className="text-white">{weekday[new Date(item.date).getDay()]}</h4>
        <img src={item.day.condition.icon} className="img-responsive" />
        <h4 className="text-white">{item.day.condition.text}</h4>
        <h2 className="text-white">{Math.round(item.day.maxtemp_f)}&#8457;/{Math.round(item.day.mintemp_f)}&#8457;</h2>
      </Col>
    );
    return (
      <Container fluid="true">
        <img src={logo} style={{zIndex: "20"}} className="w-100 position-absolute" alt="logo" />
        <Row>
          <Col md="3"></Col>
          <Col md="6" className="text-center" style={{zIndex: "40"}}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Get Weather Forecast For Zipcode</Form.Label>
              <Form.Control type="number"  placeholder="zip code" onChange={e=>{this.setState({zipCode: e.target.value})}}/>
              <Form.Text className="text-warning" style={{display: this.state.weatherError}}>
                Please Enter Valid Zipcode
              </Form.Text>
              {this.state.errorCode}
            </Form.Group>
            <Button onClick={() => this.getWeather()}>Get Forecast</Button>
          </Col>
          <Col md="3"></Col>
        </Row>
        <Row>  
          <Col md="12" className="text-center" style={{zIndex: "40", borderRadius: "5px",backgroundColor: "rgba(0,0,0,0.3)", display: this.state.weatherWindow}}>
            <h2 className="text-white">{this.state.location.name +", "+this.state.location.region}</h2>
            <h3 className="text-white">{this.state.location.localtime}</h3>
          </Col>
          <Col md="3" className="text-center" style={{zIndex: "40", borderRadius: "5px",backgroundColor: "rgba(0,0,0,0.3)", display: this.state.weatherWindow}}>
            <h4 className="text-white">Current Weather</h4>
            <img src={this.state.currentTemp.condition.icon} className="img-responsive" />
            <h4 className="text-white">{this.state.currentTemp.condition.text}</h4>
            <h2 className="text-white">{Math.round(this.state.currentTemp.temp_f)}&#8457;</h2>
          </Col>
          {forecastItems}
        </Row>
      </Container>
    );
  }
  
}

export default App;
