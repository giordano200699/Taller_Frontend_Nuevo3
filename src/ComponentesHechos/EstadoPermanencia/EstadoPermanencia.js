/* App.js */

import React, { Component } from 'react';
import {Tabs, Tab} from 'react-bootstrap-tabs';
import CanvasJSReact, {CanvasJS} from '../../canvasjs.react';
import Parser from 'html-react-parser';
import Pdf from '../Pdf/pdf';
import html2canvas from 'html2canvas';
import './EstadoPermanencia.css';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class EstadoPermanencia extends Component {

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
            tipoGraficaVerificador : this.props.graficoMF,

            
            imagen1: null,
            cargoImagen1:false,
            imagen2:null,
            cargoImagen2:false,
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
                var sumaVertical = [];
                for(var i = this.state.anioini;i<=this.state.aniofin;i++){
                    sumaVertical[i] = 0;
                }
                sumaVertical['total']=0;
                
                for(var anio in result[tipo]){
                    
                    if(contador==1){
                        cadena += '<tr><td style="vertical-align: middle;" rowspan="'+(Object.keys(result[tipo]).length+1)+'" style="border-width: 3px">'+tipo+'</td>';
                    }else{
                        cadena += '<tr>';
                    }
                     
                    cadena += '<td style="border-width: 3px">'+anio+'</td>';

                    var sumaHorizontal =0;
                    
                    for(var i = this.state.anioini;i<=this.state.aniofin;i++){
                        if(result[tipo][anio][i]){
                            cadena+='<td  style="border-width: 3px">'+result[tipo][anio][i]+'</td>';
                            sumaHorizontal += result[tipo][anio][i];
                            sumaVertical[i] += result[tipo][anio][i];
                        }else{
                            cadena+='<td  style="border-width: 3px">0</td>';
                        }
                    }
                    cadena+='<td  style="border-width: 3px">'+sumaHorizontal+'</td>';
                    sumaVertical['total']+=sumaHorizontal;
                    cadena+='</tr>';
                    contador++;
                }
                cadena += '<tr><td  style="border-width: 3px">Total</td>';
                for(var i = this.state.anioini;i<=this.state.aniofin;i++){
                    cadena+='<th>'+sumaVertical[i]+'</th>';
                }
                cadena+='<th  style="border-width: 3px">'+sumaVertical['total']+'</th>'
                cadena +='</tr>';
            }

            for(var i = this.state.anioini;i<=this.state.aniofin;i++){
                cadena2+='<th style="border-width: 3px">'+i+'</th>';
            }
            cadena2+='<th style="border-width: 3px">Total</th>';

             //Aqui se llena los datos de la leyenda
  
             leyenda += "<hr></hr>"
             leyenda += "<text className='leyenda'><tr><td>DISI: Doctorado en Ingeniería de Sistemas e Informática</td></text></br>";
             leyenda += "<text className='leyenda'><tr><td>GTIC: Gestión de tecnología de información y comunicaciones</td></text></br>";
             leyenda += "<text className='leyenda'><tr><td>ISW: Ingeniería de Software</td></text></br>";
             leyenda += "<text className='leyenda'><tr><td>GIC: Gestión de la información y del conocimiento</td></text></br>";
             leyenda += "<text className='leyenda'><tr><td>GTI: Gobierno de tecnologías de información</td></text></br>";
             leyenda += "<text className='leyenda'><tr><td>GPTI: Gerencia de proyectos de tecnología de información</td></text></br>";
             leyenda += "<text className='leyenda'><tr><td>ASTI: Auditoria y seguridad de tecnología de información</td></text>";



            leyenda += "<hr></hr>"

            leyenda +=  "<text className='leyenda'><tr><td>AC: Activo</td></text></br>";
            leyenda +=  "<text className='leyenda'><tr><td>G: Graduado</td></text></br>";
            leyenda +=  "<text className='leyenda'><tr><td>RM: Reserva</td></text></br>";
            leyenda +=  "<text className='leyenda'><tr><td>INAC: Inactivo</td></text></br>";
            leyenda +=  "<text className='leyenda'><tr><td>AI: Ingreso anulado</td></text></br>";
            leyenda +=  "<text className='leyenda'><tr><td>AC: Egresado</td></text>";


            //console.log(result);
            this.setState({
                isChartLoaded : true,
                miHtml:cadena2,
                miHtml2:cadena,
                myleyenda:leyenda
            },()=>{
                const input = document.getElementById('tabla');
                html2canvas(input)
                .then((canvas) => {
                    const imgData = canvas.toDataURL('image/png');
                    this.setState({
                        imagen1 : imgData,
                        cargoImagen1:true
                    },()=>{
                    });
                });
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
                graficasCargadas:false,
                cargoImagen1:false,
                cargoImagen2:false

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
                setTimeout (()=>{
                    const input2 = document.getElementById('graficax');
                    html2canvas(input2)
                    .then((canvas2) => {
                        const imgData2 = canvas2.toDataURL('image/png');
                        this.setState({
                            imagen2 : imgData2,
                            cargoImagen2:true
                        },()=>{
                        });
                        
                        
                    });
                }, 2000); 
                
            })
        }
        
        
        return (

            

        <div>
            
            <Tabs align="center" >
                    <Tab label="Tabla">
                        <div class="panel row ">
                            <div class="panel-heading"  >
                                
                                <div  class="row" style={{alignItems:'center',justifyContent:'center'}}>
                                 <h5 style={{marginLeft:10, marginTop:10}} className="titulo" align="center"> Estado de permanencia en los Programas de Posgrado</h5>   
                                {aI == aF ? (<div style={{marginLeft:10}}  className="titulo">Espacio Temporal: {this.props.anioIni}</div>) : 
                                (<div style={{marginLeft:10}}  className="titulo" >Espacio Temporal: {this.props.anioIni} al {this.props.anioFin}</div>)}
                                </div>
                                <br/>
                            </div>
                            <table className="table table-bordered table-striped col-md-11 mr-md-auto greenTable" style={{borderWidth: 3}}>
                                <thead>
                                     
                                    <th style={{borderWidth: 3}}>Programa</th>
                                    <th style={{borderWidth: 3}}>Estado</th>
                                    {Parser(this.state.miHtml)} 
                                    
                                </thead>
                                <tbody>
                                    {Parser(this.state.miHtml2)}                            
                                </tbody>
                            </table>  
                            <div>
                                <hr></hr>
                                <h5 style={{marginLeft:10, fontSize:13}} className="titulo">Leyenda: </h5> 
                                {Parser(this.state.myleyenda)} 
                              
                            </div>    
                        </div>
                    </Tab>
                    <Tab label="Grafico">
                        <div class="panel row align-items-center">
                            <div className="panel-heading mt-3 mb-3" >
                                <h5 style={{marginLeft:10}} className="titulo">Gráficas: </h5>
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
                                <h4 style={{marginLeft:60}} className="titulo">Visualizar PDF</h4>
                            </div>
                            <div className="panel-body col-md-11 mr-md-auto ml-md-auto">
                            {this.state.cargoImagen1&&this.state.cargoImagen2?<Pdf imagen={this.state.imagen1} imagen2={this.state.imagen2}></Pdf>:null}
                                
                            </div>           
                        </div>
                    </Tab>
                </Tabs>

                <div style={this.state.cargoImagen1&&this.state.cargoImagen2&&this.state.banderaCarga?{display:'none'}:null} id="copia">
                    
                        <div  id="tabla" style={{marginTop:0}} class="row justify-content-md-center">
                            <img src="encabezado.png" width="1100" height="200" style={{marginLeft:30,marginTop:-20}}/>
                            <div class="panel row"  style={{alignItems:'center',justifyContent:'center'}}>
                                    <div  class="row" style={{alignItems:'center',justifyContent:'center'}}>
                                    <h5 style={{marginLeft:10, marginTop:10}} className="titulo" align="center"> Estado de permanencia en los Programas de Posgrado</h5> 
                                    {aI == aF ? (<h4 style={{marginLeft:10}}  className="titulo">Estado de permanencia en los Programas de Posgrado</h4>) : 
                                    (<h4 style={{marginLeft:10}}  className="titulo">Espacio Temporal: {this.props.anioIni} al {this.props.anioFin}</h4>)}
                                    <br/>
                            </div>
                            <table className="table table-bordered table-striped col col-md-10 greenTable">
                                <thead>
                                     
                                    <th>Programa</th>
                                    <th>Estado</th>
                                    {Parser(this.state.miHtml)} 
                                    
                                </thead>
                                <tbody>
                                    {Parser(this.state.miHtml2)}                            
                                </tbody>
                            </table>  
                            <div className="col col-md-10">
                                <hr></hr>
                                <h5 style={{marginLeft:10, fontSize:13}} className="titulo">Leyenda: </h5> 
                                {Parser(this.state.myleyenda)} 
                              
                            </div>  
                            </div>        
                        </div>

                        <div class="panel row align-items-center" id="graficax" style={{marginTop:0}}>
                            <div className="panel-heading mt-3 mb-3" >
                                <h5 style={{marginLeft:10}} className="titulo">Gráficas: </h5>
                                <hr></hr>
                            </div>
                            <div className="panel-body col-md-11 mr-md-auto ml-md-auto ">
                                {this.state.banderaCarga? this.state.htmlGrafica : null}
                            </div>
                        </div>
                </div>
        </div>
        );
    }
}
export default EstadoPermanencia;


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