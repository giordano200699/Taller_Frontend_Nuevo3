/* App.js */

import React, { Component } from 'react';
import {Tabs, Tab} from 'react-bootstrap-tabs';
import CanvasJSReact, {CanvasJS} from './../../canvasjs.react';
import Parser from 'html-react-parser';
import Pdf from '../Pdf/pdf';
import html2canvas from 'html2canvas';
import './DemandaSocial.css';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class DemandaSocial extends Component {

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
            htmlGrafica: '',
            banderaCarga : false,
            myleyenda: '',

            graficasCargadas : false,
            inicioRelativo : ''+this.props.anioIni,
            finRelativo: ''+this.props.anioFin,
            tipoGrafica: 'column',
            tipoGraficaVerificador : this.props.graficoMF
        };
        this.miFuncion = this.miFuncion.bind(this);
        this.miFuncion();
        this.miFuncion2 = this.miFuncion2.bind(this);
        this.miFuncion2();

        

    }


    miFuncion(){
        fetch('http://tallerbackend.herokuapp.com/ApiController/programaAlumnos?fecha_inicio='+this.state.anioini+'&fecha_fin='+this.state.aniofin)//hace el llamado al dominio que se le envió donde retornara respuesta de la funcion
        .then((response)=>{
            return response.json();
        })
        .then((result)=>{

            var cadena = '';
            var cadena2 = '';
            var leyenda = "";

            for(var tipo in result){
                var contador = 1;
                
                for(var anio in result[tipo]){
                    if(contador==1){
                        cadena += '<tr><td style="vertical-align: middle;" rowspan="'+Object.keys(result[tipo]).length+'">'+tipo+'</td>';
                    }else{
                        cadena += '<tr>';
                    }
                     
                    cadena += '<td>'+anio+'</td>';
                    
                    for(var i = this.state.anioini;i<=this.state.aniofin;i++){
                        if(result[tipo][anio][i]){
                            cadena+='<td>'+result[tipo][anio][i]+'</td>';
                        }else{
                            cadena+='<td>0</td>';
                        }
                    }
                    cadena+='</tr>';
                    contador++;
                }
            }

            for(var i = this.state.anioini;i<=this.state.aniofin;i++){
                cadena2+='<th>'+i+'</th>';


            }


             //Aqui se llena los datos de la leyenda
             leyenda += "<hr></hr>"
             leyenda += "<text className='leyenda'><tr><td>DISI: DOCTORADO EN INGENIERIA DE SISTEMAS E INFORMATICA</td></text></br>";
             leyenda += "<text className='leyenda'><tr><td>GTIC: GESTION DE TECNOLOGIA DE INFORMACION Y COMUNICACIONES</td></text></br>";
             leyenda += "<text className='leyenda'><tr><td>ISW: INGENIERIA DE SOFTWARE</td></text></br>";
             leyenda += "<text className='leyenda'><tr><td>GIC: GESTION DE LA INFORMACION Y DEL CONOCIMIENTO</td></text></br>";
             leyenda += "<text className='leyenda'><tr><td>GTI: GOBIERNO DE TECNOLOGIAS DE INFORMACION</td></text></br>";
             leyenda += "<text className='leyenda'><tr><td>GPTI: GERENCIA DE PROYECTOS DE TECNOLOGIA DE INFORMACION</td></text></br>";            
             leyenda += "<text className='leyenda'><tr><td>ASTI: AUDITORIA Y SEGURIDAD DE TECNOLOGIA DE INFORMACION</td></text>";
             
            leyenda += "<hr></hr>"

            leyenda +=  "<text className='leyenda'><tr><td>AC: ACTIVO</td></text></br>";
            leyenda +=  "<text className='leyenda'><tr><td>G: GRADUADO</td></text></br>";
            leyenda +=  "<text className='leyenda'><tr><td>RM: RESERVA</td></text></br>";
            leyenda +=  "<text className='leyenda'><tr><td>INAC: INACTIVO</td></text></br>";
            leyenda +=  "<text className='leyenda'><tr><td>AI: INGRESO ANULADO</td></text></br>";
            leyenda +=  "<text className='leyenda'><tr><td>AC: EGREASDO</td></text>";


            //console.log(result);
            this.setState({
                isChartLoaded : true,
                miHtml:cadena2,
                miHtml2:cadena,
                myleyenda:leyenda
            });

        })
    }

    miFuncion2(){
        
        fetch('http://tallerbackend.herokuapp.com/ApiController/programaAlumnosInverso?fecha_inicio='+this.state.anioini+'&fecha_fin='+this.state.aniofin)
        .then((response)=>{
            return response.json();
        })
        .then((result2)=>{

            var arregloData = [];
            
            var bandera = false;
            var anioInicioRelativo; 
            var anioUltimoRelativo;
            
            for(var anio in result2){
                if(!bandera){
                    anioInicioRelativo = anio;
                    bandera = true;
                }
                anioUltimoRelativo = anio;
                var nuevaData = [];

                for(var estado in result2[anio]){
                    var miniArreglo = [];
                    for(var tipo in result2[anio][estado]){
                        miniArreglo.push({ label: tipo, y: result2[anio][estado][tipo] });
                    }
                    nuevaData.push({
                        type: this.state.tipoGrafica,
                        name: estado,
                        legendText: estado,
                        showInLegend: true, 
                        dataPoints:miniArreglo
                    });
                }

                arregloData.push(
                    {
                        animationEnabled: true,
                        title:{
                            text: "Demanda Social - "+anio
                        },	
                        axisY: {
                            title: "Número de Alumnos",
                            titleFontColor: "#4F81BC",
                            lineColor: "#4F81BC",
                            labelFontColor: "#4F81BC",
                            tickColor: "#4F81BC"
                        },	
                        toolTip: {
                            shared: true
                        },
                        legend: {
                            cursor:"pointer"
                        },
                        data: nuevaData
                    }
                );

            }


            //console.log(result);
            this.setState({
                data: arregloData,
                inicioRelativo: anioInicioRelativo,
                finRelativo: anioUltimoRelativo

            },()=>{
                this.setState({
                    graficasCargadas:true
                });
            });
        })
    }

    render() {

        const aI = this.props.anioIni;
        const aF = this.props.anioFin;

        if(this.props.anioFin!=this.state.aniofin || this.props.anioIni!=this.state.anioini || this.state.tipoGraficaVerificador!=this.props.graficoMF){
            var tipoCadena = '';
            if(this.props.graficoMF=="columnasMultiples"){
                tipoCadena = 'column';
            }else if(this.props.graficoMF=="barrasHMultiples"){
                tipoCadena = 'bar';
            }else if(this.props.graficoMF=="splineMultiple"){
                tipoCadena = 'spline';
            }
            
            this.setState({
                aniofin: this.props.anioFin,
                anioini: this.props.anioIni,
                tipoGraficaVerificador: this.props.graficoMF,
                tipoGrafica: tipoCadena,
                banderaCarga:false,
                graficasCargadas:false

            },() => {
                this.miFuncion();
                this.miFuncion2();
            });
        }
        
        if(this.state.isChartLoaded && this.state.graficasCargadas && Object.keys(this.state.data).length!=0  && this.state.banderaCarga != this.state.isChartLoaded){
            let etiqueta = []
            var iterador = 0;
            for(var i = this.state.inicioRelativo;i<=this.state.finRelativo;i++){
                etiqueta.push(
                    <div class="panel row align-items-center">
                        <div class="panel-body col-md-11 mr-md-auto ml-md-auto" style={{marginBottom: 50}}>
                            <CanvasJSChart options = {this.state.data[iterador]} />
                        </div>           
                    </div>
                );
                iterador++;
            }
            
            this.setState({
                htmlGrafica: etiqueta,
                banderaCarga: true
            },()=>{
                //alert(this.state.htmlGrafica);
            })
        }
        
        
        return (

            

        <div>
            
            <Tabs align="center" >
                    <Tab label="Tabla">
                        <div class="panel row align-items-center">
                            <div class="panel-heading mt-3 mb-3">
                                <h5 style={{marginLeft:10}} className="titulo">Demanda Social </h5>
                                <hr></hr>
                                <h5 style={{marginLeft:10}} className="titulo2">Leyenda: </h5>
                                {Parser(this.state.myleyenda)} 
                                <hr></hr>
                                {aI == aF ? (<h4 style={{marginLeft:10}}  className="titulo2">Espacio Temporal: {this.props.anioIni}</h4>) : 
                                (<h4 style={{marginLeft:10}}  className="titulo2">Espacio Temporal: {this.props.anioIni} al {this.props.anioFin}</h4>)}
                            </div>
                            <table className="table table-bordered table-striped col-md-11 mr-md-auto greenTable">
                                <thead>
                                     
                                    <th>Etiqueta</th>
                                    <th>Estado</th>
                                    {Parser(this.state.miHtml)} 
                                    
                                </thead>
                                <tbody>
                                    {Parser(this.state.miHtml2)}                            
                                </tbody>
                            </table>          
                        </div>
                    </Tab>
                    <Tab label="Grafico">
                        <div class="panel row align-items-center">
                            <div className="panel-heading mt-3 mb-3" >
                                <h5 style={{marginLeft:10}} className="titulo2">Gráficas: </h5>
                                <hr></hr>
                            </div>
                            <div className="panel-body col-md-11 mr-md-auto ml-md-auto ">
                                {this.state.banderaCarga? this.state.htmlGrafica : null}
                            </div>
                        </div>
                    </Tab>

                    <Tab label="Visualizar PDF" >
                        <div className="panel row align-items-center" >
                            <div className="panel-heading mt-3 mb-3">
                                <h4 style={{marginLeft:10}} className="titulo2">Visualizar PDF:</h4>
                                <hr></hr>
                            </div>
                            <div className="panel-body col-md-11 mr-md-auto ml-md-auto">
                                {this.state.cargoImagen?<Pdf imagen={this.state.imagen}></Pdf>:null}
                                
                            </div>           
                        </div>
                    </Tab>
                </Tabs>











                
        </div>
        );
    }
}
export default DemandaSocial;


/*

    { label: "DSI",  y: 0  },
    { label: "GTIC", y: 15  },
    { label: "ISW", y: 74  },
    { label: "DGTI", y: 74  },
    { label: "GIC",  y: 0  },
    { label: "GTI",  y: 0  },
    { label: "GPTI",  y: 0  },
    { label: "ASTI",  y: 0  }
*/