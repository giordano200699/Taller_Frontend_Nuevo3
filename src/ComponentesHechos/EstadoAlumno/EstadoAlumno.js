/* App.js */

import React, { Component } from 'react';
import {Tabs, Tab} from 'react-bootstrap';
import CanvasJSReact, {CanvasJS} from '../../canvasjs.react';
import Parser from 'html-react-parser';
import Pdf from '../Pdf/pdf';
import html2canvas from 'html2canvas';
import htmlPDF from '../../BibliotecaFunciones/HtmlPDF.js';
import './EstadoAlumno.css';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

//var pdf = require('html-pdf');


class EstadoAlumno extends Component {

    constructor(props){//constructor inicial
        super(props);
        this.state = {
            anioini : ''+this.props.anioIni, //año inicial
            aniofin : ''+this.props.anioFin, //año final
            htmlTabla : '',   //Html de la tabla
            cadenaFooter: '',
            cadenaAnios: '',
            miHtml: '',
            tipoGrafica: this.props.graficoMF,
            tipoGraficaVerificador: this.props.graficoMF,
            jsonGrafica: null,
            cargoGrafica: false,
            cargoTabla: false,
            cargoTomadorFotos: false,
            cargoFotos: false,
            leyenda1: '',
            leyenda2: '',
            contadorLineaTabla: 0,
            contadorTabla: 0,
            htmlencabezado: [],
            copiaParaPdf: [],
            contadorCargaPaginas:0,
            arregloImagen:[],
            tipoGraficaVerificador: this.props.graficoMF,
            key: 'tabla',
            titulo: "Estado de Alumnos",
            tablaExtra: []
        };


        this.obtenerTabla = this.obtenerTabla.bind(this);
        this.obtenerGrafica = this.obtenerGrafica.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.dibujarTablaExtra = this.dibujarTablaExtra.bind(this);

        this.obtenerTabla();
        this.obtenerGrafica();
        this.dibujarTablaExtra();
    }

    handleSelect(key) {
        this.setState({key});
    }

    dibujarTablaExtra(){
        fetch('http://tallerbackend.herokuapp.com/ApiController/estadoAlumnoFallecido?fecha_inicio='+this.state.anioini+'&fecha_fin='+this.state.aniofin)
        .then((response)=>{
            return response.json();
        })
        .then(async (result)=>{
            var tablaExtra = [];
            var filas =[];
            for(var tipo of result)(async function(index){
                filas.push(
                    <tr>
                        <td>{index.anio_ingreso}</td>
                        <td>{index.cod_alumno}</td>
                        <td>{index.ape_paterno}</td>
                        <td>{index.ape_materno}</td>
                        <td>{index.nom_alumno}</td>
                        <td>{index.dni_m}</td>
                        <td>{index.correo}</td>
                        <td>{index.correo_personal}</td>
                        <td>{index.telefono_movil}</td>
                    </tr>
                )
            })(tipo)
            tablaExtra.push(
                <table className="table table-bordered TablaEstadisticaAzul2">
                    <thead>
                        <tr>
                            <th><b>Año Ingreso</b></th>
                            <th><b>Código Alumno</b></th>
                            <th><b>Apellido Paterno</b></th>
                            <th><b>Apellido Materno</b></th>
                            <th><b>Nombre</b></th>
                            <th><b>DNI</b></th>
                            <th><b>Correo Institucional</b></th>
                            <th><b>Correo Personal</b></th>
                            <th><b>Teléfono/Celular</b></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filas}
                    </tbody>
                </table>
            )
            await this.setState({
                tablaExtra:tablaExtra
            })
        })
    }

    obtenerGrafica() {
        fetch('http://tallerbackend.herokuapp.com/ApiController/estadoAlumnoGrafica?fecha_inicio='+this.state.anioini+'&fecha_fin='+this.state.aniofin)
        .then((response)=>{
            return response.json();
        })
        .then(async (result)=>{

            var miContador = result[0].anio;
            var resultado =[];
           for (let fila of result) {
                console.log(fila);
                fila.name=''+miContador;
                fila.showInLegend=true;
                fila.type=this.state.tipoGrafica;
                miContador++;
            }

            var arregloData = [];
            arregloData.push(
                //<div class="row align-items-center">
                    //<div class="col col-md-12">
                    <div style={{ marginBottom: 50 }}>
                        <CanvasJSChart style={{marginBottom: 50,width:'100%'}} options = {{
                            animationEnabled: true,
                            title:{
                                text: this.state.titulo,
                                fontFamily: "Encode Sans Semi Expanded",
                                fontColor: "#4C4C4C",
                                fontWeight: "normal",
                            },	
                            subtitles:[
                            {
                                text: " . ",
                                fontSize: 20,
                                fontColor:'white'
                            }
                            ],
                            axisX:{
                                title: "Estados",
                                titleFontFamily: "Encode Sans Semi Expanded",
                                titleFontColor: "#4C4C4C",
                                lineColor: "#4C4C4C",
                                labelFontColor: "#4C4C4C",
                                tickColor: "#4C4C4C",
                                },	
                            axisY: {
                                title: "Alumnos",
                                titleFontFamily: "Encode Sans Semi Expanded",
                                titleFontColor: "#4C4C4C",
                                lineColor: "#4C4C4C",
                                labelFontColor: "#4C4C4C",
                                tickColor: "#4C4C4C",
                                interlacedColor: "#F7F7F7",
                            },
                            toolTip: {
                                shared: true
                            },
                            legend: {
                                cursor:"pointer",
                                fontFamily: "Encode Sans Semi Expanded",
                                fontWeight: "normal",
                            },	

                            data: result
                        }} />
                    </div>
                        
                //</div>
            );

            await this.setState({
                jsonGrafica:arregloData,
                cargoGrafica:true
            })
        })
    }


    obtenerTabla(){

        fetch('http://tallerbackend.herokuapp.com/ApiController/estadoAlumno?fecha_inicio='+this.state.anioini+'&fecha_fin='+this.state.aniofin)//hace el llamado al dominio que se le envió donde retornara respuesta de la funcion
        .then((response)=>{
            return response.json();
        })
        .then(async (result)=>{

            let cadena="";
            let leyenda = "";
            let leyenda2 = "";
            let cadenaFooter = "";
            var totalD=0;
            var totalA = [];
            var totalTotal = 0;
            var cadenaAnios = '';

            
            var contadorTabla = 10;
            var contadorLinea = 0;

            for(var i=parseInt(this.state.anioini);i<=parseInt(this.state.aniofin);i++){
                cadenaAnios += '<th><b>'+i+'</b></th>';
                totalA[""+i]=0;
            }

            for(var tipo of result){
                totalD=0;
                cadena = cadena + "<tr><td>"+ tipo.tipo.substring(0,3) +"</td>";
                for(var i=parseInt(this.state.anioini);i<=parseInt(this.state.aniofin);i++){
                    cadena += "<td>"+tipo.anios[""+i]+"</td>"
                    totalD += tipo.anios[""+i];
                    totalA[""+i] += tipo.anios[""+i];
                }
                cadena += "<td>"+totalD+"</td></tr>";
            }

            cadenaFooter = cadenaFooter + "<tr><td><b>Total General</b></td>";
            for(var i in totalA){
                cadenaFooter = cadenaFooter + "<td><b>"+totalA[i]+"</b></td>";
                totalTotal += totalA[i];
            }
            cadenaFooter = cadenaFooter +  "<td><b>"+totalTotal+"</b></td>";
            
            //Aqui se llena los datos de la leyenda
            leyenda += "<hr></hr>";
            leyenda += "<text className='textLeyenda'><tr><td>CAS: CASADO</td></text></br>";
            leyenda += "<text className='textLeyenda'><tr><td>SOL: SOLTERO</td></text></br>";
            leyenda += "<text className='textLeyenda'><tr><td>DIV: DIVORCIADO</td></text></br>";
            leyenda += "<text className='textLeyenda'><tr><td>VIU: VIUDO</td></text></br>";
            leyenda += "<text className='textLeyenda'><tr><td>SEP: SEPARADO</td></text></br>";
            leyenda += "<text className='textLeyenda'><tr><td>CON: CONVIVIENTE</td></text></br>";
            leyenda += "<text className='textLeyenda'><tr><td>FAL: FALLECIDO</td></text></br>";
            leyenda += "<hr></hr>";

            leyenda2 += "";

            contadorLinea += contadorTabla;

            let encabezado = []
            await encabezado.push(
                <div class="row justify-content-center">
                    <div class="col-md-3">
                        <img src="unmsmIMagen.png" height="240" width='180' style={{ marginLeft: 60, marginTop: 20 }} />
                    </div>
                    <div class="col-md-7">
                        <img src="unmsmTitulo.png" height="240" width='500' style={{ marginLeft: 25, marginTop: 10 }} />
                    </div>
                    <div class="col-md-2">
                    </div>
                </div>
            );

            await this.setState({
                cadenaFooter: cadenaFooter,
                cadenaAnios: cadenaAnios,
                htmlTabla: cadena, 
                leyenda1: leyenda,
                leyenda2: leyenda2,
                contadorLineaTabla: contadorLinea,
                contadorTabla: contadorTabla,
                cargoTabla:true,
                htmlencabezado: encabezado
            });
            
            
        })

    }


    render() {

        const aI = this.props.anioIni;
        const aF = this.props.anioFin;

        if(this.state.key=="pdf"&&!this.state.cargoFotos){
            document.body.classList.add("oculto");
        }else{
            document.body.classList.remove("oculto");
        }

        if (this.props.anioFin != this.state.aniofin || this.props.anioIni != this.state.anioini || this.state.tipoGraficaVerificador != this.props.graficoMF) {
            
            this.setState({
                aniofin: this.props.anioFin,
                anioini: this.props.anioIni,
                tipoGraficaVerificador: this.props.graficoMF,
                tipoGrafica: this.props.graficoMF,
                cargoGrafica: false,
                cargoTabla: false,
                cargoTomadorFotos: false,
                cargoFotos: false

            }, async () => {
                this.obtenerTabla();
                this.obtenerGrafica();
            });
        }

        if(this.state.cargoTabla && this.state.cargoGrafica && !this.state.cargoTomadorFotos && this.state.key=="pdf"){
            setTimeout(() => {
                
                htmlPDF(this.state.contadorLineaTabla,this.state.contadorTabla,this.state.cadenaAnios, this.state.htmlTabla,this.state.leyenda1, this.state.leyenda2,this.state.htmlencabezado,this.props.anioIni,this.props.anioFin,this.state.jsonGrafica,this.props.anioFin,this.state.cadenaFooter, null, this.state.titulo).then(async(x) => {
                    console.log(x);
                    this.setState({
                        copiaParaPdf:x,
                        cargoTomadorFotos:true
                    },()=>{
                        setTimeout(async () => {
                            var arregloImagen = [];
                            for (var i = 1; i <= this.state.copiaParaPdf.length; i++) {
                                const input2 = await document.getElementById('imagenPdf'+i);
                                
                                await html2canvas(input2)
                                    .then(async (canvas2) => {
                                        const imgData2 = await canvas2.toDataURL('image/png');
                                        
                                        await arregloImagen.push({ imagen: imgData2, orden: i });
                                        await this.setState({
                                            contadorCargaPaginas: this.state.contadorCargaPaginas + 1
                                        }, () => {
                                            if (this.state.contadorCargaPaginas == this.state.copiaParaPdf.length) {
                                                setTimeout(async () => {
                                                    this.setState({
                                                        arregloImagen: arregloImagen,
                                                        cargoFotos:true,
                                                        contadorCargaPaginas: 0
                                                    },()=>{
                                                        this.setState({
                                                            cargoFotos: true
                                                        })
                                                    });
                                                    
                                                }, 3000);
                                            }
                                        });
        
        
                                    });
                            }
        
                        }, 3000);
                    });
                });
            },3000);
            
        }
        
        return (
            
            <div>  
            <Tabs activeKey={this.state.key} onSelect={key => this.handleSelect(key)} align="center" className="textTab">
                <Tab eventKey="tabla" title="Tabla">
                        {/* Aca ponemos la tabla */}
                        <div class="panel">
                            <div class="panel-heading"  >
                                <div  class="row" style={{alignItems:'center', justifyContent:'center', marginTop:20}}>
                                    <div className="col-md-12 ">
                                        <h5 className="textTitulo" align="center">{this.state.titulo}</h5>
                                    </div>
                                    <div className="textTitulo col-md-12" align="center" >Espacio Temporal: {aI==aF?aI:aI+" al "+aF}</div>
                                </div>
                            </div>
                            <div className="panel-body" style={{marginTop:20}}>
                                <div class="row">
                                    <div className="col-md-10 mr-md-auto ml-md-auto" style={{marginTop:20}}>
                                        <table className="table table-bordered TablaEstadisticaAzul">
                                            <thead>
                                                <tr>
                                                    <th><b>Estados</b></th>
                                                    {Parser(this.state.cadenaAnios)} 
                                                    <th><b>Total General</b></th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                { Parser(this.state.htmlTabla) }

                                            </tbody>
                                            <tfoot>
                                                {Parser(this.state.cadenaFooter)}                                  
                                            </tfoot>
                                        </table>
                                    </div>
                                    <div className="col-md-11 mr-md-auto ml-md-auto" style={{marginTop:20}}>
                                        {this.state.tablaExtra}
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div className="col col-md-10  mr-md-auto ml-md-auto">
                                        <hr></hr>
                                        <h5 style={{marginLeft:10, fontSize:13}} className="textSubtitulo">Leyenda: </h5> 
                                        {Parser(this.state.leyenda1)} 
                                    </div> 
                                </div>
                               
                            </div>
                        </div>
                    </Tab>
                    <Tab eventKey="grafica" title="Gráfica">
                        {/* Aca ponemos la gráfica */}
                        <div class="container">
                            <div className="row" >
                                <h5 style={{marginLeft:10, marginTop:20}} className="textTitulo">Gráficas: </h5>
                                <hr></hr>
                            </div>
                            {this.state.cargoGrafica ?<div className="row" >
                                <div class="panel-body col-md-7 mr-md-auto ml-md-auto" style={{ marginBottom: 50 }}>
                                    {this.state.jsonGrafica}
                                </div>
                            </div> : null} 
                        </div>
                    </Tab>
                <Tab eventKey="pdf" title="PDF" >
                    <div className="panel row align-items-center" >
                            
                        <div style={this.state.cargoTabla && this.state.cargoGrafica && this.state.cargoFotos ?{ display: 'none' }  : null} className="panel-heading col col-md-12">
                            <div class="row">
                                <div class="col col-md-5"></div>
                                <div class="col col-md-2" style={{textAlign:"center",marginTop:180}}>
                                    <div class="spiner">
                                        <div class="ball"></div>
                                        <div class="ball1"></div>
                                    </div>
                                </div>
                                <div class="col col-md-5"></div>
                                <div class="col col-md-12" style={{textAlign:"center"}}>
                                    <h1>Cargando...</h1>
                                </div>
                                {this.state.cargoFotos ?
                                    <h4 style={{ marginLeft: 60 }} className="textTitulo">Visualizar PDF</h4>
                                : null}
                            </div>
                            
                        </div>
                        <div className="panel-body col-md-11 mr-md-auto ml-md-auto">
                            {this.state.cargoFotos ?
                                <Pdf imagen2={this.state.arregloImagen}></Pdf> 
                            : null}
                        </div>
                    </div>

                    <div style={this.state.cargoTabla && this.state.cargoGrafica && this.state.cargoFotos  ?  { display: 'none' }: { marginTop: 500 }} id="copia">
                        {this.state.copiaParaPdf}
                    </div>
                </Tab>

            </Tabs>






        </div>
        );
    }
}

export default EstadoAlumno;

