import Parser from 'html-react-parser';
import React, { Component }  from 'react';
import html2canvas from 'html2canvas';

var htmlAFoto = async (totalLineas,tablaLineas,htmlTituloTabla, htmlTabla,leyenda1,leyenda2,htmlencabezado,arregloImagen) =>{
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
        totalPag = Math.round(totalLineas / topeLinea + 0.5);
        await pdf.push(
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
                                        <h5 className="tituloPDF" align="center"> Estado de permanencia en los Programas de Posgrado</h5>
                                    </div>
                                </div>
                                <div className="col-md-10" style={{ marginTop: 20 }}>
                                    <table className="table table-bordered col-md-10 TablaEstadisticaAzulPDF">
                                        <thead>
                                            <th>Programa</th>
                                            <th>Estado</th>
                                            {htmlTituloTabla?Parser(htmlTituloTabla):null}
                                        </thead>
                                        <tbody>
                                            {Parser(htmlTabla)}
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
                                {Parser(leyenda1)}
                            </div>
                            <div className="col-md-1"></div>
                            <div className="col-md-3">
                                {Parser(leyenda2)}
                            </div>
                        </div>
                        {/*"[paginaActual] de [totalPag]"*/}
                        {paginaActual} de {totalPag}
                        {/*Crear hoja*/}

                        {/* Aca acaba la pimera hoja */}
                    </div>

                    <div>

                    </div>

                </div>
            </div>
        );
    }
    return pdf;
};
 
export default htmlAFoto;