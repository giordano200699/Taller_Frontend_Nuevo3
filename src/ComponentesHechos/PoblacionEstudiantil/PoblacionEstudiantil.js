/* App.js */

import React, { Component } from 'react';
import {Tabs, Tab} from 'react-bootstrap-tabs';
import CanvasJSReact, {CanvasJS} from './../../canvasjs.react';
import Parser from 'html-react-parser';
import Pdf from '../Pdf/pdf';
import html2canvas from 'html2canvas';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class PoblacionEstudiantil extends Component {

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
            miHtml2:'',
            imagen: null,
            cargoImagen:false,
            esVisible:false,

            tipoGrafica : this.props.graficoMF
        };
        this.miFuncion = this.miFuncion.bind(this);
        this.miFuncion();

    }


    miFuncion(){
        fetch('http://tallerbackend.herokuapp.com/ApiController/poblacionEstudiantil?fecha_inicio='+this.state.anioini+'&fecha_fin='+this.state.aniofin)//hace el llamado al dominio que se le envió donde retornara respuesta de la funcion
        .then((response)=>{
            return response.json();
        })
        .then((result)=>{

            //console.log(result);

            var arregloDatos = [];
            var cadena1 = '<tr><th>Año</th>';
            var cadena2 = '<tr><td>Total Alumnos</td>';

            for(var i in result){
                arregloDatos.push({y:parseInt(result[i]["count"]),label:result[i]["anio_ingreso"]});
                cadena1 = cadena1 + '<th>'+result[i]["anio_ingreso"]+'</th>';
                cadena2 = cadena2 + '<td>'+result[i]["count"]+'</td>';
            }
            cadena1 = cadena1 + '</tr>';
            cadena2 = cadena2 + '</tr>';

            this.setState({
                isChartLoaded : true,
                data: {
                    animationEnabled: true, 
                    title:{
                        text: "Población Estudiantil"
                    },
                    axisY : {
                        title: "Número de Alumnos",
                        includeZero: false
                    },
                    toolTip: {
                        shared: true
                    },
                    data: [{
                        type: this.state.tipoGrafica,
                        name: "Población Estudiantil",
                        showInLegend: true,
                        dataPoints: arregloDatos
                    }]
                },
                miHtml:cadena1,
                miHtml2:cadena2
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
                <Tabs align="center" className="textTab">
                    <Tab label="Tabla">
                        <div class="panel row"  style={{alignItems:'center',justifyContent:'center'}}>
                            <div class="panel-heading">                               
                                <div  class="row" style={{alignItems:'center', justifyContent:'center', marginTop:20}}>
                                    <div className="col-md-12 ">
                                        <h5 className="textTitulo" align="center">Poblacion Estudiantil</h5>
                                    </div>
                                    {aI == aF ? (<div className="textTitulo col-md-12" align="center">Espacio Temporal: {this.props.anioIni}</div>) : 
                                    (<div className="textTitulo col-md-12" align="center" >Espacio Temporal: {this.props.anioIni} al {this.props.anioFin}</div>)}
                                </div>
                                <br/>
                            </div>
                            <div className="col-md-10" style={{marginTop:20}}>
                                <table className="table table-bordered col-md-11 mr-md-auto TablaEstadisticaAzul">
                                    <thead>
                                        {Parser(this.state.miHtml)}  
                                    </thead>
                                    <tbody>
                                        {Parser(this.state.miHtml2)}                            
                                    </tbody>
                                </table>
                            </div>          
                        </div>
                    </Tab>
                    <Tab label="Grafico">
                    <div class="panel row align-items-center">
                        <div class="panel-heading mt-3 mb-3">
                            <h4 style={{marginLeft:60}}  class="panel-title textTitulo">Grafica de Población Estudiantil</h4>
                        </div>
                        <div class="panel-body col-md-11 mr-md-auto ml-md-auto">
                            <CanvasJSChart options = {(this.state.isChartLoaded) ? this.state.data : (null)} />
                        </div>           
                    </div>
                    </Tab>

                    <Tab label="Visualizar PDF" >
                        <div className="panel row align-items-center" >
                            <div className="panel-heading mt-3 mb-3">
                                <h4 style={{marginLeft:60}} className="titulo textTitulo">Visualizar PDF</h4>
                            </div>
                            <div className="panel-body col-md-11 mr-md-auto ml-md-auto">
                                {this.state.cargoImagen?<Pdf imagen={this.state.imagen}></Pdf>:null}
                                
                            </div>           
                        </div>
                    </Tab>
                </Tabs>

                <div style={this.state.esVisible?null:{display:'none'}} id="copia">

                    <img src="encabezado2.png" height="250" style={{marginLeft:30,marginTop:-20}}/>
                                
                    <div class="panel row"  style={{alignItems:'center',justifyContent:'center'}}>
                        
                        <div  class="row" style={{alignItems:'center',justifyContent:'center', marginTop:15}}>                                    
                            <div className="col-md-12 ">
                                <h5 className="tituloPDF" align="center"> Poblacion Estudiantil</h5>
                            </div>
                            {aI == aF ? (<div className="subtituloPDF col-md-12" align="center">Espacio Temporal: {this.props.anioIni}</div>) : 
                            (<div className="subtituloPDF col-md-12" align="center" >Espacio Temporal: {this.props.anioIni} al {this.props.anioFin}</div>)}
                        </div>

                        <div className="col-md-10" style={{marginTop:20}}>
                            <table className="table table-bordered col-md-10 TablaEstadisticaAzul">
                                <thead>
                                    {Parser(this.state.miHtml)}  
                                </thead>
                                <tbody>
                                    {Parser(this.state.miHtml2)}                            
                                </tbody>
                            </table>                    
                        </div>       
                    </div>

                    <div class="panel row align-items-center" style={{marginLeft:80}}>
                        <div className="col-md-3" >
                            <hr></hr>
                            <h5 style={{marginLeft:60}} className="titulo">Gráficas: </h5>
                            <hr></hr>
                        </div>
                        <div class="panel-body col-md-10 mr-md-auto ml-md-auto">
                            <CanvasJSChart options = {(this.state.isChartLoaded) ? this.state.data : (null)} />
                        </div>           
                    </div>
                </div>
                
            </div>

        );
    }
}
export default PoblacionEstudiantil;
