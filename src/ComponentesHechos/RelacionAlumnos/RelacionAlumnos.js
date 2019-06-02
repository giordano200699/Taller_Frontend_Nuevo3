/* App.js */

import React, { Component } from 'react';
import {Tabs, Tab} from 'react-bootstrap-tabs';
import CanvasJSReact, {CanvasJS} from './../../canvasjs.react';
import Parser from 'html-react-parser';
import Pdf from '../Pdf/pdf';
import html2canvas from 'html2canvas';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


class RelacionAlumnos extends Component {

    constructor(props){//constructor inicial
        super(props);
        this.state = {
            isUsed:false, //usado para saber si las aplicacion es usada
            showPopover: false, //usado para mostrar o no el popup
            verdades : {}, //usado para  ver que conceptos estan sieno usados
            chartData : {}, //usado para dar datos al FusionChart (cuadro)
            isChartLoaded: true, //usado para mostrat el FusionChart
            tableData: {}, //usado para dar datos a la tabla
            isTableLoaded: false, //usado para mostrar la tabla
            conceptsData: {}, //usado para guardar los conceptos de la BD
            isConceptsLoaded: false, //usado para saber si ya obtuvimos los conceptos de la BD
            infoType : "importes", //usado para saber el tipo de informacion mostrada
            titulo: 'REPORTE ESTADISTICO DE IMPORTES POR CONCEPTO', //usado para el titulo del cuadro
            subtitulo: 'DEL 03/01/2015 AL 06/01/2015', //usado para el subtitulo del cuadro
            fechaInicio: '1420243200', //usado para la fecha inicial del cuadro
            fechaFin: '1420502400', //usado para la fecha final del cuadro
            grafico : 'column2d', //usado para el tipo de grafico del cuadro
            anioini : ''+this.props.anioIni, //usado para el año inicial del cuadro
            aniofin : ''+this.props.anioFin, //usado para el año final del cuadro
            anio: '2015', //usado para el año a biscar con el intervalo del mes
            mesini : '1', //usado para el mes inicial del cuadro
            mesfin : '12', //usado para el mes final del cuadro/grafico
            opcion : 'fecha', //usado para la opcion del filtro
            colores : "", //usado para el tipo de color del cuadro/grafico
            grad : "0", //usado para el gradiente del cuadro
            prefijo : "S/", //usado para el prefijo del cuadro
            listaConceptos : "", //usado para guardar una lista de los conceptos del cuadro
            todos : true, //usado para marcar todos los checkbox
            conceptos : [], //usado para saber que checkboxes son marcados
            todosConceptos : [], //usado para saber todos los conceptos que hay en la BD en otro tipo formato de dato
            usuario : '', //usado para la sesion del usuario
            listaConceptosEncontrados : "", //usado para saber que conceptos se encontraron en la consulta,
            data: {},
            miHtml: '',
            imagen: null,
            cargoImagen:false,
            esVisible:false,

            tipoGrafica : this.props.graficoMF
        };
        this.miFuncion = this.miFuncion.bind(this);
        this.miFuncion();

    }


    miFuncion(){
        fetch('http://tallerbackend.herokuapp.com/ApiController/relacionAlumnos?fecha_inicio='+this.state.anioini+'&fecha_fin='+this.state.aniofin)//hace el llamado al dominio que se le envió donde retornara respuesta de la funcion
        .then((response)=>{
            return response.json();
        })
        .then((result)=>{

            //console.log(result);

            var arregloDatos = [];
            var suma=0;
            var cadena = '';
            for(var i in result){
                suma= suma+parseInt(result[i]["count"]);
            }
            for(var i in result){
                cadena= cadena+'<tr>';
                cadena= cadena+'<td>'+result[i]["cod_perm"]+'</td>';
                switch(result[i]["cod_perm"]){
                    case 'AC':
                        cadena= cadena+'<td>Activo</td>';
                        break;
                    case 'G':
                        cadena= cadena+'<td>Graduado</td>';
                        break;
                    case 'X':
                        cadena= cadena+'<td>Expulsado</td>';
                        break;
                    case 'RM':
                        cadena= cadena+'<td>Reserva</td>';
                        break;
                    case 'INAC':
                        cadena= cadena+'<td>Inactivo</td>';
                        break;
                    case 'AI':
                        cadena= cadena+'<td>Ingreso Anulado</td>';
                        break;
                    case 'E':
                        cadena= cadena+'<td>Egresado</td>';
                        break;
                    case 'A':
                        cadena= cadena+'<td>Abandono</td>';
                        break; 
                }
                cadena= cadena+'<td>'+parseInt(result[i]["count"])+'</td>';
                //cadena= cadena+'<td>'+Math.round((parseInt(result[i]["count"])/suma)*10000)/10000+'</td>';
                cadena= cadena+'<td>'+Math.round((parseInt(result[i]["count"])/suma)*10000)/100+'%</td>';
                arregloDatos.push({y:parseInt(result[i]["count"]),label:result[i]["cod_perm"],porcentaje:Math.round((parseInt(result[i]["count"])/suma)*10000)/100});
                cadena= cadena+'</tr>';
            }
            cadena= cadena+'<tr><td>Total</td><td>Total</td><td>'+suma+'</td><td>100%</td></tr>';


            this.setState({
                isChartLoaded : true,
                data: {
                    animationEnabled: true,
                    title: {
                        text: "Relación Alumnos"
                    },
                    data: [{
                        type: this.state.tipoGrafica,
                        indexLabelPlacement: "",
                        startAngle: 75,
                        toolTipContent: "<b>{label}</b>: {y}",
                        showInLegend: "true",
                        legendText: "{label}",
                        indexLabelFontSize: 16,
                        indexLabel: "{label} - {porcentaje}%",
                        dataPoints: arregloDatos
                    }]
                },
                miHtml: cadena
            },()=>{
                this.setState({
                    esVisible:true
                },()=>{
                    const input = document.getElementById('copia');
                    html2canvas(input)
                    .then((canvas2) => {
                        const imgData = canvas2.toDataURL('image/png');
                        this.setState({
                            imagen : imgData,
                            cargoImagen:true
                        },()=>{
                            this.setState({
                                esVisible:false
                            });
                        });
                        
                        
                    });
                });

                
            });
        })
    }

    render() {


        const aI = this.props.anioIni;
        const aF = this.props.anioFin;


         if(this.props.anioFin!=this.state.aniofin || this.props.anioIni!=this.state.anioini || this.props.graficoMF != this.state.tipoGrafica){
            this.setState({
                aniofin: this.props.anioFin,
                anioini: this.props.anioIni,
                tipoGrafica: this.props.graficoMF
            },() => {
                this.miFuncion();
            });
        }
        
        return (

            <div>
                <Tabs align="center" >
                    <Tab label="Tabla">
                        <div class="panel row align-items-center">
                            <div class="panel-heading mt-3 mb-3">
                                <h5 style={{marginLeft:10}} className="titulo">Relación de Alumnos </h5>
                                <hr></hr>
                                {aI == aF ? (<h4 style={{marginLeft:10}}  className="titulo2">Espacio Temporal: {this.props.anioIni}</h4> ) : 
                                (<h4 style={{marginLeft:10}}  className="titulo2">Espacio Temporal: {this.props.anioIni} al {this.props.anioFin}</h4>)}
                                <hr></hr>
                            </div>
                            <table className="table table-bordered table-striped col-md-11 mr-md-auto greenTable">
                                <thead>
                                    <tr>
                                        <th>Clave</th>
                                        <th>Etiquetas</th>
                                        <th>Total</th>
                                        <th>Porcentaje</th>
                                    </tr>
                                </thead>
                                <tbody>
                                          {Parser(this.state.miHtml)}                            
                                </tbody>
                            </table>          
                        </div>
                    </Tab>
                    <Tab label="Grafico">
                    <div class="panel row align-items-center">
                        <div class="panel-heading mt-3 mb-3">
                            <h5 style={{marginLeft:10}} class="panel-title titulo2">Graficas: </h5>
                            <hr></hr>
                        </div>
                        <div class="panel-body col-md-11 mr-md-auto ml-md-auto">
                            <CanvasJSChart options = {(this.state.isChartLoaded) ? this.state.data : (null)} />
                        </div>           
                    </div>
                    </Tab>
                    <Tab label="Visualizar PDF" >
                        <div className="panel row align-items-center" >
                            <div className="panel-heading mt-3 mb-3">
                                <h4 style={{marginLeft:10}} className="titulo2">Visualizar PDF: </h4>
                                <hr></hr>
                            </div>
                            <div className="panel-body col-md-11 mr-md-auto ml-md-auto">
                                {this.state.cargoImagen?<Pdf imagen={this.state.imagen}></Pdf>:null}
                                
                            </div>           
                        </div>
                    </Tab>
                </Tabs>

                <div style={this.state.esVisible?null:{display:'none'}} id="copia">
                    <div class="panel row align-items-center" style={{marginLeft:80}}>
                        <div class="panel-heading mt-3 mb-3">
                            <h5 style={{marginLeft:10}} className="titulo">Relación de Alumnos </h5>
                            <hr></hr>
                            {aI == aF ? (<h4 style={{marginLeft:10}}  className="titulo2">Espacio Temporal: {this.props.anioIni}</h4> ) : 
                            (<h4 style={{marginLeft:10}}  className="titulo2">Espacio Temporal: {this.props.anioIni} al {this.props.anioFin}</h4>)}
                            <hr></hr>
                        </div>
                        <table className="table table-bordered table-striped col-md-11 mr-md-auto greenTable">
                            <thead>
                                <tr>
                                    <th>Clave</th>
                                    <th>Etiquetas</th>
                                    <th>Total</th>
                                    <th>Porcentaje</th>
                                </tr>
                            </thead>
                            <tbody>
                                    {Parser(this.state.miHtml)}                            
                            </tbody>
                        </table>          
                    </div>

                    <div class="panel row align-items-center"  style={{marginLeft:80}}>
                    <div class="panel-heading mt-3 mb-3">
                        <h5 style={{marginLeft:10}} class="panel-title titulo2">Graficas: </h5>
                        <hr></hr>
                    </div>
                    <div class="panel-body col-md-11 mr-md-auto ml-md-auto">
                        <CanvasJSChart options = {(this.state.isChartLoaded) ? this.state.data : (null)} />
                    </div>         
                    </div>
                </div>
            </div>

        );
    }
}
export default RelacionAlumnos;
