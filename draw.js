function run() {
    // create a wrapper around native canvas element (with id="c")
    console.log("Starting to draw on Canvas...");
    let yard = controller.getYard();
    let display = controller.getDisplay();

    // Draw Title
    let title = new fabric.Text(yard.name, {
        left: 25,
        top: 25,
        fontSize: 30,
        stroke: 'grey'
    });
    let subtitle = new fabric.Text(yard.cityState, {
        left: 30,
        top: 60,
        fontSize: 24,
        stroke: 'grey'
    });
    let milepost = new fabric.Text(yard.milepost, {
        left: 30,
        top: 95,
        fontSize: 24,
        stroke: 'grey'
    });
    let hoverText = new fabric.Text("HOVER", {
        left: display.canvasWidth * 0.5,
        top: display.canvasHeight * 0.5,
        fontSize: 18,
        stroke: 'grey',
        visible: false
    });
    canvas.add(title, subtitle, milepost, hoverText);

    drawYard(yard);
    seedInventory();
    canvas.renderAll();
    console.log("Finished Drawing on canvas!");

    // Add Hover Event Listener
    canvas.on('mouse:over', function(e) {
        if (e.target !== null) {
            let car = e.target.name;

            if (car !== undefined) {
                hoverText.set('text', "Car: " + car.id + " ,Class: " + car.class);
                hoverText.set('visible', true);
                //console.log("Class: " + e.target.name.class);
                canvas.renderAll();
            }
        }
    });

    canvas.on('mouse:out', function(e) {
        hoverText.set('visible', false);
        canvas.renderAll();
    });
}

// Draws a yard defined by winston.js
function drawYard(yard) {
    // Draw the Tracks in Winston Yard
    for (let i = 0; i < yard.tracks.length; i++) {
        let currentTrack = yard.tracks[i];
        let startX = yard.startX + (yard.increment * currentTrack.display.x);
        let startY = yard.startY - (yard.spacing * (i + 1));
        let length = currentTrack.length * controller.getDisplay().scale;

        // Assign Display values to Track x & y coordinates (start,end)
        currentTrack.display.start.x = startX;
        currentTrack.display.start.y = startY;
        currentTrack.display.end.x = startX + length;
        currentTrack.display.end.y = startY;

        console.log("Drawing: " + currentTrack.id + " x: " + startX + " y: " + startY + " length: " + length);
        let line = new fabric.Line([currentTrack.display.start.x, currentTrack.display.start.y, currentTrack.display.end.x, currentTrack.display.end.y], {
            stroke: 'black',
            selectable: false
        });
        let leftText = new fabric.Text(currentTrack.id, {
            left: startX - 30,
            top: startY - 5,
            fontSize: 12,
            stroke: 'blue',
            selectable: false
        });
        let rightText = new fabric.Text(currentTrack.id, {
            left: startX + length + 5,
            top: startY - 5,
            fontSize: 12,
            stroke: 'blue',
            selectable: false
        });
        canvas.add(line, leftText, rightText);

        // Add the track to the Map
        controller.getTrackMap().set(currentTrack.id, currentTrack);
    }
}

/**
 * Draws cars on a given track
 * TODO: Refactor car spacing and possibly displaycar
 **/
function drawCars(track) {

    let carList = track.getCars();
    let priorCarLength = controller.display.carSpacing;

    // Draw rectangles for each car
    for (let i = 0; i < carList.length; i++) {
        let c = carList[i];
        let width = c.length * controller.display.scale;
        let height = controller.display.carHeight;
        let top = track.display.start.y - controller.display.carHeight / 2;
        let left = track.display.start.x + priorCarLength + (controller.display.carSpacing * (i + 1));
        let color = classMap.get(c.class);
        console.log("Adding car: top: " + top + ", left: " + left + ", " + ", width: " + width + ", height: " + height + ", priorCarLength: " + priorCarLength);

        let car = new fabric.Rect({
            width: width,
            height: height,
            top: top,
            left: left,
            stroke: color,
            fill: color
        });
        car.name = c;

        canvas.add(car);
        track.addDisplayCar(car);
        controller.getCarMap().set(c.id, {
            track: track,
            sequence: c.sequence,
            displayCar: car
        });

        priorCarLength += c.length * controller.display.scale;
    }
}

/**
 * Sets the scale magnification of the canvas
 */
function setScale(scale) {
    if (scale !== "" && scale != controller.display.scale && scale > 0 && scale < 1) {
        controller.display.scale = scale;
        canvas.clear();
        console.log("New Scale set: " + scale);
        run();
    }
}

/**
 * Clears all cars on a given track
 **/
function clearCars(trackId) {
    let track = trackMap.get(trackId);
    let clearCount = 0;
    for (let i = 0; i < 4; i++) {
        console.log(`Clearing car: ${track.display.cars[i].name.id}`);
        canvas.remove(track.display.cars[i]);
        clearCount++;
    }
    track.removeDisplayCar(0, clearCount);
}

/**
 * Function that transfers cars between tracks and cleans up the track display
 * @param fromTrack - indicates the track cars are moved from
 * @param toTrack - indicates the track cars are moved to
 * @param direction - indicates the direction cars are inserted on toTrack (left, right)
 * @param carList - list of cars to move
 **/
function moveCars(fromTrack, toTrack, direction, carList) {
    removeTrackCars(fromTrack, carList);
    addTrackCars(toTrack, carList, direction);
    canvas.renderAll();
}

function removeTrackCars(trackId, carList) {
    let track = controller.getTrackMap().get(trackId);
    let newList = [];
    // Cycle through the car list and build new Car list from cars not in carList
    for (let car of track.cars) {
        let i = 0;
        for (let c of carList) {
            if (c.displayCar.name.id === car.id) {
                // car found in list, remove from map
                i = 1;
            }
        }
        if (i === 0) {
            // car not found in list
            newList.push(car);
        }
        i = 0;
    }
    track.cars = newList;
    clearTrackDisplay(trackId);
    drawCars(track);
}

function addTrackCars(trackId, carList, direction) {
    let track = controller.getTrackMap().get(trackId);
    if (direction === "S") {
        // Add sequentially
        for (let car of carList) {
            track.cars.push(car.displayCar.name);
        }
    } else {
        // Add in reverse order
        for (let i = carList.length - 1; i >= 0; i--) {
            track.cars.unshift(carList[i].displayCar.name);
        }
    }

    clearTrackDisplay(trackId);
    drawCars(track);
}

function clearTrackDisplay(trackId) {
    let track = controller.getTrackMap().get(trackId);
    for (let car of track.display.cars) {
        canvas.remove(car);
    }
    track.display.cars = [];
}

/**
 * Finds cars on tracks that are within a given train's car list and marks them on Map
 **/
function findTrainCars(trainId) {
    // Clear any currently selections -- Possibly change in future to allow multiple train selections
    clearSelection();
    let train = controller.getTrainMap().get(trainId);


    // Find and mark the cars on the tracks that correspond to the train
    for (let c of train.carList) {

        let displayObject = controller.getCarMap().get(c.id);
        if (displayObject !== null) {
            console.log(`Found car: ${c.id} on track ${displayObject.track.id}`);

            highlightCar(displayObject.displayCar);
        }
    }
    // Set the current train info
    setCurrentTrain(train);

    canvas.renderAll();
}

function setCurrentTrain(train) {
    // Update Train stats
    calculateTrainStats(train);

    // Set the Current Train Info
    $('#currentTrainId').html(train.id);
    $('#currentTrainCars').html(train.carList.length);
    $('#currentTrainLength').html(train.length);

    // Missing cars
    let missingCars = train.carList.length - controller.display.selectedCars.length;
    $('#currentTrainMissing').html(missingCars);

    // Make div visible
    $('#currentTrain').removeClass('hidden');
}

/**
 * Calculates the current train stats (length, tons, etc..)
 **/
function calculateTrainStats(train) {


    let totalLength = 0;
    let totalTons = 0;
    for (let c of train.carList) {
        totalLength += c.length;
        totalTons += c.tons;
    }

    train.length = totalLength;
    train.tons = totalTons;
}

function buildTrain() {
    // Cycle through selected cars and build a new selected trackMap
    controller.getSelectedTrackMap().clear();
    controller.clearSwitchLists();
    for (let displayCar of controller.display.selectedCars) {
        let carId = displayCar.name.id;
        let car = controller.getCarMap().get(carId);
        let trackId = car.track.id;
        let x = controller.getSelectedTrackMap().get(trackId);
        if (x === undefined) {
            controller.getSelectedTrackMap().set(trackId, {car: [car] });
        } else {
            x.car.push(car);
        }
    }

    // Clear any existing table rows first
    $('#switchListModalTable tbody tr').each(function() {
        $(this).remove();
    });

    $('#switchListTable tbody tr').each(function() {
        $(this).remove();
    });

    // Add rows per track
    let i = 0;
    for(let [trackId, carList] of controller.getSelectedTrackMap()) {
      // Build switchList
      let newSwitchlist = new Switchlist(trackId, carList);
      controller.addSwitchList(newSwitchlist);

      let markup = `<tr class="switchList" name=${i}><td class="switchList_fromTrack">${trackId}</td>
                    <td class="switchList_cars">${carList.car.length}</td>
                    <td><input class="switchList_toTrack" type="text" value="L02"/></td>
                    <td><input class="switchList_end" type="text" value="N"/></td>
                    </tr>`;
      $('#switchListModalTable tbody').append(markup);
      i++;
    }

    //TODO: Figure out how get track value from modal to build switch list
}

function buildSwitchList() {
  // Cycle through rows in table
  $('#switchListModalTable tbody tr').each(function() {
      // Find the name and pull the switchlist with that index
      let index = $(this).attr('name');
      let currentSwitchList = controller.getSwitchList(index);

      // Get the To track
      currentSwitchList.toTrack = $(this).find('input.switchList_toTrack').val();
      currentSwitchList.end = $(this).find('input.switchList_end').val();
      console.log(`Switchlist index ${index}, fromtrack: ${currentSwitchList.fromTrack}, totrack: ${currentSwitchList.toTrack}, end: ${currentSwitchList.end}`);

      // Add to the SwitchList table
      let markup = `<tr><td>SL${index}</td>
                        <td>${currentSwitchList.fromTrack}</td>
                        <td>${currentSwitchList.carList.car.length}</td>
                        <td>${currentSwitchList.end}</td>
                        <td><a href="#" onclick="executeSwitchList(${index})"><span class='glyphicon glyphicon-transfer'></span></a></span></td>
                        </tr>`;
      $('#switchListTable tbody').append(markup);
  });
}

function executeSwitchList(index) {
  let switchlist = controller.getSwitchList(index);
  // Clear selection
  clearSelection();
  moveCars(switchlist.fromTrack, switchlist.toTrack, switchlist.end, switchlist.carList.car);

  //TODO mark switchlist complete

}

/**
 * Helper function to decorate a marked car to visually distinguish
 **/
function highlightCar(displayCar) {
    let topLine = new fabric.Line([displayCar.left + displayCar.width / 2, displayCar.top, displayCar.left + displayCar.width / 2, displayCar.top - displayCar.height / 2], {
        stroke: 'black',
        strokeWidth: 2.5,
        selectable: false
    });

    let bottomLine = new fabric.Line([displayCar.left + displayCar.width / 2, displayCar.top + displayCar.height, displayCar.left + displayCar.width / 2, displayCar.top + displayCar.height + displayCar.height / 2], {
        stroke: 'black',
        strokeWidth: 2.5,
        selectable: false
    });

    // Store mark circles
    controller.display.markers.push(topLine);
    controller.display.markers.push(bottomLine);
    controller.display.selectedCars.push(displayCar);
    canvas.add(topLine, bottomLine);

    displayCar.set({
        strokeWidth: 2,
        stroke: 'black',
        fill: '#09e82e'
    });
}

/**
 * Clears any selected/marked cars
 **/
function clearSelection() {
    console.log("Clearing Markers...");

    for (let marker of controller.display.markers) {
        canvas.remove(marker);
    }

    for (let car of controller.display.selectedCars) {
        let color = classMap.get(car.name.class);
        car.set({
            strokeWidth: 1,
            stroke: color,
            fill: color
        });
    }
    canvas.renderAll();
    controller.display.markers = [];
    controller.display.selectedCars = [];

    // Hide current train div
    $('#currentTrain').addClass('hidden');
}


/**
 * Function designed to load page with sample data
 * Will be replaced by controller in a real application
 **/
function seedInventory() {
    // Initialize all the tracks with the sample inventory
    let trackMap = controller.getTrackMap();
    let trainMap = controller.getTrainMap();

    let w01_track = trackMap.get("W01");
    w01_track.setCars(W01);
    drawCars(w01_track);

    let l01_track = trackMap.get("L01");
    l01_track.setCars(L01);
    drawCars(l01_track);

    let w02_track = trackMap.get("W02");
    w02_track.setCars(W02);
    drawCars(w02_track);

    let w03_track = trackMap.get("W03");
    w03_track.setCars(W03);
    drawCars(w03_track);

    let w04_track = trackMap.get("W04");
    w04_track.setCars(W04);
    drawCars(w04_track);

    let w06_track = trackMap.get("W06");
    w06_track.setCars(W06);
    drawCars(w06_track);

    let w09_track = trackMap.get("W09");
    w09_track.setCars(W09);
    drawCars(w09_track);

    let w11_track = trackMap.get("W11");
    w11_track.setCars(sampleCars);
    drawCars(w11_track);

    let r01_track = trackMap.get("R01");
    r01_track.setCars(R01);
    drawCars(r01_track);

    // Load trains into the Map
    trainMap.set("Q67119", Q67119);
    trainMap.set("Y22220", Y22220);
    trainMap.set("Q47720", Q47720);
}
