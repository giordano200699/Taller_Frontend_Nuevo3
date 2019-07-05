/* App.js */

import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap-tabs';
import CanvasJSReact, { CanvasJS } from '../../canvasjs.react';
import Parser from 'html-react-parser';
import Pdf from '../Pdf/pdf';
import html2canvas from 'html2canvas';
import { pdf } from '@react-pdf/renderer';
//import './EstadoPermanencia.css';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class EstadoPermanencia extends Component {

    constructor(props) {//constructor inicial
        super(props);
        this.state = {
            isUsed: false, //usado para saber si las aplicacion es usada
            showPopover: false, //usado para mostrar o no el popup
            verdades: {}, //usado para  ver que conceptos estan sieno usados
            chartData: {}, //usado para dar datos al FusionChart (cuadro)
            isChartLoaded: false, //usado para mostrat el FusionChart
            tableData: {}, //usado para dar datos a la tabla
            isTableLoaded: false, //usado para mostrar la tabla
            conceptsData: {}, //usado para guardar los conceptos de la BD
            isConceptsLoaded: false, //usado para saber si ya obtuvimos los conceptos de la BD
            infoType: "importes", //usado para saber el tipo de informacion mostrada
            titulo: 'REPORTE ESTADISTICO DE IMPORTES POR CONCEPTO', //usado para el titulo del cuadro
            subtitulo: 'DEL 03/01/2015 AL 06/01/2015', //usado para el subtitulo del cuadro
            fechaInicio: '1420243200', //usado para la fecha inicial del cuadro
            fechaFin: '1420502400', //usado para la fecha final del cuadro
            grafico: 'column2d', //usado para el tipo de grafico del cuadro
            anioini: '' + this.props.anioIni, //usado para el año inicial del cuadro
            aniofin: '' + this.props.anioFin, //usado para el año final del cuadro
            anio: '2015', //usado para el año a biscar con el intervalo del mes
            mesini: '1', //usado para el mes inicial del cuadro
            mesfin: '12', //usado para el mes final del cuadro/grafico
            opcion: 'fecha', //usado para la opcion del filtro
            colores: "", //usado para el tipo de color del cuadro/grafico
            grad: "0", //usado para el gradiente del cuadro
            prefijo: "S/", //usado para el prefijo del cuadro
            listaConceptos: "", //usado para guardar una lista de los conceptos del cuadro
            todos: true, //usado para marcar todos los checkbox
            conceptos: [], //usado para saber que checkboxes son marcados
            todosConceptos: [], //usado para saber todos los conceptos que hay en la BD en otro tipo formato de dato
            usuario: '', //usado para la sesion del usuario
            listaConceptosEncontrados: "", //usado para saber que conceptos se encontraron en la consulta,
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
        };
        this.miFuncion = this.miFuncion.bind(this);

        this.miFuncion2 = this.miFuncion2.bind(this);
        this.llamarFunciones();



    }
    async llamarFunciones() {
        await this.miFuncion();
        await this.miFuncion2();
    }


    miFuncion() {
        fetch('http://tallerbackend.herokuapp.com/ApiController/programaAlumnos?fecha_inicio=' + this.state.anioini + '&fecha_fin=' + this.state.aniofin)//hace el llamado al dominio que se le envió donde retornara respuesta de la funcion
            .then(async (response) => {
                return await response.json();
            })
            .then(async (result) => {

                var cadena = '';
                var cadena2 = '';
                var leyenda = "";
                var leyenda2 = "";
                var contadorLeyenda = 0;
                var contadorTabla = 2;
                var contadorLinea = 0;
                var diferenciaAnios = this.state.aniofin - this.state.anioini + 1;

                for (var tipo in result) {
                    var contador = 1;
                    var sumaVertical = [];
                    for (var i = this.state.anioini; i <= this.state.aniofin; i++) {
                        sumaVertical[i] = 0;
                    }
                    sumaVertical['total'] = 0;

                    for (var anio in result[tipo]) {

                        //Si no se utiliza esa variable, se bugea el contador
                        contadorLinea++;
                        contadorLinea--;
                        //No eliminar el codigo entre comentarios, existe un bug misterioso
                        //contadorTabla++;
                        if (contador == 1) {
                            cadena += '<tr><td style="vertical-align: middle; border-bottom-width: 3px;" rowspan="' + (Object.keys(result[tipo]).length + 1) + '">' + tipo + '</td>';
                        } else {
                            cadena += '<tr>';
                        }

                        cadena += '<td style="border-left-width: 3px; border-right-width: 3px">' + anio + '</td>';
                        contadorTabla++;

                        var sumaHorizontal = 0;

                        for (var i = this.state.anioini; i <= this.state.aniofin; i++) {
                            if (result[tipo][anio][i]) {
                                cadena += '<td>' + result[tipo][anio][i] + '</td>';
                                sumaHorizontal += result[tipo][anio][i];
                                sumaVertical[i] += result[tipo][anio][i];
                            } else {
                                cadena += '<td>0</td>';
                            }
                        }
                        cadena += '<td>' + sumaHorizontal + '</td>';
                        sumaVertical['total'] += sumaHorizontal;
                        cadena += '</tr>';
                        contador++;
                    }
                    cadena += '<tr><th style="border-bottom-width: 3px; border-left-width: 3px; border-right-width: 3px;">Total</th>';
                    for (var i = this.state.anioini; i <= this.state.aniofin; i++) {
                        cadena += '<th style="border-bottom-width: 3px">' + sumaVertical[i] + '</th>';
                    }
                    cadena += '<th style="border-bottom-width: 3px">' + sumaVertical['total'] + '</th>'
                    cadena += '</tr>';

                    contadorTabla++;
                }

                for (var i = this.state.anioini; i <= this.state.aniofin; i++) {
                    cadena2 += '<th>' + i + '</th>';
                }
                contadorTabla++;
                cadena2 += '<th>Total</th>';
                //contadorLinea += 2;
                //contadorTabla ++;
                //Aqui se llena los datos de la leyenda

                leyenda += "<hr></hr>";
                contadorLeyenda += 2;
                leyenda += "<text className='textLeyenda'><tr><td>DISI: Doctorado en Ingeniería de Sistemas e Informática</td></text></br>";
                contadorLeyenda++;
                leyenda += "<text className='textLeyenda'><tr><td>GTIC: Gestión de tecnología de información y comunicaciones</td></text></br>";
                contadorLeyenda++;
                leyenda += "<text className='textLeyenda'><tr><td>ISW: Ingeniería de Software</td></text></br>";
                contadorLeyenda++;
                leyenda += "<text className='textLeyenda'><tr><td>GIC: Gestión de la información y del conocimiento</td></text></br>";
                contadorLeyenda++;
                leyenda += "<text className='textLeyenda'><tr><td>GTI: Gobierno de tecnologías de información</td></text></br>";
                contadorLeyenda++;
                leyenda += "<text className='textLeyenda'><tr><td>GPTI: Gerencia de proyectos de tecnología de información</td></text></br>";
                contadorLeyenda++;
                leyenda += "<text className='textLeyenda'><tr><td>ASTI: Auditoria y seguridad de tecnología de información</td></text>";
                contadorLeyenda++;
                contadorLeyenda += 2;

                leyenda += "<hr></hr>";

                leyenda2 += "<br/>";
                leyenda2 += "<br/>";
                leyenda2 += "<br/>";
                leyenda2 += "<br/>";
                leyenda2 += "<text className='textLeyenda'><tr><td>AC: Activo</td></text></br>";
                leyenda2 += "<text className='textLeyenda'><tr><td>G: Graduado</td></text></br>";
                leyenda2 += "<text className='textLeyenda'><tr><td>RM: Reserva</td></text></br>";
                leyenda2 += "<text className='textLeyenda'><tr><td>INAC: Inactivo</td></text></br>";
                leyenda2 += "<text className='textLeyenda'><tr><td>AI: Ingreso anulado</td></text></br>";
                leyenda2 += "<text className='textLeyenda'><tr><td>AC: Egresado</td></text>";

                contadorLinea += contadorLeyenda + contadorTabla;
                contadorLinea += diferenciaAnios * 10 + (diferenciaAnios - 1) * 2; //10: el tamaño que ocupa el grafico
                if (contadorLinea < 50) {
                    contadorLinea = 50 + diferenciaAnios * 10 + (diferenciaAnios - 1) * 2;
                }
                //alert("contador tabla linea es "+contadorTabla);
                //alert("contador leyenda linea es "+contadorLeyenda);
                //alert("contador linea es "+contadorLinea);
                //Tope: 50 lineas por hoja, sin contar el encabezado

                //console.log(result);
                await this.setState({
                    isChartLoaded: true,
                    miHtml: cadena2,
                    miHtml2: cadena,
                    myleyenda: leyenda,
                    myleyenda2: leyenda2,
                    paginacion: contadorLinea,
                    contTabla: contadorTabla,
                    contLeyenda: contadorLeyenda
                }, async () => {
                    //alert("CARGO FUNCION 1");
                    const input = await document.getElementById('tabla');
                    await html2canvas(input)
                        .then((canvas) => {
                            const imgData = canvas.toDataURL('image/png');
                            this.setState({
                                imagen1: imgData,
                                cargoImagen1: true
                            }, () => {

                            });
                        });
                });

            })
    }

    miFuncion2() {

        fetch('http://tallerbackend.herokuapp.com/ApiController/programaAlumnosInverso?fecha_inicio=' + this.state.anioini + '&fecha_fin=' + this.state.aniofin)
            .then(async (response) => {
                return await response.json();
            })
            .then(async (result2) => {

                var arregloData = [];

                var bandera = false;
                var anioInicioRelativo;
                var anioUltimoRelativo;

                for (var anio in result2) {
                    if (!bandera) {
                        anioInicioRelativo = anio;
                        bandera = true;
                    }
                    anioUltimoRelativo = anio;
                    var nuevaData = [];

                    for (var estado in result2[anio]) {
                        var miniArreglo = [];
                        for (var tipo in result2[anio][estado]) {
                            await miniArreglo.push({ label: tipo, y: result2[anio][estado][tipo] });
                        }
                        await nuevaData.push({
                            type: this.state.tipoGrafica,
                            name: estado,
                            legendText: estado,
                            showInLegend: true,
                            dataPoints: miniArreglo
                        });
                    }

                    await arregloData.push(
                        {
                            animationEnabled: true,
                            title: {
                                text: "Estado de Permanencia - " + anio
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
                                cursor: "pointer"
                            },
                            data: nuevaData
                        }
                    );

                }


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
                /////////////////

                //console.log(result);
                await this.setState({
                    data: arregloData,
                    inicioRelativo: anioInicioRelativo,
                    htmlencabezado: encabezado,
                    finRelativo: anioUltimoRelativo

                }, async () => {

                    await this.setState({
                        graficasCargadas: true,
                    });
                    //alert("CARGO FUNCION 2");
                });
            })
    }


    render() {

        const aI = this.props.anioIni;
        const aF = this.props.anioFin;

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
                banderaCarga: false,
                graficasCargadas: false,
                cargoImagen1: false,
                cargoImagen2: false

            }, async () => {
                await this.miFuncion();
                await this.miFuncion2();
            });
        }


        //Generar Tabla y leyenda del PDF
        var totalLineas = this.state.paginacion;
        var topeLinea = 50;
        var totalPag = 0;
        var tablaLineas = this.state.contTabla;
        var leyendaLineas = this.state.contLeyenda;
        var lineaActual = 0;
        var paginaActual = 1;

        let pdf = []

        if (this.state.isChartLoaded && this.state.graficasCargadas && Object.keys(this.state.data).length != 0 && (this.state.banderaCarga != this.state.isChartLoaded)) {

            pdf.push(

            );
            var banderaLeyendaGrande = false;
            if ((tablaLineas + leyendaLineas) <= topeLinea) {
                //totalPag = Math.round(totalPag);
                totalPag = Math.round(totalLineas / topeLinea + 0.5);
                pdf.push(
                    <div>
                        {/*Añadir encabezado
                    Añadir tabla
                    Añadir Leyenda
                    "[paginaActual] de [totalPag]"
                    Crear una hoja
                    Crear encabezado
                    */}

                        <div id="tabla" className='container'>
                            {/*Aca comienza la primera hoja */}
                            <div id="imagenPdf1">
                                {/*Encabezado*/}
                                {this.state.htmlencabezado}
                                <div style={{ marginTop: 0 }} class="row justify-content-md-center">
                                    <div class="panel row" style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <div class="row" style={{ alignItems: 'center', justifyContent: 'center', marginTop: 15 }}>
                                            <div className="col-md-12 ">
                                                <h5 className="tituloPDF" align="center"> Estado de permanencia en los Programas de Posgrado</h5>
                                            </div>
                                            {aI == aF ? (<div className="subtituloPDF col-md-12" align="center">Espacio Temporal: {this.props.anioIni}</div>) :
                                                (<div className="subtituloPDF col-md-12" align="center" >Espacio Temporal: {this.props.anioIni} al {this.props.anioFin}</div>)}
                                        </div>
                                        <div className="col-md-10" style={{ marginTop: 20 }}>
                                            {/*Tabla*/}
                                            <table className="table table-bordered col-md-10 TablaEstadisticaAzulPDF">
                                                <thead>
                                                    <th>Programa</th>
                                                    <th>Estado</th>
                                                    {Parser(this.state.miHtml)}
                                                </thead>
                                                <tbody>
                                                    {Parser(this.state.miHtml2)}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    
                                </div>
                                {/*Leyenda*/}
                                <div class="row justify-content-md-center">
                                    <div className="col-md-6">
                                        <hr></hr>
                                        <h5 className="titulo2PDF">Leyenda: </h5>
                                        {Parser(this.state.myleyenda)}
                                    </div>
                                    <div className="col-md-1"></div>
                                    <div className="col-md-3">
                                        {Parser(this.state.myleyenda2)}
                                    </div>
                                </div>
                                {/*"[paginaActual] de [totalPag]"*/}
                                <div class="row align-items-end">
                                    <div class="col">{paginaActual} de {totalPag}</div>
                                </div>
                                {/*Crear hoja*/}

                                {/* Aca acaba la pimera hoja */}
                            </div>

                            <div>

                            </div>

                        </div>
                    </div>
                );
            }
            else {
                //totalPag = Math.round(totalPag - tablaLineas/ topeLinea + 1);
                totalPag = Math.round(((totalLineas - tablaLineas) / topeLinea) + 0.5 + 1);
                lineaActual = leyendaLineas;
                banderaLeyendaGrande = true;
                pdf.push(
                    <div>
                        {/*Añadir encabezado
                    Añadir tabla
                    "[paginaActual] de [totalPag]"
                    Crear una hoja
                    Añadir encabezado
                    Añadir Leyenda
                    */}
                        <div id="tabla" className='container'>
                            {/* Aca comienza la primera pagina */}
                            <div id="imagenPdf1">
                                {/*Encabezado*/}
                                {this.state.htmlencabezado}
                                <div style={{ marginTop: 0 }} class="row justify-content-md-center">
                                    <div class="panel row" style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <div class="row" style={{ alignItems: 'center', justifyContent: 'center', marginTop: 15 }}>
                                            <div className="col-md-12 ">
                                                <h5 className="tituloPDF" align="center"> Estado de permanencia en los Programas de Posgrado</h5>
                                            </div>
                                            {aI == aF ? (<div className="subtituloPDF col-md-12" align="center">Espacio Temporal: {this.props.anioIni}</div>) :
                                                (<div className="subtituloPDF col-md-12" align="center" >Espacio Temporal: {this.props.anioIni} al {this.props.anioFin}</div>)}
                                        </div>
                                        <div className="col-md-10" style={{ marginTop: 20 }}>
                                            {/*Tabla*/}
                                            <table className="table table-bordered col-md-10 TablaEstadisticaAzulPDF">
                                                <thead>
                                                    <th>Programa</th>
                                                    <th>Estado</th>
                                                    {Parser(this.state.miHtml)}
                                                </thead>
                                                <tbody>
                                                    {Parser(this.state.miHtml2)}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                {/*Leyenda*/}
                                <div class="row justify-content-md-center">
                                    <div className="col-md-6">
                                        <hr></hr>
                                        <h5 className="titulo2PDF">Leyenda: </h5>
                                        {Parser(this.state.myleyenda)}
                                    </div>
                                    <div className="col-md-1"></div>
                                    <div className="col-md-3">
                                        {Parser(this.state.myleyenda2)}
                                    </div>
                                </div>
                                {/*"[paginaActual] de [totalPag]"*/}
                                <div class="row justify-content-md-center">
                                    <div class="col-md-1"></div>
                                    <div class="col-md-9"></div>
                                    <div class="col-md-1" style={{textAlign: "right"}}>{paginaActual} de {totalPag}</div>
                                </div>
                                {/*Crear hoja*/}
                            </div>
                            {/* Aca termina la primera pagina */}

                            <div>

                            </div>

                        </div>
                    </div>
                );
            }

            //Imprimir gráficas
            if (banderaLeyendaGrande) {
                //alert("la leyenda es grande");
            } else {
                //alert("la leyenda es chiquita");
            }
            let etiqueta = []
            var iterador = 0;


            var contenidoInterno = [];

            var arregloInterno = [];
            for (var i = this.state.inicioRelativo; i <= this.state.finRelativo; i++) {

                // Ignorar----------------------------------------------------------------
                etiqueta.push(
                    <div class="panel row align-items-center">
                        <div class="panel-body col-md-6 mr-md-auto ml-md-auto" style={{ marginBottom: 50 }}>
                            <CanvasJSChart options={this.state.data[iterador]} />
                        </div>
                    </div>
                );
                // Ignorar----------------------------------------------------------------

                if ((lineaActual + 10 + 1) <= topeLinea) {

                    //Se puede poner graficas
                    arregloInterno.push(
                        //Generar gráfico
                        <div class="panel row align-items-center">
                            <div class="panel-body col-md-6 mr-md-auto ml-md-auto" style={{ marginBottom: 50 }}>
                                <CanvasJSChart options={this.state.data[iterador]} />
                            </div>
                        </div>
                    );
                    lineaActual += 11;

                    if(iterador === this.state.data.length -1){
                        
                        for (var j = lineaActual; j <= topeLinea - 15; j++) {
                            //alert(j);
                            arregloInterno.push(<br/>)
                        }
            
                    }



                } else {
                    //Me indica que ya debo acabar la pagina
                    lineaActual = 0;
                    contenidoInterno.push(arregloInterno);
                    arregloInterno = [];
                    arregloInterno.push(
                        <div class="panel row align-items-center">
                            <div class="panel-body col-md-6 mr-md-auto ml-md-auto" style={{ marginBottom: 50 }}>
                                <CanvasJSChart options={this.state.data[iterador]} />
                            </div>
                        </div>
                    );
                    lineaActual += 11;
                }

                iterador++;
            }
            contenidoInterno.push(arregloInterno);

            for (var pagina of contenidoInterno) {
                paginaActual++;
                pdf.push(
                    <div id={"imagenPdf" + paginaActual}>

                        {this.state.htmlencabezado}
                        {/*Leyenda*/}
                        {/*
                        {banderaLeyendaGrande ?
                            <div class="row justify-content-md-center">
                                <div className="col-md-6">
                                    <hr></hr>
                                    <h5 className="titulo2PDF">Leyenda: </h5>
                                    {Parser(this.state.myleyenda)}
                                </div>
                                <div className="col-md-1"></div>
                                <div className="col-md-3">
                                    {Parser(this.state.myleyenda2)}
                                </div>
                            </div>
                            : null}
                        */}

                        {pagina}

                        {/*"[paginaActual] de [totalPag]"*/}
                        <div class="row justify-content-md-center">
                            <div class="col-md-1"></div>
                            <div class="col-md-9"></div>
                            <div class="col-md-1" style={{textAlign: "right"}}>{paginaActual} de {totalPag}</div>
                        </div>

                    </div>

                )
                banderaLeyendaGrande = false;

            }

            




            /////////////

            this.setState({
                htmlGrafica: etiqueta,
                miPDF: pdf,
                cantidadDePaginas: totalPag,

                banderaCarga: true
            }, () => {
                setTimeout(async () => {
                    //const input2 = document.getElementById('graficax');
                    var arregloImagen = [];
                    for (var i = 1; i <= this.state.cantidadDePaginas; i++) {
                        const input2 = await document.getElementById('imagenPdf' + i);
                        await html2canvas(input2)
                            .then(async (canvas2) => {
                                const imgData2 = await canvas2.toDataURL('image/png');
                                await arregloImagen.push({ imagen: imgData2, orden: i });
                                await this.setState({
                                    //imagen2: imgData2,
                                    //cargoImagen2: true
                                    contadorCargaPaginas: this.state.contadorCargaPaginas + 1
                                }, () => {
                                    //alert(this.state.contadorCargaPaginas+" PROBANDO "+this.state.cantidadDePaginas);
                                    if (this.state.contadorCargaPaginas == this.state.cantidadDePaginas) {
                                        //alert("LLEGO");
                                        setTimeout(async () => {
                                            this.setState({
                                                imagen2: arregloImagen,
                                                cargoImagen2: true,
                                                isChartLoaded: false,
                                                contadorCargaPaginas: 0
                                            })
                                        }, 2000);
                                    }
                                });


                            });
                    }

                }, 2000);

            })
        }


        return (
            <div>
                <Tabs align="center" className="textTab">
                    <Tab label="Tabla">
                        <div class="panel row" style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <div class="panel-heading">
                                <div class="row" style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                                    <div className="col-md-10 ">
                                        <h5 className="textTitulo" align="center"> Estado de permanencia en los Programas de Posgrado</h5>
                                    </div>
                                    {aI == aF ? (<div className="textTitulo col-md-12" align="center">Espacio Temporal: {this.props.anioIni}</div>) :
                                        (<div className="textTitulo col-md-12" align="center" >Espacio Temporal: {this.props.anioIni} al {this.props.anioFin}</div>)}
                                </div>
                                <br />
                            </div>
                            <div className="col-md-11" style={{ marginTop: 10, marginLeft: 60}}>
                                <table className="table table-bordered col-md-12 mr-md-auto TablaEstadisticaAzul">
                                    <thead>

                                        <th>Programa</th>
                                        <th>Estado</th>
                                        {Parser(this.state.miHtml)}

                                    </thead>
                                    <tbody>
                                        {Parser(this.state.miHtml2)}
                                    </tbody>
                                </table>
                            </div>
                            <div className="col col-md-10">

                                <div class="row justify-content-md-center">
                                    <div className="col-md-6">
                                        <br />
                                        <h5 style={{ marginLeft: 10}} className="textSubtitulo">Leyenda: </h5>
                                        {Parser(this.state.myleyenda)}      
                                    </div>
                                    <div className="col-md-1"></div>
                                    <div className="col-md-3">
                                        {Parser(this.state.myleyenda2)}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </Tab>
                    <Tab label="Grafico">
                        <div class="panel row align-items-center">
                            <div className="panel-heading mt-3 mb-3" >
                                <h5 style={{ marginLeft: 60 }} className="textTitulo">Gráficas: </h5>
                                <br />
                            </div>
                            <div className="panel-body col-md-11 justify-content-md-center">
                                {this.state.banderaCarga ? this.state.htmlGrafica : null}
                            </div>
                        </div>
                    </Tab>

                    <Tab label="Visualizar PDF" >
                        <div className="panel row align-items-center" >
                            <div className="panel-heading mt-3 mb-3">
                                <h4 style={{ marginLeft: 60 }} className="textTitulo">Visualizar PDF</h4>
                            </div>
                            <div className="panel-body col-md-11 mr-md-auto ml-md-auto">
                                {this.state.cargoImagen1 && this.state.cargoImagen2 ? <Pdf imagen={this.state.imagen1} imagen2={this.state.imagen2}></Pdf> : null}

                            </div>
                        </div>
                    </Tab>
                </Tabs>

                <div style={this.state.cargoImagen1 && this.state.cargoImagen2 && this.state.banderaCarga ? { display: 'none' } : null} id="copia">
                    {/*this.state.miPDF*/}
                    <div id="tabla" className='container'>
                    </div>
                    <div class="panel row align-items-center" id="graficax" style={{ marginTop: 0 }}>
                        <div className="col-md-3" >
                            {/*<hr></hr>
                            <h5 style={{ marginLeft: 60 }} className="titulo">Gráficas: </h5>
                            <hr></hr>*/}
                        </div>
                        <div className="panel-body col-md-11 mr-md-auto ml-md-auto ">
                            {this.state.banderaCarga ? this.state.miPDF : null}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default EstadoPermanencia;
