/* App.js */

import React, { Component } from 'react';
import {Tabs, Tab} from 'react-bootstrap-tabs';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
// import DemandaSocial from './../DemandaSocial/DemandaSocial';
// import Movilidad from './../Movilidad/Movilidad';
// import SelectGrafica from "./../../componentes/selectForGrafica";
// import RelacionAlumnos from './../RelacionAlumnos/RelacionAlumnos';
// import ProgramaAlumnos from './../ProgramaAlumnos/ProgramaAlumnos';
// import PoblacionEstudiantil from './../PoblacionEstudiantil/PoblacionEstudiantil';
//import { slide as Menu } from 'react-burger-menu';
//import Formulario from "./../../componentes/formulario";
import './index.css';
import App from '../../App';
import EstadoAlumno from './../EstadoAlumno/EstadoAlumno'
import TiposDeBeneficio from './../TiposDeBeneficio/TiposDeBeneficio'
import EstadoPermanencia from '../EstadoPermanencia/EstadoPermanencia';
import Movilidad from './../Movilidad/Movilidad';
import RelacionAlumnos from './../RelacionAlumnos/RelacionAlumnos';
import ProgramaAlumnos from './../ProgramaAlumnos/ProgramaAlumnos';
import PoblacionEstudiantil from './../PoblacionEstudiantil/PoblacionEstudiantil';
import SelectAnios from './../../ComponentesConst/SeleccionAnios';
import Periodos from './../../ComponentesConst/Periodo';
import Parser from 'html-react-parser';

let opcionGlobal = 1;
let AnioIni = 2014;
let AnioFin = 2018;
let Grafico = "columnasMultiples";


class Index extends Component {

    constructor(){//constructor inicial
        super();
        this.state = {
            opcion:1,
            opcionFiltro:'intervalo',
            periodo:2009,
            anioini:2014,
            aniofin:2018,
            htmlGrafica:'',
            grafico:'columnasMultiples'
        };
        this.handleChangeOpcion = this.handleChangeOpcion.bind(this);
        this.handleChangeOpcionFiltro = this.handleChangeOpcionFiltro.bind(this);
        this.handleApretarBoton = this.handleApretarBoton.bind(this);
        this.handleChangePeriodo = this.handleChangePeriodo.bind(this);
        this.handleChangeAnioIni = this.handleChangeAnioIni.bind(this);
        this.handleChangeAnioFin = this.handleChangeAnioFin.bind(this);
        this.handleChangeGrafico = this.handleChangeGrafico.bind(this);
        this.state.htmlGrafica = '<option value="columnasMultiples">Columnas Mútliples</option>';
        this.state.htmlGrafica +='<option value="barrasHMultiples">Barras H Múltiples</option>';
        this.state.htmlGrafica +='<option value="splineMultiple">Spline Múltiple</option>';
    }

    handleChangeOpcion(event) { // cambiar opcion
        var cadenaGrafica='';
        var primeraGrafica='';
        if(event.target.value==3){
            // cadenaGrafica = '<option value="pie">Pie</option>';
            // cadenaGrafica += '<option value="pyramid">Pirámide</option>';
            // cadenaGrafica += '<option value="funnel">Funeral</option>';
            // primeraGrafica = "pie";
            cadenaGrafica = '<option value="columnasMultiples">Columnas Mútliples</option>';
            cadenaGrafica +='<option value="barrasHMultiples">Barras H Múltiples</option>';
            cadenaGrafica +='<option value="splineMultiple">Spline Múltiple</option>';
            primeraGrafica = "columnasMultiples";
        }else if(event.target.value==1){
            cadenaGrafica = '<option value="columnasMultiples">Columnas Mútliples</option>';
            cadenaGrafica +='<option value="barrasHMultiples">Barras H Múltiples</option>';
            cadenaGrafica +='<option value="splineMultiple">Spline Múltiple</option>';
            primeraGrafica = "columnasMultiples";
        }else if(event.target.value==4){
            cadenaGrafica = '<option value="column">Columnas Mútliples</option>';
            cadenaGrafica +='<option value="bar">Barras H Múltiples</option>';
            cadenaGrafica +='<option value="spline">Spline Múltiple</option>';
            primeraGrafica = "column";
        }else if(event.target.value==5){
            cadenaGrafica = '<option value="column">Columnas</option>';
            cadenaGrafica +='<option value="bar">Barras H</option>';
            cadenaGrafica +='<option value="spline">Spline</option>';
            primeraGrafica = "column";
        }else if(event.target.value==6){
            cadenaGrafica = '<option value="column">Columnas Mútliples</option>';
            cadenaGrafica +='<option value="bar">Barras H Múltiples</option>';
            cadenaGrafica +='<option value="spline">Spline Múltiple</option>';
            primeraGrafica = "column";
        }else if(event.target.value==7){
            cadenaGrafica = '<option value="column">Columnas</option>';
            cadenaGrafica +='<option value="bar">Barras H</option>';
            cadenaGrafica +='<option value="spline">Spline</option>';
            primeraGrafica = "column";
        }
        

        this.setState({
            opcion: event.target.value,
            htmlGrafica:cadenaGrafica,
            grafico : primeraGrafica
        });
    }

    handleChangeOpcionFiltro(event) { // cambiar opcion de Filtro
        this.setState({
            opcionFiltro: event.target.value
        });
        
    }

    handleApretarBoton(event){
        let opcion = this.state.opcionFiltro;
        opcionGlobal = this.state.opcion;

        if(opcion == 'periodo'){
            //console.log("GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
            AnioIni = this.state.periodo;
            AnioFin = this.state.periodo;
            Grafico = this.state.grafico;
        }else{
            //console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
            AnioIni = this.state.anioini;
            AnioFin = this.state.aniofin;
            Grafico = this.state.grafico;
        }

    }

    handleChangePeriodo(event){
        this.setState({
            periodo: event.target.value
        });
    }

    handleChangeAnioIni(event) { // cambiar año inicial solo si no es mayor a año final
        //console.log(event.target.value);
        if(parseInt(event.target.value,0) > parseInt(this.state.aniofin,0)){
            this.setState({
                anioini: this.state.aniofin
            });
        }else{
            this.setState({
                anioini: event.target.value
            });
        }
    }

    handleChangeAnioFin(event) {  // cambiar año final solo si este no es menor a año inicial
        //console.log(event.target.value);
        if(parseInt(event.target.value,0) < parseInt(this.state.anioini,0)){
            this.setState({
                aniofin: this.state.anioini
            });
        }else{
            this.setState({
                aniofin: event.target.value
            });
        }
    }

    handleChangeGrafico(event) { // cambiar grafico
        this.setState({
            grafico: event.target.value
        });
    }


    render() {
        const op = this.state.opcionFiltro;
        
        return (

            <Router>
                <div className = "row">
                    <div className = "panel col-md-2.5" style = {{ marginLeft: 15 }}>
                        <Tabs align = "center" className = "textTab">
                            <Tab label = "Datos" className = "panelDibujado">
                                <div className="form-group">
                                    <label className="textLabel">Tipo:</label>
                                    <select className="form-control textSelect" value = {this.state.opcion} onChange={this.handleChangeOpcion}>
                                        <option value="4">Demanda Social</option>
                                        <option value="1">Estado de Permanencia</option>
                                        <option value="3">Estado de Permanencia General</option>
                                        <option value="5">Población Estudiantil</option>
                                        <option value="6">Tipos de Beneficio</option>
                                        <option value="7">Estado de Alumno</option>
                                        <option disabled value="2">Movilidad</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="textLabel">Filtro:</label>
                                    <select className="form-control textSelect" value={this.state.opcionFiltro} onChange={this.handleChangeOpcionFiltro}>
                                        <option value="periodo">Periodo</option>
                                        <option value="intervalo">Intervalo de años</option>
                                    </select>
                                </div>

                                {op === 'periodo' ? (
                                    <div>
                                        <Periodos titulo="Periodo:" periodo={this.state.periodo} cambiar={this.handleChangePeriodo} />
                                    </div>
                                ) : (null)}

                                {op === 'intervalo' ? (
                                    <div>
                                        <div className="form-group">
                                            <SelectAnios titulo="Año inicial:" anio={this.state.anioini} cambiar={this.handleChangeAnioIni} />
                                        </div>
                                        <div className="form-group">
                                            <SelectAnios titulo="Año final:" anio={this.state.aniofin} cambiar={this.handleChangeAnioFin} />
                                        </div>
                                    </div>
                                ) : (null)}
                                
                                <div className="form-group">
                                    <label className="textLabel">Tipo de grafica:</label>
                                    <select className="form-control textSelect" value={this.state.grafico} onChange={this.handleChangeGrafico}>
                                        {Parser(this.state.htmlGrafica)}  
                                    </select>
                                </div>

                                <button className="btn btn-success btn-block textLabel" onClick={this.handleApretarBoton}><Link to="/" className="btn btn-success btn-block" >Generar Gráfica</Link></button>
                            
                            </Tab>

                        </Tabs>
                    </div>
                    <div className="panel col-md-9">
                        <Route path='/' component={miFuncion} />
                    </div>
                </div>
            </Router>
        );
    }

    
}

function miFuncion(){
    if(opcionGlobal == 1){
        return(<EstadoPermanencia  anioIni={AnioIni} anioFin ={AnioFin} graficoMF={Grafico}/>)
    }else if(opcionGlobal == 2){
        return(<Movilidad anioIni={AnioIni} anioFin ={AnioFin} graficoMF={Grafico}/>)
    }else if(opcionGlobal == 3){
        return(<RelacionAlumnos anioIni={AnioIni} anioFin ={AnioFin} graficoMF={Grafico}/>)
    }else if(opcionGlobal == 4){
        return(<ProgramaAlumnos anioIni={AnioIni} anioFin ={AnioFin} graficoMF={Grafico}/>)
    }else if(opcionGlobal == 5){
        return(<PoblacionEstudiantil  anioIni={AnioIni} anioFin ={AnioFin} graficoMF={Grafico}/>)
    }else if(opcionGlobal == 6){
        return(<TiposDeBeneficio  anioIni={AnioIni} anioFin ={AnioFin} graficoMF={Grafico}/>)
    }
    else if(opcionGlobal == 7){
        return(<EstadoAlumno  anioIni={AnioIni} anioFin ={AnioFin} graficoMF={Grafico}/>)
    }
    
}


export default Index;
