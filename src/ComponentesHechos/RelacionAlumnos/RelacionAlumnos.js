//Importamos las librerias
import React, { Component } from 'react';
import {Tabs, Tab} from 'react-bootstrap-tabs';
import CanvasJSReact, {CanvasJS} from './../../canvasjs.react';
import Parser from 'html-react-parser';
import Pdf from '../Pdf/pdf';
import html2canvas from 'html2canvas';
import htmlAFoto from './../../BibliotecaFunciones/HtmlAFoto.js';
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
            leyenda1: '',
            leyenda2: '',
            contadorLineaTabla: 0,
            contadorTabla: 0,
            htmlencabezado: []
            /*
            isUsed:false, //usado para saber si las aplicacion es usada
            showPopover: false, //usado para mostrar o no el popup
            verdades : {}, //usado para  ver que conceptos estan sieno usados
            chartData : {}, //usado para dar datos al FusionChart (cuadro)
            isChartLoaded: false, //usado para mostrat el FusionChart
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
            miHtml2: '',
            imagen: null,
            cargoImagen: false,
            esVisible: false,
            htmlGrafica: '',
            banderaCarga: false,
            myleyenda: '',
            myleyenda2: '',
            paginacion: '',
            htmlencabezado: '',
            contTabla: '',
            contLeyenda: '',
            miPDF: '',

            graficasCargadas: false,
            inicioRelativo: '' + this.props.anioIni,
            finRelativo: '' + this.props.anioFin,
            tipoGrafica: 'column',
            tipoGraficaVerificador: this.props.graficoMF,


            imagen1: null,
            cargoImagen1: false,
            imagen2: null,
            cargoImagen2: false,
            cantidadDePaginas: 0,
            contadorCargaPaginas: 0

            */
        };
        this.obtenerTabla = this.obtenerTabla.bind(this);
        this.obtenerGrafica = this.obtenerGrafica.bind(this);

        //this.miFuncion2 = this.miFuncion2.bind(this)

        this.obtenerTabla();
        this.obtenerGrafica();
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
            const diferenciaAnios = this.state.aniofin - this.state.anioini + 1;
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
                    <div class="panel row align-items-center">
                        <div class="panel-body col-md-11 mr-md-auto ml-md-auto" style={{marginBottom: 50}}>
                            <CanvasJSChart options = {{
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
        
        var arregloImagen = [];
        htmlAFoto(this.state.contadorLineaTabla,this.state.contadorTabla,null, this.state.htmlTabla,this.state.leyenda1, this.state.leyenda2,this.state.htmlencabezado,arregloImagen).then(x => {
            alert(x);
            console.log(x);
        });
        
        const aI = this.props.anioIni;
        const aF = this.props.anioFin;
        return (
            <div>
                <Tabs align="center" >
                    <Tab label="Tabla">
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
                    <Tab label="Gráfica">
                        {/* Aca ponemos la gráfica */}
                        <div class="panel align-items-center">
                            <div className="panel-heading" >
                                <h5 style={{marginLeft:10}} className="titulo">Gráficas: </h5>
                                <hr></hr>
                            </div>
                            <div class="panel-body">
                                <div className="col-md-1"></div>
                                <div className="col-md-10">
                                     {this.state.cargoGrafica?this.state.jsonGrafica:null} 
                                </div>
                            </div>
                            
                        </div>
                    </Tab>
                    <Tab label="PDF">
                        {/* Aca ponemos el pdf */}
                    </Tab>
                </Tabs>

                <div style={this.state.cargoTabla && this.state.cargoGrafica ? null : { display: 'none' }} id="copia">
                    HOLA MUNDO
                </div>
                    
            </div>
        )
    }
}
export default RelacionAlumnos;
