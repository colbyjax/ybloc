class Track {
  //new Track('L01','lead',10000,'',{ x: 1, start: {x:0,y:0}, end: {x:0,y:0} })
  // display { x, start{x,y}, end{x,y}}
  constructor(id, type, length, direction, display) {
    this.id = id;
    this.type = type;
    this.length = length;
    this.direction = direction;
    this.display = display;
    this.display.cars = [];
    this.cars = [];
  }

  toString() { return `id: ${this.id} | type: ${this.type} | length: ${this.length} | direction: ${this.direction} | display: ${this.display}`; }

  /**
   * Set the cars on the track - takes an array of cars and replaces whatever is on the track
   * @param {[Car]} carList - Cars on the track
   **/
   setCars(carList) {
     if(carList.length > 0) {
       this.cars = carList.slice(0);
     }
   }

   getCars() {
     return this.cars;
   }

   /**
    * Adds the fabric js object for tracking what is on display
    * @param {fabric.Rect} displayCar
    **/

   addDisplayCar(displayCar) {
     this.display.cars.push(displayCar);
   }

   removeDisplayCar(displayCarIndex, numberToRemove) {
     this.display.cars.splice(displayCarIndex,numberToRemove);
   }
}
