

// var contenido = `
// <h1>Esto es un test de html-pdf</h1>
// <p>Estoy generando PDF a partir de este código HTML sencillo</p>
// `;

// pdf.create(contenido).toFile('./salida.pdf', function(err, res) {
//     if (err){
//         console.log(err);
//     } else {
//         console.log(res);
//     }
// });


export default class PDFTron {

    init = (source, element) => {
      this.viewer = new window.PDFTron.WebViewer({
        path: '/WebViewer/lib',
        l: 'demo:giordano200699@gmail.com:742ab03d016493d907b49053fdfc50e589b69c5bab47a24806',
        initialDoc: source,
      }, element);
    }

    rotate = (direction) => {
      if(direction === 'clockwise') {
        this.viewer.rotateClockwise();
      } else {
        this.viewer.rotateCounterClockwise();
      }
    }
  }