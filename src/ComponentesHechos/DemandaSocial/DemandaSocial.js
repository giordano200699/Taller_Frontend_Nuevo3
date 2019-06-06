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
            myleyendaPDF: '',
            miEncabezado: '',

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
            var leyendaPDF = "";
            var encabezado = "";

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

            leyenda += "<hr></hr>"



            //LeyendaPDF

             leyendaPDF += "<hr></hr>"
             leyendaPDF += "<text className='leyendaPDF'><tr><td>DISI: Doctorado en Ingeniería de Sistemas e Informática </td></text></br>";
             leyendaPDF += "<text className='leyendaPDF'><tr><td>GTIC: Maestría en Ingeniería de Sistemas e Informática con mención en Gestión de Tecnologías de Información y Comunicaciones </td></text></br>";
             leyendaPDF += "<text className='leyendaPDF'><tr><td>ISW: Maestría en Ingeniería de Sistemas e Informática con mención en Ingeniería de Software</td></text></br>";
             leyendaPDF += "<text className='leyendaPDF'><tr><td>GIC: Maestría en Ingeniería de Sistemas e Informática con mención en Dirección y Gestión de Tecnologías de Información</td></text></br>";
             leyendaPDF += "<text className='leyendaPDF'><tr><td>GTI: Maestria Profesional en Gobierno de Tecnologías de Información </td></text></br>";
             leyendaPDF += "<text className='leyendaPDF'><tr><td>GPTI:  Diplomatura en Gerencia de Proyectos en Tecnología de Información</td></text></br>";            
             leyendaPDF += "<text className='leyendaPDF'><tr><td>ASTI: Diplomatura en Especialización en Auditoría y Seguridad de Tecnologías de Información </td></text>";
             
            leyendaPDF += "<hr></hr>"

            leyendaPDF +=  "<text className='leyendaPDF'><tr><td>AC: Activo</td></text></br>";
            leyendaPDF +=  "<text className='leyendaPDF'><tr><td>G: Graduado</td></text></br>";
            leyendaPDF +=  "<text className='leyendaPDF'><tr><td>RM: Reserva</td></text></br>";
            leyendaPDF +=  "<text className='leyendaPDF'><tr><td>INAC: Inactivo</td></text></br>";
            leyendaPDF +=  "<text className='leyendaPDF'><tr><td>AI: Ingreso Anulado</td></text></br>";
            leyendaPDF +=  "<text className='leyendaPDF'><tr><td>AC: Egresado</td></text>";

            leyendaPDF += "<hr></hr>"




            //console.log(result);
            this.setState({
                isChartLoaded : true,
                miHtml:cadena2,
                miHtml2:cadena,
                myleyenda:leyenda,
                myleyendaPDF: leyendaPDF,
                miEncabezado:encabezado
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
                        <div class="panel row align-items-center">
                            <div class="panel-heading mt-3 mb-3">
                                <h5 style={{marginLeft:10}} className="titulo">Demanda Social </h5>
                                <hr></hr>
                                <h5 style={{marginLeft:10}} className="titulo2">Leyenda: </h5>
                                {Parser(this.state.myleyenda)} 
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
                                {this.state.cargoImagen1&&this.state.cargoImagen2?<Pdf imagen={this.state.imagen1} imagen2={this.state.imagen2}></Pdf>:null}
                             
                            </div>           
                        </div>
                    </Tab>
                </Tabs>

                <div style={this.state.cargoImagen1&&this.state.cargoImagen2&&this.state.banderaCarga?{display:'none'}:null} id="copia">
                     
                    <div  id="tabla" style={{marginTop:0}}>
                        
                        <img src='blanco.png' width='50' height='50' align="center" style={{marginLeft:120}}/>
                        <div class="row">
                            <div className='panel col-md-3'>
                                <img src='unmsm.jpg' width='180' height='180' align="center" style={{marginLeft:120}}/>
                            </div>
                            <div className='panel col-md-9'>
                                <h1 className="titulo3" align="center" style={{paddingTop: 20}}>Universidad Nacional Mayor de San Marcos</h1>
                                <h2 className="titulo4" align="center">Universidad del Perú, Decana de América Marcos</h2>
                                <h1 className="titulo3" align="center">Facultad de Ingeniería de Sistemas e Informática</h1>
                                <h1 className="titulo3" align="center">Vicedecano de Investigación y Postgrado</h1>
                                <h1 className="titulo3" align="center">Unidad de Postgrado</h1>
                            </div>
                        
                        </div> 
                        
                        <div class="panel row align-items-center" style={{marginLeft:20}}>
                            <div class="panel-heading col-md-11 mr-md-auto">
                                <h5 style={{marginLeft:10}} className="tituloPDF" align="center">Demanda Social </h5>
                                {aI == aF ? (<h4 style={{marginLeft:10}}  className="titulo2PDF" align="center">Espacio Temporal: {this.props.anioIni}</h4>) : 
                                (<h4 style={{marginLeft:10}}  className="titulo2PDF" align="center">Espacio Temporal: {this.props.anioIni} al {this.props.anioFin}</h4>)}
                                <hr></hr>
                            </div>
                            <table className="paleBlueRows col-md-11 mr-md-auto table-bordered">
                                <thead>
                                    <th>Etiqueta</th>
                                    <th>Estado</th>
                                    {Parser(this.state.miHtml)} 
                                    
                                </thead>
                                <tbody>
                                    {Parser(this.state.miHtml2)}                            
                                </tbody>
                            </table>
                            <div class="panel-heading col-md-11 mr-md-auto">
                                <hr></hr>
                                <h5 style={{marginLeft:10}} className="titulo2PDF">Leyenda: </h5>
                                {Parser(this.state.myleyendaPDF)} 
                            </div>
                        </div>         
                    </div>

                    <div class="panel row align-items-center" id="graficax" style={{marginTop:0}}>
                        <div className="panel-heading mt-3 mb-3" >
                            <h5 style={{marginLeft:70}} className="titulo2">Gráficas: </h5>
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