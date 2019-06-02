/* App.js */

import React, { Component } from 'react';
import {Tabs, Tab} from 'react-bootstrap-tabs';
import CanvasJSReact, {CanvasJS} from './../../canvasjs.react';
import Parser from 'html-react-parser';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Movilidad extends Component {

    constructor(){//constructor inicial
        super();
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
            anioini : '2015', //usado para el año inicial del cuadro
            aniofin : '2015', //usado para el año final del cuadro
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
            poblacionEstudiantil : [],
            miHtml: '',
            miHtml2: ''
        };
        this.miFuncion = this.miFuncion.bind(this);
        this.miFuncion();

    }


    miFuncion(){

        fetch('http://tallerbackend.herokuapp.com/ApiController/poblacionEstudiantil')//hace el llamado al dominio que se le envió donde retornara respuesta de la funcion
        .then((response)=>{
            return response.json();
        })
        .then((result)=>{

            //console.log(result);
            this.setState({
                poblacionEstudiantil : result,
            });
        });

        fetch('http://tallerbackend.herokuapp.com/ApiController/poblacionDocente')//hace el llamado al dominio que se le envió donde retornara respuesta de la funcion
        .then((response)=>{
            return response.json();
        })
        .then((result)=>{

            var primerAnio = parseInt(result[0]["date_part"]);
            var arreglo =[];
            var arreglo2 =[];
            var total = [];
            var total2 = [];
            var cadena = '<th>Año</th>';
            var cadena2 = '<td>Alumnos</td>';
            var cadena3 = '<td>Docentes</td>';

            for (var i = primerAnio;i<=2018;i++){
                arreglo[""+i]=0;
                arreglo2[""+i]=0;
                cadena = cadena + '<th>'+i+'</th>';
            }

            for(var i in this.state.poblacionEstudiantil){
                if(this.state.poblacionEstudiantil[i]["anio_ingreso"]!='2018-2'){
                    arreglo[this.state.poblacionEstudiantil[i]["anio_ingreso"]] = parseInt(this.state.poblacionEstudiantil[i]["count"]);

                }
            }

            for(var i in result){
                arreglo2[result[i]["date_part"]] = parseInt(result[i]["count"]);
            }

            console.log(arreglo2);

            for(var i in arreglo){
                total.push({y:arreglo[i],label:""+i});
                total2.push({y:arreglo2[i],label:""+i});
                cadena2 = cadena2 + '<td>'+arreglo[i]+'</td>';
                cadena3 = cadena3 + '<td>'+arreglo2[i]+'</td>';
            }


            //console.log(result);
            this.setState({
                isChartLoaded : true,
                miHtml:cadena,
                miHtml2:'<tr>'+cadena2+'</tr><tr>'+cadena3+'</tr>',
                data: {
                    animationEnabled: true, 
                    title:{
                        text: "Movilidad Alumnos vs Movilidad Docentes"
                    },
                    axisY : {
                        title: "Número de Personas",
                        includeZero: false
                    },
                    toolTip: {
                        shared: true
                    },
                    data: [{
                        type: "spline",
                        name: "Alumnos",
                        showInLegend: true,
                        dataPoints: total
                    },
                    {
                        type: "spline",
                        name: "Docentes",
                        showInLegend: true,
                        dataPoints: total2
                    }]
                }
            });
        })
    }

    render() {
        
        return (
            <div>
                <Tabs align="center" >
                    <Tab label="Tabla">
                        <div class="panel row align-items-center">
                            <div class="panel-heading mt-3 mb-3">
                                <h4 class="panel-title titulo">Tabla de Movilidad</h4>
                            </div>
                            <table className="table table-bordered table-striped col-md-11 mr-md-auto greenTable">
                                <thead>
                                    <tr>
                                        {Parser(this.state.miHtml)}  
                                    </tr>
                                </thead>
                                <tbody>
                                        {Parser(this.state.miHtml2)}  
                                </tbody>
                            </table>          
                        </div>
                    </Tab>
                    <Tab label="Grafico">
                    <div class="panel row align-items-center">
                        <div class="panel-heading mt-3 mb-3">
                            <h4 class="panel-title titulo ">Grafica de Movilidad</h4>
                        </div>
                        <div class="panel-body col-md-11 mr-md-auto ml-md-auto">
                            <CanvasJSChart options = {(this.state.isChartLoaded) ? this.state.data : (null)} />
                        </div>           
                    </div>
                    </Tab>
                </Tabs>
            </div>

        );
    }
}
export default Movilidad;
