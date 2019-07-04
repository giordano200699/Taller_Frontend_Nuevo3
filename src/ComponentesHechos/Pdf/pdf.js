import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Page, Text, View, Document, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});



class Pdf extends Component {

    constructor(props){
        super(props);
        this.state = {
            paginasCargadas : null
        };
        

    }


    

    render() {

        var arregloCodigo = [];
        var resultado = this.props.imagen2;
        
        resultado.sort(function (a, b) {
            if (a.orden > b.orden) {
              return 1;
            }
            if (a.orden < b.orden) {
              return -1;
            }
            // a must be equal to b
            return 0;
          });
          
        for(var imagen of resultado){
            arregloCodigo.push(
                <Page size="A4">
                    <View >
                        <Image src={imagen.imagen}></Image>
                    </View>
                </Page>
            );
        }
        
        return (
            <PDFViewer  style={{width:'100%', height:'100vh'}}>
            <Document >
            {/* <Page size="A4">
                <View >
                    <Image src={this.props.imagen}></Image>
                </View>
            </Page> */}
            
            {arregloCodigo}
                
            </Document>
            </PDFViewer>

        );
    }
}



export default Pdf;