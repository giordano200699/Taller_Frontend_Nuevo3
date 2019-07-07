//Importamos las librerias
import React, { Component } from 'react';
import {Tabs, Tab} from 'react-bootstrap';
import CanvasJSReact, {CanvasJS} from './../../canvasjs.react';
import Parser from 'html-react-parser';
import html2canvas from 'html2canvas';
import Pdf from '../Pdf/pdf';
import htmlPDF from '../../BibliotecaFunciones/HtmlPDF.js';
import './RelacionAlumnos.css';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;



class RelacionAlumnos extends Component {

    constructor(props){
        //Recibiendo las propiedades del padre
        super(props);
        this.state = {
            anioini : ''+this.props.anioIni, //año inicial
            aniofin : ''+this.props.anioFin, //año final
            htmlTabla : '',   //Html de la tabla
            tipoGrafica: 'column',
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
            key: 'tabla'
        };
        this.obtenerTabla = this.obtenerTabla.bind(this);
        this.obtenerGrafica = this.obtenerGrafica.bind(this);
        this.handleSelect = this.handleSelect.bind(this);

        //this.miFuncion2 = this.miFuncion2.bind(this)

        this.obtenerTabla();
        this.obtenerGrafica();
    }

    handleSelect(key) {
        if(key=="pdf"){
            if(key!=this.state.key){
                //alert("ASFSFAFS");
            }
        }
        this.setState({key});
    }

    // Esta función nos permitirá obtener los datos de la tabla
    obtenerTabla(){
        fetch('http://tallerbackend.herokuapp.com/ApiController/programaAlumnos?fecha_inicio='+this.state.anioini+'&fecha_fin='+this.state.aniofin)
        .then(async (respuesta) => {
            return await respuesta.json();
        })
        .then(async(resultado)=>{
            console.log(resultado);
            var htmlTabla = ''; 
            var contadorTabla = 2;
            var contadorLinea = 0;
            const diferenciaAnios = this.state.anioini - this.state.anioini + 1;
            for(var programa in resultado){
                var contador = 1;
                var sumaVertical = [];
                for(var i = this.state.anioini;i<=this.state.aniofin;i++){
                    sumaVertical[i] = 0;
                }
                sumaVertical['total']=0;
                
                for(var anio in resultado[programa]){
                    
                    if(contador==1){
                        htmlTabla += '<tr><td style="vertical-align: middle; border-bottom-width: 3px;" rowspan="'+(Object.keys(resultado[programa]).length+1)+'">'+programa+'</td>';
                    }else{
                        htmlTabla += '<tr>';
                    }
                     
                    htmlTabla += '<td style="border-left-width: 3px">'+anio+'</td>';
                    contadorTabla++;
                    var sumaHorizontal =0;
                    
                    for(var i = this.state.anioini;i<=this.state.aniofin;i++){
                        if(resultado[programa][anio][i]){
                            sumaHorizontal += resultado[programa][anio][i];
                            sumaVertical[i] += resultado[programa][anio][i];
                        }
                    }
                    htmlTabla+='<td >'+sumaHorizontal+'</td>';
                    sumaVertical['total']+=sumaHorizontal;
                    htmlTabla+='</tr>';
                    contador++;
                }
                htmlTabla += '<tr><th style="border-bottom-width: 3px; border-left-width: 3px;">Total</th>';
                htmlTabla +='<th style="border-bottom-width: 3px">'+sumaVertical['total']+'</th>'
                htmlTabla +='</tr>';
                contadorTabla++;
            }
            
            contadorLinea += 11 + contadorTabla;
            contadorLinea += diferenciaAnios * 10 + (diferenciaAnios - 1) * 2;
            if (contadorLinea < 50) {
                contadorLinea = 50 + diferenciaAnios * 10 + (diferenciaAnios - 1) * 2;
            }

            var leyenda = '';
            leyenda += "<hr></hr>";
            leyenda += "<text className='leyenda'><tr><td>DISI: Doctorado en Ingeniería de Sistemas e Informática</td></text></br>";
            leyenda += "<text className='leyenda'><tr><td>GTIC: Gestión de tecnología de información y comunicaciones</td></text></br>";
            leyenda += "<text className='leyenda'><tr><td>ISW: Ingeniería de Software</td></text></br>";
            leyenda += "<text className='leyenda'><tr><td>GIC: Gestión de la información y del conocimiento</td></text></br>";
            leyenda += "<text className='leyenda'><tr><td>GTI: Gobierno de tecnologías de información</td></text></br>";
            leyenda += "<text className='leyenda'><tr><td>GPTI: Gerencia de proyectos de tecnología de información</td></text></br>";
            leyenda += "<text className='leyenda'><tr><td>ASTI: Auditoria y seguridad de tecnología de información</td></text>";

            var leyenda2 = '';
            leyenda2 += "<text className='leyenda'><tr><td>AC: Activo</td></text></br>";
            leyenda2 += "<text className='leyenda'><tr><td>G: Graduado</td></text></br>";
            leyenda2 += "<text className='leyenda'><tr><td>RM: Reserva</td></text></br>";
            leyenda2 += "<text className='leyenda'><tr><td>INAC: Inactivo</td></text></br>";
            leyenda2 += "<text className='leyenda'><tr><td>AI: Ingreso anulado</td></text></br>";
            leyenda2 += "<text className='leyenda'><tr><td>AC: Egresado</td></text>";

            //Encabezado (Logo UNMSM)
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
                htmlTabla:htmlTabla,
                leyenda1: leyenda,
                leyenda2: leyenda2,
                cargoTabla:true,
                contadorLineaTabla: contadorLinea,
                contadorTabla: contadorTabla,
                htmlencabezado: encabezado
            });

        });
           
    }

    obtenerGrafica(){
        fetch('http://tallerbackend.herokuapp.com/ApiController/demandaInversa?fecha_inicio='+this.state.anioini+'&fecha_fin='+this.state.aniofin)
        .then(async (response) => {
            return await response.json();
        })
        .then(async (resultado) => {
            var arregloData = [];
            var bandera = true;
            var anioInicioRelativo; 
            var anioUltimoRelativo;
            for(var anio in resultado){
                if(bandera){
                    anioInicioRelativo = anio;
                    bandera = false;
                }
                anioUltimoRelativo = anio;
                var nuevaData = [];

                for(var estado in resultado[anio]){
                    var miniArreglo = [];
                    for(var tipo in resultado[anio][estado]){
                        miniArreglo.push({ label: tipo, y: resultado[anio][estado][tipo] });
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
                    <div class="row align-items-center">
                        <div class="col col-md-12">
                            <CanvasJSChart style={{marginBottom: 50,width:'100%'}} options = {{
                                animationEnabled: true,
                                title:{
                                    text: "Estado de Permanencia - "+anio
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
                            }} />
                        </div>
                            
                    </div>
                );
            }
            await this.setState({
                jsonGrafica:arregloData,
                cargoGrafica:true
            })

        });
    }

    render() {
        // alert(htmlAFoto);
        //console.log(htmlAFoto);
        
        if(this.state.cargoTabla && this.state.cargoGrafica && !this.state.cargoTomadorFotos && this.state.key=="pdf"){
            setTimeout(() => {
                
                htmlPDF(this.state.contadorLineaTabla,this.state.contadorTabla,null, this.state.htmlTabla,this.state.leyenda1, this.state.leyenda2,this.state.htmlencabezado,this.props.anioIni,this.props.anioIni,this.state.jsonGrafica,this.props.anioFin).then(async(x) => {
                    
                    this.setState({
                        copiaParaPdf:x,
                        cargoTomadorFotos:true
                    },()=>{
                        setTimeout(async () => {
                            //const input2 = document.getElementById('graficax');
                            var arregloImagen = [];
                            for (var i = 1; i <= this.state.copiaParaPdf.length; i++) {
                                const input2 = await document.getElementById('imagenPdf'+i);
                                
                                await html2canvas(input2)
                                    .then(async (canvas2) => {
                                        const imgData2 = await canvas2.toDataURL('image/png');
                                        //console.log(imgData2);
                                        
                                        await arregloImagen.push({ imagen: imgData2, orden: i });
                                        await this.setState({
                                            contadorCargaPaginas: this.state.contadorCargaPaginas + 1
                                        }, () => {
                                            if (this.state.contadorCargaPaginas == this.state.copiaParaPdf.length) {
                                                setTimeout(async () => {
                                                    this.setState({
                                                        arregloImagen: arregloImagen,
                                                        cargoFotos:true,
                                                        //imagen2: arregloImagen,
                                                        //cargoImagen2: true,
                                                        //isChartLoaded: false,
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

        
        
        const aI = this.props.anioIni;
        const aF = this.props.anioFin;
        if(this.state.key=="pdf"&&!this.state.cargoFotos){
            document.body.classList.add("oculto");
        }else{
            document.body.classList.remove("oculto");
        }

        if (this.props.anioFin != this.state.aniofin || this.props.anioIni != this.state.anioini || this.state.tipoGraficaVerificador != this.props.graficoMF) {
            var tipoCadena = '';
            if (this.props.graficoMF == "columnasMultiples") {
                tipoCadena = 'column';
            } else if (this.props.graficoMF == "barrasHMultiples") {
                tipoCadena = 'bar';
            } else if (this.props.graficoMF == "splineMultiple") {
                tipoCadena = 'spline';
            }

            this.setState({
                aniofin: this.props.anioFin,
                anioini: this.props.anioIni,
                tipoGraficaVerificador: this.props.graficoMF,
                tipoGrafica: tipoCadena,
                cargoGrafica: false,
                cargoTabla: false,
                cargoTomadorFotos: false,
                cargoFotos: false

            }, async () => {
                this.obtenerTabla();
                this.obtenerGrafica();
            });
        }

        return (
            <div>
                <Tabs activeKey={this.state.key} onSelect={key => this.handleSelect(key)} align="center" >
                    <Tab eventKey="tabla" title="Tabla">
                        {/* Aca ponemos la tabla */}
                        <div class="panel">
                            <div class="panel-heading"  >
                                <div  class="row" style={{alignItems:'center', justifyContent:'center', marginTop:20}}>
                                    <div className="col-md-12 ">
                                        <h5 className="titulo" align="center"> Estado de permanencia en los Programas de Posgrado (General)</h5>
                                    </div>
                                    <div className="titulo col-md-12" align="center" >Espacio Temporal: {aI==aF?aI:aI+" al "+aF}</div>
                                </div>
                            </div>
                            <div className="panel-body" style={{marginTop:20}}>
                                <div class="row">
                                    <div className="col-md-1"></div>
                                    <div className="col-md-10" style={{marginTop:20}}>
                                        <table className="table table-bordered TablaEstadisticaAzul">
                                            <thead>
                                                
                                                <th>Programa</th>
                                                <th>Estado</th>
                                                <th>Total</th>
                                                
                                            </thead>
                                            <tbody>

                                                { Parser(this.state.htmlTabla) }

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="row">
                                    <div className="col col-md-1"></div>
                                    <div className="col col-md-10">
                                        <hr></hr>
                                        <h5 style={{marginLeft:10, fontSize:13}} className="subtitulo">Leyenda: </h5> 
                                        {Parser(this.state.leyenda1)} 
                                    </div> 
                                </div>
                            </div>
                        </div>
                    </Tab>
                    <Tab eventKey="grafica" title="Gráfica">
                        {/* Aca ponemos la gráfica */}
                        <div class="panel row align-items-center">
                            <div className="panel-heading" >
                                <h5 style={{marginLeft:10}} className="titulo">Gráficas: </h5>
                                <hr></hr>
                            </div>
                            <div class="panel-body col-md-12">
                                <div class="row">
                                    <div className="col-md-1"></div>
                                    <div className="col-md-10">
                                            {this.state.cargoGrafica?this.state.jsonGrafica:null} 
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </Tab>
                    
                    <Tab eventKey="pdf" title="PDF">
                    
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
                                        <h4 style={{ marginLeft: 60 }} className="titulo">Visualizar PDF</h4>
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
        )
    }
}
export default RelacionAlumnos;
