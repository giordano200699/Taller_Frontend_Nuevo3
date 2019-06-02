/* App.js */

import React, { Component } from 'react';
import {Tabs, Tab} from 'react-bootstrap-tabs';
import CanvasJSReact, {CanvasJS} from './../../canvasjs.react';
import Parser from 'html-react-parser';
import Pdf from '../Pdf/pdf';
import html2canvas from 'html2canvas';



var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var opciones = ({
        title: {
            text: "Demanda Social"
        },
        data: [{
            type:"column",
            name: "2002",
            showInLegend: true,
            dataPoints:[
                {label:"DISI ",y:0},
                {label:"GTIC ",y:0},
                {label:"ISW ",y:15},
                {label:"GIC ",y:0},
                {label:"GTI ",y:0},
                {label:"GPTI ",y:0},
                {label:"ASTI ",y:0},
                {label:"GPGE ",y:0},
                {label:"DGTI ",y:74},
                {label:"SATD ",y:0}
            ]
        },
        {
            type:"column",
            name: "2003",
            showInLegend: true,
            dataPoints:[
                {label:"DISI ",y:0},
                {label:"GTIC ",y:0},
                {label:"ISW ",y:18},
                {label:"GIC ",y:0},
                {label:"GTI ",y:0},
                {label:"GPTI ",y:0},
                {label:"ASTI ",y:0},
                {label:"GPGE ",y:0},
                {label:"DGTI ",y:37},
                {label:"SATD ",y:0}
            ]
        }]
    });

//var pdf = require('html-pdf');


class ProgramaAlumnos extends Component {

    constructor(props){//constructor inicial
        super(props);
        this.state = {
            isUsed:false, //usado para saber si las aplicacion es usada
            showPopover: false, //usado para mostrar o no el popup
            verdades : {}, //usado para  ver que conceptos estan siendo usados
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
            grafico : ''+this.props.graficoMF, //usado para el tipo de grafico del cuadro
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
            miHtml : '',
            tablaFooter:'',
            miLeyenda: '',
            data2: {},
            cadenaAnios:'',
            imagen: null,
            cargoImagen:false,
            imagen2:null,
            cargoImagen2:false,
            key:"1",
            esVisible:false,

            tipoGrafica : this.props.graficoMF
        };

        
        this.myStackedColumn100 = this.myStackedColumn100.bind(this);
        this.myColumnMulti = this.myColumnMulti.bind(this);
        
        this.myGeneradorGrafica = this.myGeneradorGrafica.bind(this);


        this.miFuncion = this.miFuncion.bind(this);
        this.miFuncion();


    }


    miFuncion(){

        //alert("SOY LLAMADO "+this.state.anioini+"  "+this.state.aniofin+"  -- "+this.props.anioFin );
        //fetch('http://tallerbackend.herokuapp.com/ApiController/listaConceptos?fecha_inicio='+this.state.anioini+'&fecha_fin='+this.state.aniofin)//hace el llamado al dominio que se le envió donde retornara respuesta de la funcion
        fetch('http://tallerbackend.herokuapp.com/ApiController/listaConceptos?fecha_inicio='+this.state.anioini+'&fecha_fin='+this.state.aniofin)
        .then((response)=>{
            return response.json();
        })
        .then((result)=>{

            /*DEBE BOTAR ALGO ASI :
                [{
                    "type":"column",
                    "name": "2002",
                    "showInLegend": true,
                    "dataPoints":[{"label":"DISI ","y":0},
                    {"label":"GTIC ","y":0},
                    {"label":"ISW ","y":15},
                    {"label":"GIC ","y":0},
                    {"label":"GTI ","y":0},
                    {"label":"GPTI ","y":0},
                    {"label":"ASTI ","y":0},
                    {"label":"GPGE ","y":0},
                    {"label":"DGTI ","y":74},
                    {"label":"SATD ","y":0}]
                },
                {
                    "type":"column",
                    "name": "2003",
                    "showInLegend": true,
                    "dataPoints":[{"label":"DISI ","y":0},
                    {"label":"GTIC ","y":0},
                    {"label":"ISW ","y":18},
                    {"label":"GIC ","y":0},
                    {"label":"GTI ","y":0},
                    {"label":"GPTI ","y":0},
                    {"label":"ASTI ","y":0},
                    {"label":"GPGE ","y":0},
                    {"label":"DGTI ","y":37},
                    {"label":"SATD ","y":0}]
                }]
            */
            var miContador = this.state.anioini;
            var resultado =[];
           for (let fila of result) {
                console.log(fila);
                fila.name=''+miContador;
                fila.showInLegend=true;
                fila.type=this.state.tipoGrafica;
                miContador++;
                //resultado.push
            }

            console.log(result);

            this.setState({
                isChartLoaded : true,
                data: {
                    title: {
                        text: "Demanda Social"
                    },
                    data: result
                }
            });

            const input2 = document.getElementById('graficax');
            html2canvas(input2)
            .then((canvas2) => {
                const imgData2 = canvas2.toDataURL('image/png');
                this.setState({
                    imagen2 : imgData2,
                    cargoImagen2:true
                },()=>{
                    this.setState({
                        esVisible:false
                    });
                });
                
                
            });
        })

        fetch('http://tallerbackend.herokuapp.com/ApiController/demandaSocial?fecha_inicio='+this.state.anioini+'&fecha_fin='+this.state.aniofin)//hace el llamado al dominio que se le envió donde retornara respuesta de la funcion
        .then((response)=>{
            return response.json();
        })
        .then((result)=>{
            //result = JSON.parse(result);

            //console.log(result);
            let cadena="";
            let leyenda = "";
            let cadenaFooter = "";
            var totalD=0;
            var totalA = [];
            var bandera = false;
            var totalTotal = 0;
            var cadenaAnios = '';

            for(var i=parseInt(this.state.anioini);i<=parseInt(this.state.aniofin);i++){
                cadenaAnios += '<th><b>'+i+'</b></th>';
            }

            for(var i in result) {

                if(bandera==false){
                    bandera=true;
                    for(var j in result[i]){
                        totalA[j]=0;
                    }
                }
                totalD=0;
                cadena = cadena + "<tr><td>"+ i +"</td>";

                for(var j in result[i]){
                    if(result[i][j]==0){
                        cadena = cadena+"<td></td>";
                    }else{
                        cadena = cadena+"<td>"+result[i][j]+"</td>";
                        totalD = totalD + result[i][j];
                        totalA[j]=totalA[j]+result[i][j];
                } 
               }
               cadena = cadena + "<td>"+totalD+"</td>";
               totalTotal= totalTotal + totalD;
            }
            //cadena = cadena + "<tfoot><tr><td><b>Total General</b></td>";
            cadenaFooter = cadenaFooter + "<tr><td><b>Total General</b></td>";
            for(var i in totalA){
                //cadena = cadena+"<td><b>"+totalA[i]+"</b></td>";
                cadenaFooter = cadenaFooter + "<td><b>"+totalA[i]+"</b></td>";
            }
            //cadena = cadena + "<td><b>"+totalTotal+"</b></td></tfoot>";
            cadenaFooter = cadenaFooter +  "<td><b>"+totalTotal+"</b></td>";
            
            //Aqui se llena los datos de la leyenda
            leyenda += "<hr></hr>"
            leyenda += "<h5 className='leyenda'><tr><td>ASTI: AUDITORIA Y SEGURIDAD DE TECNOLOGIA DE INFORMACION</td></h5>";
            leyenda += "<h5 className='leyenda'><tr><td>DISI: DOCTORADO EN INGENIERIA DE SISTEMAS E INFORMATICA</td></h5>";
            leyenda += "<h5 className='leyenda'><tr><td>GIC: GESTION DE LA INFORMACION Y DEL CONOCIMIENTO</td></h5>";
            leyenda += "<h5 className='leyenda'><tr><td>GPTI: GERENCIA DE PROYECTOS DE TECNOLOGIA DE INFORMACION</td></h5>";
            leyenda += "<h5 className='leyenda'><tr><td>GTI: GOBIERNO DE TECNOLOGIAS DE INFORMACION</td></h5>";
            leyenda += "<h5 className='leyenda'><tr><td>GTIC: GESTION DE TECNOLOGIA DE INFORMACION Y COMUNICACIONES</td></h5>";
            leyenda += "<h5 className='leyenda'><tr><td>ISW: INGENIERIA DE SOFTWARE</td></h5>";

            this.setState({
                miHtml: cadena,
                cadenaAnios:cadenaAnios,
                miLeyenda: leyenda,
                tablaFooter: cadenaFooter,
                esVisible:true
            });
            const input = document.getElementById('tabla');
            
            html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                this.setState({
                    imagen : imgData,
                    cargoImagen:true
                });
                
                
            });
            
            
        })

    }

    
    myGeneradorGrafica(){
        
        if(this.state.grafico === 'columnMulti'){
            this.myColumnMulti();
            console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
        }
        else if (this.state.grafico === 'stackedColumn100') {
            this.myStackedColumn100();
            console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
        }
    
        fetch('http://tallerbackend.herokuapp.com/ApiController/demandaSocial?fecha_inicio='+this.state.anioini+'&fecha_fin='+this.state.aniofin)//hace el llamado al dominio que se le envió donde retornara respuesta de la funcion
        .then((response)=>{
            return response.json();
        })
        .then((result)=>{
            //result = JSON.parse(result);

            //console.log(result);
            let cadena="";
            let leyenda = "";
            let cadenaFooter = "";
            var totalD=0;
            var totalA = [];
            var bandera = false;
            var totalTotal = 0;
            var cadenaAnios = '';

            for(var i=parseInt(this.state.anioini);i<=parseInt(this.state.aniofin);i++){
                cadenaAnios += '<th><b>'+i+'</b></th>';
            }

            for(var i in result) {
                if(bandera==false){
                    bandera=true;
                    for(var j in result[i]){
                        totalA[j]=0;
                    }
                }
                totalD=0;
                cadena = cadena + "<tr><td>"+ i +"</td>";

                for(var j in result[i]){
                    if(result[i][j]==0){
                        cadena = cadena+"<td></td>";
                    }else{
                        cadena = cadena+"<td>"+result[i][j]+"</td>";
                        totalD = totalD + result[i][j];
                        totalA[j]=totalA[j]+result[i][j];
                } 
               }
               cadena = cadena + "<td>"+totalD+"</td>";
               totalTotal= totalTotal + totalD;
            }
            //cadena = cadena + "<tfoot><tr><td><b>Total General</b></td>";
            cadenaFooter = cadenaFooter + "<tr><td><b>Total General</b></td>";
            for(var i in totalA){
                //cadena = cadena+"<td><b>"+totalA[i]+"</b></td>";
                cadenaFooter = cadenaFooter + "<td><b>"+totalA[i]+"</b></td>";
            }
            //cadena = cadena + "<td><b>"+totalTotal+"</b></td></tfoot>";
            cadenaFooter = cadenaFooter +  "<td><b>"+totalTotal+"</b></td>";
            
            //Aqui se llena los datos de la leyenda
            leyenda += "<hr></hr>"
            leyenda += "<h5 className='leyenda'><tr><td>ASTI: AUDITORIA Y SEGURIDAD DE TECNOLOGIA DE INFORMACION</td></h5>";
            leyenda += "<h5 className='leyenda'><tr><td>DISI: DOCTORADO EN INGENIERIA DE SISTEMAS E INFORMATICA</td></h5>";
            leyenda += "<h5 className='leyenda'><tr><td>GIC: GESTION DE LA INFORMACION Y DEL CONOCIMIENTO</td></h5>";
            leyenda += "<h5 className='leyenda'><tr><td>GPTI: GERENCIA DE PROYECTOS DE TECNOLOGIA DE INFORMACION</td></h5>";
            leyenda += "<h5 className='leyenda'><tr><td>GTI: GOBIERNO DE TECNOLOGIAS DE INFORMACION</td></h5>";
            leyenda += "<h5 className='leyenda'><tr><td>GTIC: GESTION DE TECNOLOGIA DE INFORMACION Y COMUNICACIONES</td></h5>";
            leyenda += "<h5 className='leyenda'><tr><td>ISW: INGENIERIA DE SOFTWARE</td></h>";

            this.setState({
                miHtml: cadena,
                cadenaAnios:cadenaAnios,
                miLeyenda: leyenda,
                tablaFooter: cadenaFooter,
                esVisible:true
            });
            const input = document.getElementById('tabla');
            
            html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                this.setState({
                    imagen : imgData,
                    cargoImagen:true
                });
                
                
            });
            
            
        })

    }

    myColumnMulti(){
        
        ///hace el llamado al dominio que se le envió donde retornara respuesta de la funcion
        fetch('http://tallerbackend.herokuapp.com/ApiController/listaConceptos?fecha_inicio='+this.state.anioini+'&fecha_fin='+this.state.aniofin)
        .then((response)=>{
            return response.json();
        })
        .then((result)=>{

            var miContador = this.state.anioini;
            var resultado =[];
           for (let fila of result) {
                console.log(fila);
                fila.name=''+miContador;
                fila.showInLegend=true;
                miContador++;
                //resultado.push
            }

            console.log(result);

            this.setState({
                isChartLoaded : true,
                data: {
                    title: {
                        text: "Demanda Social"
                    },
                    data: result
                }
            });

            const input2 = document.getElementById('graficax');
            html2canvas(input2)
            .then((canvas2) => {
                const imgData2 = canvas2.toDataURL('image/png');
                this.setState({
                    imagen2 : imgData2,
                    cargoImagen2:true
                },()=>{
                    this.setState({
                        esVisible:false
                    });
                });
                
                
            });
        })

    }
     
    myStackedColumn100(){

       //Hace el llamado al dominio que se le envió donde retornara respuesta de la funcion
        fetch('http://tallerbackend.herokuapp.com/ApiController/listaConceptos?fecha_inicio='+this.state.anioini+'&fecha_fin='+this.state.aniofin)
        .then((response)=>{
            return response.json();
        })
        .then((result)=>{

            var miContador = this.state.anioini;
            var resultado =[];
            
            for (let fila of result) {
                console.log(fila);
                fila.name=''+miContador;
                fila.showInLegend=true;
                fila.type = 'spline';
                alert(fila);
                miContador++;
                //resultado.push
            }

            //cambiarValor(result, "type", "column", 'spline');

            console.log(result);

            this.setState({
                isChartLoaded : true,
                data: {
                    animationEnabled: true,
                    title: {
                        text: "Demanda Social"
                    },
                    legend: {
                        verticalAlign: "center",
                        horizontalAlign: "right",
                        reversed: true,
                        cursor: "pointer",
                            fontSize: 16,
                            itemclick: this.toggleDataSeries
                    },
                    toolTip: {
                        shared: true
                    },
                    data: result
                }
            });

            const input2 = document.getElementById('graficax');
            html2canvas(input2)
            .then((canvas2) => {
                const imgData2 = canvas2.toDataURL('image/png');
                this.setState({
                    imagen2 : imgData2,
                    cargoImagen2:true
                },()=>{
                    this.setState({
                        esVisible:false
                    });
                });
                
                
            });
        })

    }



    render() {
        if(this.props.anioFin!=this.state.aniofin || this.props.anioIni!=this.state.anioini || this.props.graficoMF != this.state.tipoGrafica){
            this.setState({
                aniofin: this.props.anioFin,
                anioini: this.props.anioIni,
                tipoGrafica: this.props.graficoMF
            },() => {
                this.miFuncion();
                const input = document.getElementById('tabla');
                html2canvas(input)
                .then((canvas) => {
                    const imgData = canvas.toDataURL('image/png');

                    this.setState({
                        imagen : imgData,
                        cargoImagen:true
                    });
                    
                });
                // const input2 = document.getElementById('graficax');
                // html2canvas(input2)
                //     .then((canvas2) => {
                //         const imgData2 = canvas2.toDataURL('image/png');

                //         this.setState({
                //             imagen2 : imgData2,
                //             cargoImagen2:true
                //         });
                        
                // });
            });
            //this.miFuncion();
        }

        const aI = this.props.anioIni;
        const aF = this.props.anioFin;
        
        return (
            
            <div id="contenido">  
            <Tabs align="center" >
                <Tab label="Tabla">
                    <div className="panel row align-items-center">
                        <div class="panel-heading mt-3 mb-3">
                        <h5 style={{marginLeft:10}} className="titulo">Programa Alumnos </h5>
                        <hr></hr>
                        <h5 style={{marginLeft:10}} className="titulo2">Leyenda: </h5>
                        {Parser(this.state.miLeyenda)} 
                        <hr></hr>
                        {aI == aF ? (<h4 style={{marginLeft:10}}  className="titulo2">Espacio Temporal: {this.props.anioIni}</h4>) : 
                        (<h4 style={{marginLeft:10}}  className="titulo2">Espacio Temporal: {this.props.anioIni} al {this.props.anioFin}</h4>)}
                    </div>                  
                        <table className="table table-bordered table-striped col-md-11 mr-md-auto greenTable" >
                            <thead>
                                <tr>
                                    <th><b>Etiquetas</b></th>
                                    {Parser(this.state.cadenaAnios)} 
                                    <th><b>Total General</b></th>
                                </tr>
                            </thead>
                            <tbody>
                                {Parser(this.state.miHtml)}                                  
                            </tbody>
                            <tfoot>
                                {Parser(this.state.tablaFooter)}                                  
                            </tfoot>
                        </table>
                    </div>
                </Tab>
                <Tab label="Grafico" >
                <div className="panel row align-items-center">
                    <div className="panel-heading mt-3 mb-3" >
                                <h5 style={{marginLeft:10}} className="titulo2">Gráficas: </h5>
                                <hr></hr>
                            </div>
                    <div className="panel-body col-md-11 mr-md-auto ml-md-auto ">
                        <CanvasJSChart options = {(this.state.isChartLoaded) ? this.state.data : (null)} />
                    </div>           
                </div>
                </Tab>
                <Tab label="Visualizar PDF" >
                <div className="panel row align-items-center" >
                    <div className="panel-heading mt-3 mb-3">
                        <h4 style={{marginLeft:10}} className="titulo2">Visualizar: </h4>
                        <hr></hr>
                    </div>
                    <div className="panel-body col-md-11 mr-md-auto ml-md-auto">
                        {/* <CanvasJSChart options = {opciones} /> */}
                        {/* <CanvasJSChart options = {(this.state.isChartLoaded) ? this.state.data : (null)} /> */}
                        {/* <PDFViewer backend={WebviewerBackend} src='/myPDF.pdf'></PDFViewer> */}
                        {this.state.cargoImagen&&this.state.cargoImagen2?<Pdf imagen={this.state.imagen} imagen2={this.state.imagen2}></Pdf>:null}
                    </div>           
                </div>
                </Tab>

            </Tabs>


            <div style={this.state.esVisible?null:{display:'none'}}>

                <div className="panel row align-items-center" id="tabla" style={{marginLeft:80}}>
                    <div class="panel-heading mt-3 mb-3">
                        <h5 style={{marginLeft:10}} className="titulo">Programa Alumnos </h5>
                        <hr></hr>
                        <h5 style={{marginLeft:10}} className="titulo2">Leyenda: </h5>
                        {Parser(this.state.miLeyenda)} 
                        <hr></hr>
                        {aI == aF ? (<h4 style={{marginLeft:10}}  className="titulo2">Espacio Temporal: {this.props.anioIni}</h4>) : 
                        (<h4 style={{marginLeft:10}}  className="titulo2">Espacio Temporal: {this.props.anioIni} al {this.props.anioFin}</h4>)}
                    </div>                  
                        <table className="table table-bordered table-striped col-md-11 mr-md-auto greenTable" >
                            <thead>
                                <tr>
                                    <th><b>Etiquetas</b></th>
                                    {Parser(this.state.cadenaAnios)} 
                                    <th><b>Total General</b></th>
                                </tr>
                            </thead>
                            <tbody>
                                {Parser(this.state.miHtml)}                                  
                            </tbody>
                            <tfoot>
                                {Parser(this.state.tablaFooter)}                                  
                            </tfoot>
                        </table>
                    </div>

                

                <div className="panel row align-items-center"  id="graficax" style={{marginLeft:10}}>
                     <div className="panel row align-items-center">
                        <div className="panel-heading mt-3 mb-3" >
                            <h5 style={{marginLeft:10}} className="titulo2">Gráficas: </h5>
                            <hr></hr>
                        </div>
                        <div className="panel-body col-md-11 mr-md-auto ml-md-auto ">
                            <CanvasJSChart options = {(this.state.isChartLoaded) ? this.state.data : (null)} />
                        </div>            
                    </div>          
                </div>
            </div>

        </div>
        );
    }
}


function cambiarValor(my_array, valorABuscar, valorViejo, valorNuevo) {
    my_array.forEach(function (elemento) { // recorremos el array
       //asignamos el valor del elemento dependiendo del valor a buscar, validamos que el valor sea el mismo y se reemplaza con el nuevo. 
      elemento[valorABuscar] = elemento[valorABuscar] == valorViejo ? valorNuevo : elemento[valorABuscar]
    })
  }


export default ProgramaAlumnos;

