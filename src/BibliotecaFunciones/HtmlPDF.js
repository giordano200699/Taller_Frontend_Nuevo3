import Parser from 'html-react-parser';
import React, { Component }  from 'react';
import CanvasJSReact, { CanvasJS } from '../canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

var htmlPDF = async (totalLineas,tablaLineas,htmlTituloTabla, htmlTabla,leyenda1,leyenda2,htmlencabezado,inicioRelativo,finRelativo,jsonGrafica,finFake,htmlPieTabla,htmlTodoHeadTabla,titulo) =>{
    //En esta variable guardaremos las hojas del pdf
    let pdf = [];
    var topeLinea = 50;
    var totalPag = 0;
    var lineaActual = 0;
    var paginaActual = 1;
    var leyendaLineas = 11;

    var banderaLeyendaGrande = false;

    //Si la tabla con su leyenda es menor a una pagina
    if ((tablaLineas + leyendaLineas) <= topeLinea) {
        //totalPag = Math.round(totalLineas / topeLinea + 0.5);
        totalPag = Math.round(1.0);
        await pdf.push(
            <div>
                <div id="tabla" className='container'>
                    <div id="imagenPdf1">
                        {/*Encabezado*/}
                        {htmlencabezado}
                        {/*Tabla*/}
                        <div style={{ marginTop: 0 }} class="row justify-content-md-center">
                            <div class="panel row" style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <div class="row" style={{ alignItems: 'center', justifyContent: 'center', marginTop: 15, marginBottom:20 }}>
                                    <div className="col-md-12 ">
                                        <h5 className="tituloPDF" align="center">{titulo}</h5>
                                    </div>
                                    <div className="subtituloPDF col-md-12" align="center">Espacio Temporal: {inicioRelativo!=finFake?inicioRelativo+" al "+finFake:inicioRelativo}</div>
                                </div>
                                <div className="col-md-10" style={{ marginTop: 20,marginBottom:20 }}>
                                    <table className="table table-bordered col-md-10 TablaEstadisticaAzulPDF">
                                        <thead>
                                            {htmlTodoHeadTabla?
                                                Parser(htmlTodoHeadTabla)
                                            :
                                                htmlTituloTabla?
                                                Parser("<th>Programa</th><th>Estado</th>"+htmlTituloTabla)
                                                :Parser("<th>Programa</th><th>Estado</th><th>Total</th>")
                                            }
                                            
                                        </thead>
                                        <tbody>
                                            {Parser(htmlTabla)}
                                        </tbody>
                                        {htmlPieTabla?
                                            <tfoot>
                                                {Parser(htmlPieTabla)}                                  
                                            </tfoot>
                                            :null}
                                    </table>
                                </div>
                            </div>
                        </div>
                        
                         {/*Grafica*/}
                         <div>
                            <div class="panel row align-items-center">
                                <div class="panel-body col-md-6 mr-md-auto ml-md-auto" style={{ marginBottom: 20 }}>
                                    {jsonGrafica[0]}
                                </div>
                            </div>
                        </div>
                        
                        {/*Leyenda*/}
                        <div class="row justify-content-md-center">
                            <div className="col-md-6">
                                <hr></hr>
                                <h5 className="titulo2PDF">Leyenda: </h5>
                                {Parser(leyenda1)}
                            </div>
                            <div className="col-md-1"></div>
                            <div className="col-md-3">
                                {Parser(leyenda2)}
                            </div>
                        </div>
                        
                        {/*"[paginaActual] de [totalPag]"*/}
                        <div class="row justify-content-md-center">
                            <div class="col-md-1"></div>
                            <div class="col-md-9"></div>
                            <div class="col-md-1" style={{textAlign: "right"}}>{paginaActual} de {totalPag}</div>
                        </div>
                        {/*Crear hoja*/}

                        {/* Aca acaba la pimera hoja */}
                    </div>

                </div>
            </div>
        );

        return pdf;

    }


    else {
        totalPag = Math.round(((totalLineas - tablaLineas) / topeLinea) + 0.5 + 1);
        lineaActual = leyendaLineas;
        banderaLeyendaGrande = true;
        pdf.push(
            <div>
                <div id="tabla" className='container'>
                    <div id="imagenPdf1">
                        {/*Encabezado*/}
                        {htmlencabezado}
                        {/*Tabla*/}
                        <div style={{ marginTop: 0 }} class="row justify-content-md-center">
                            <div class="panel row" style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <div class="row" style={{ alignItems: 'center', justifyContent: 'center', marginTop: 15 }}>
                                    <div className="col-md-12 ">
                                        <h5 className="tituloPDF" align="center">{titulo}</h5>
                                    </div>
                                    <div className="subtituloPDF col-md-12" align="center">Espacio Temporal: {inicioRelativo!=finFake?inicioRelativo+" al "+finFake:inicioRelativo}</div>
                                </div>
                                <div className="col-md-10" style={{ marginTop: 20 }}>
                                    <table className="table table-bordered col-md-10 TablaEstadisticaAzulPDF">
                                        <thead>
                                            {htmlTodoHeadTabla?
                                                Parser(htmlTodoHeadTabla)
                                            :
                                                htmlTituloTabla?
                                                Parser("<th>Programa</th><th>Estado</th>"+htmlTituloTabla)
                                                :Parser("<th>Programa</th><th>Estado</th><th>Total</th>")
                                            }
                                        </thead>
                                        <tbody>
                                            {Parser(htmlTabla)}
                                        </tbody>
                                        {htmlPieTabla?
                                            <tfoot>
                                                {Parser(htmlPieTabla)}                                  
                                            </tfoot>
                                            :null}
                                    </table>
                                </div>
                            </div>
                        </div>
                         {/*Leyenda*/}
                         {banderaLeyendaGrande ?
                            <div class="row justify-content-md-center">
                                <div className="col-md-6">
                                    <hr></hr>
                                    <h5 className="titulo2PDF">Leyenda: </h5>
                                    {Parser(leyenda1)}
                                </div>
                                <div className="col-md-1"></div>
                                <div className="col-md-3">
                                    {Parser(leyenda2)}
                                </div>
                            </div>
                        : null}

                        {/*"[paginaActual] de [totalPag]"*/}
                        <div class="row justify-content-md-center">
                            <div class="col-md-1"></div>
                            <div class="col-md-9"></div>
                            <div class="col-md-1" style={{textAlign: "right"}}>{paginaActual} de {totalPag}</div>
                        </div>
                        {/*Crear hoja*/}
                    </div>
                </div>
            </div>
        );


        var iterador = 0;

        var contenidoInterno = [];

        var arregloInterno = [];
        for (var i = inicioRelativo; i <= finRelativo; i++) {
        
            // Ignorar----------------------------------------------------------------
            // Ignorar----------------------------------------------------------------

            if ((lineaActual + 10 + 1) <= topeLinea) {

                //Se puede poner graficas
                arregloInterno.push(
                    //Generar gráfico
                    <div>
                        <div class="panel row align-items-center">
                            <div class="panel-body col-md-6 mr-md-auto ml-md-auto" style={{ marginBottom: 50 }}>
                                {jsonGrafica[iterador]}
                            </div>
                        </div>
                    </div>
                );
                lineaActual += 11;

                if(iterador === jsonGrafica.length -1){
                            
                    for (var j = lineaActual; j <= topeLinea ; j++) {
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
                    <div>
                        <div class="panel row align-items-center">
                            <div class="panel-body col-md-6 mr-md-auto ml-md-auto" style={{ marginBottom: 50 }}>
                                {jsonGrafica[iterador]}
                            </div>
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

                    {htmlencabezado}
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

        return pdf;
    }
    
    /*
    var iterador = 0;


    var contenidoInterno = [];

    var arregloInterno = [];
    for (var i = inicioRelativo; i <= finRelativo; i++) {
    
        // Ignorar----------------------------------------------------------------
        // Ignorar----------------------------------------------------------------

        if ((lineaActual + 10 + 1) <= topeLinea) {

            //Se puede poner graficas
            arregloInterno.push(
                //Generar gráfico
                <div>
                    <div class="panel row align-items-center">
                        <div class="panel-body col-md-6 mr-md-auto ml-md-auto" style={{ marginBottom: 50 }}>
                            {jsonGrafica[iterador]}
                        </div>
                    </div>
                </div>
            );
            lineaActual += 11;

            if(iterador === jsonGrafica.length -1){
                        
                for (var j = lineaActual; j <= topeLinea ; j++) {
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
                <div>
                    <div class="panel row align-items-center">
                        <div class="panel-body col-md-6 mr-md-auto ml-md-auto" style={{ marginBottom: 50 }}>
                            {jsonGrafica[iterador]}
                        </div>
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

                {htmlencabezado}
                {pagina}

                {"[paginaActual] de [totalPag]"}
                <div class="row justify-content-md-center">
                    <div class="col-md-1"></div>
                    <div class="col-md-9"></div>
                    <div class="col-md-1" style={{textAlign: "right"}}>{paginaActual} de {totalPag}</div>
                </div>

            </div>

        )
        banderaLeyendaGrande = false;

    }

    return pdf;

    */
};
 
export default htmlPDF;