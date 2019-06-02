import React, {Component} from 'react';

class Periodo extends Component{

    constructor(props){
        super(props);
        this.state = {
            titulo : props.titulo
        };
    }

    render(){
        return(
            <div className="form-group">
                <label>{this.state.titulo}</label>
                <select className="form-control" value={this.state.anio} onChange={this.props.cambiar}>
                    <option value="2009">2009</option>
                    <option value="2010">2010</option>
                    <option value="2011">2011</option>
                    <option value="2012">2012</option>
                    <option value="2013">2013</option>
                    <option value="2014">2014</option>
                    <option value="2015">2015</option>
                    <option value="2016">2016</option>
                    <option value="2017">2017</option>
                    <option value="2018">2018</option>
                    <option value="2018-2">2018-2</option>
                </select>
            </div>
        )
    }
}

export default Periodo;
