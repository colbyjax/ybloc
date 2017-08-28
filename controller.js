/**
 *  Controller that retrieves data.  For Proof of concept, data is mocked.
**/
class Controller {
  constructor() {
    this.display = {
      canvasHeight: c.offsetHeight,
      canvasWidth: c.offsetWidth,
      scale: 0.12,
      carSpacing: 3,
      carHeight: 15,
      markers: [],
      selectedCars: []
    };
    this.yard = {
      name: "WINSTON YARD",
      cityState: "Lakeland, FL",
      milepost: "AY 856",
      margin: 25,
      startX: 50,
      startY: this.display.canvasHeight * 0.95,
      spacing: 25,
      increment: 15,
      tracks: [
      //id, type, length, direction, display
      new Track('L01','lead',10000,'',{ x: 1, start: {x:0,y:0}, end: {x:0,y:0} }),
      new Track('L02','lead',8650,'',{ x: 2, start: {x:0,y:0}, end: {x:0,y:0} }),
      new Track('W01','',7590,'N95',{ x: 3, start: {x:0,y:0}, end: {x:0,y:0} }),
      new Track('W02','',7590,'N95',{ x: 4, start: {x:0,y:0}, end: {x:0,y:0} }),
      new Track('W03','',7590,'',{ x: 5, start: {x:0,y:0}, end: {x:0,y:0} }),
      new Track('W04','',7590,'N91',{ x: 6, start: {x:0,y:0}, end: {x:0,y:0} }),
      new Track('W05','',7590,'N80',{ x: 7, start: {x:0,y:0}, end: {x:0,y:0} }),
      new Track('W06','',6600,'N90',{ x: 8, start: {x:0,y:0}, end: {x:0,y:0} }),
      new Track('R01','',5000,'',{ x: 4, start: {x:0,y:0}, end: {x:0,y:0} }),
      new Track('W07','',2310,'',{ x: 5, start: {x:0,y:0}, end: {x:0,y:0} }),
      new Track('W08','',2310,'',{ x: 6, start: {x:0,y:0}, end: {x:0,y:0} }),
      new Track('W09','',2310,'',{ x: 7, start: {x:0,y:0}, end: {x:0,y:0} }),
      new Track('W10','',2310,'',{ x: 8, start: {x:0,y:0}, end: {x:0,y:0} }),
      new Track('W11','',2310,'',{ x: 9, start: {x:0,y:0}, end: {x:0,y:0} }),
      new Track('W12','',2310,'',{ x: 10, start: {x:0,y:0}, end: {x:0,y:0} }),
      new Track('W13','',2310,'',{ x: 11, start: {x:0,y:0}, end: {x:0,y:0} }),
      new Track('W14','',2310,'',{ x: 12, start: {x:0,y:0}, end: {x:0,y:0} }),
      new Track('W15','',2310,'',{ x: 13, start: {x:0,y:0}, end: {x:0,y:0} }),
      new Track('W16','',2310,'',{ x: 14, start: {x:0,y:0}, end: {x:0,y:0} }),
      new Track('W17','',2310,'',{ x: 15, start: {x:0,y:0}, end: {x:0,y:0} }),
      new Track('W18','',2310,'',{ x: 16, start: {x:0,y:0}, end: {x:0,y:0} }),
      new Track('W19','',2310,'',{ x: 17, start: {x:0,y:0}, end: {x:0,y:0} }),
      new Track('W20','',2310,'',{ x: 18, start: {x:0,y:0}, end: {x:0,y:0} }),
      new Track('W21','',2310,'',{ x: 19, start: {x:0,y:0}, end: {x:0,y:0} }),
      new Track('W22','',2310,'',{ x: 20, start: {x:0,y:0}, end: {x:0,y:0} }),
      new Track('W23','',2310,'',{ x: 21, start: {x:0,y:0}, end: {x:0,y:0} }),
      new Track('W24','',2310,'',{ x: 22, start: {x:0,y:0}, end: {x:0,y:0} }),
      new Track('W25','',2310,'',{ x: 23, start: {x:0,y:0}, end: {x:0,y:0} }),
      new Track('W26','',2310,'',{ x: 24, start: {x:0,y:0}, end: {x:0,y:0} }),
      new Track('W27','',2310,'',{ x: 25, start: {x:0,y:0}, end: {x:0,y:0} }),
      new Track('W28','',2310,'',{ x: 26, start: {x:0,y:0}, end: {x:0,y:0} }),
      new Track('W29','',2310,'',{ x: 27, start: {x:0,y:0}, end: {x:0,y:0} })
    ]
    };
    this.trackMap = new Map();
    this.trainMap = new Map();
    this.carMap = new Map();
    this.selectedTrackMap = new Map();
    this.switchLists = [];

  }

  getDisplay() {
    return this.display;
  }

  getYard() {
    return this.yard;
  }

  getTrackMap() {
    return this.trackMap;
  }

  getTrainMap() {
    return this.trainMap;
  }

  getCarMap() {
    return this.carMap;
  }

  getSelectedTrackMap() {
    return this.selectedTrackMap;
  }

  getSwitchLists() {
    return this.switchLists;
  }

  getSwitchList(index) {
    return this.switchLists[index];
  }

  addSwitchList(switchList) {
    this.switchLists.push(switchList);
  }

  clearSwitchLists() {
    this.switchLists = [];
  }

}
