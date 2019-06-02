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
        };

    }


    

    render() {
        
        return (
            <PDFViewer  style={{width:'100%', height:'100vh'}}>
            <Document >
            <Page size="A4">
                <View >
                    <Image src={this.props.imagen}></Image>
                </View>
            </Page>
            {this.props.imagen2?
            <Page size="A4">
                <View >
                    <Image src={this.props.imagen2}></Image>
                </View>
            </Page>
            :null}
                
            </Document>
            </PDFViewer>

        );
    }
}



export default Pdf;
