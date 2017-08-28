class Car {
  constructor(id,sequence,cls,length,tons, loadedStatus) {
    this.id = id;
    this.sequence = sequence;
    this.class = cls;
    this.length = length;
    this.tons = tons;
    this.loaded = loadedStatus;
  }

  toString() { return `id: ${this.id} | sequence: ${this.sequence} | class: ${this.class} | length: ${this.length} | tons: ${this.tons}`; }

}
