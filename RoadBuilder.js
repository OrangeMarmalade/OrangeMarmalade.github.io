// add each road and add each associated sprite (NPC cars unto the road segments)
// TODO: reset the entire road and put it into an object?
function addRoad(enter, hold, leave, curve, y) {
    var startY   = Util.lastY();
    var endY     = startY + (Util.toInt(y, 0) * segmentLength);
    var n, total = enter + hold + leave;
    for(n = 0 ; n < enter ; n++)
        addSegment(Util.easeIn(0, curve, n/enter), Util.easeInOut(startY, endY, n/total));
    for(n = 0 ; n < hold  ; n++)
        addSegment(curve, Util.easeInOut(startY, endY, (enter+n)/total));
    for(n = 0 ; n < leave ; n++)
        addSegment(Util.easeInOut(curve, 0, n/leave), Util.easeInOut(startY, endY, (enter+hold+n)/total));
}

function addSegment(curve, y) {
    var n = segments.length;
    segments.push({
        index: n,
        p1: { world: { y: Util.lastY(), z:  n   *segmentLength }, camera: {}, screen: {} },
        p2: { world: { y: y,       z: (n+1)*segmentLength }, camera: {}, screen: {} },
        curve: curve,
        sprites: [],
        cars: [],
    	color: Math.floor(n/rumbleLength)%2 ? COLORS.DARK : COLORS.LIGHT
    });
}

function addSprite(n, sprite, offset) {
    segments[n].sprites.push({ source: sprite, offset: offset });
}

function addStraight(num) {
    num = num || ROAD.LENGTH.MEDIUM;
    addRoad(num, num, num, 0, 0);
}
          
function addHill(num, height) {
    num    = num    || ROAD.LENGTH.MEDIUM;
    height = height || ROAD.HILL.MEDIUM;
    addRoad(num, num, num, 0, height);
}
          
function addCurve(num, curve, height) {
    num    = num    || ROAD.LENGTH.MEDIUM;
    curve  = curve  || ROAD.CURVE.MEDIUM;
    height = height || ROAD.HILL.NONE;
    addRoad(num, num, num, curve, height);
}

function addLowRollingHills(num, height) {
    num    = num    || ROAD.LENGTH.SHORT;
    height = height || ROAD.HILL.LOW;
    addRoad(num, num, num,  0,                height/2);
    addRoad(num, num, num,  0,               -height);
    addRoad(num, num, num,  ROAD.CURVE.EASY,  height);
    addRoad(num, num, num,  0,                0);
    addRoad(num, num, num, -ROAD.CURVE.EASY,  height/2);
    addRoad(num, num, num,  0,                0);
}
          
function addSCurves() {
    addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,  -ROAD.CURVE.EASY,    ROAD.HILL.NONE);
    addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,   ROAD.CURVE.MEDIUM,  ROAD.HILL.MEDIUM);
    addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,   ROAD.CURVE.EASY,   -ROAD.HILL.LOW);
    addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,  -ROAD.CURVE.EASY,    ROAD.HILL.MEDIUM);
    addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,  -ROAD.CURVE.MEDIUM, -ROAD.HILL.MEDIUM);
}
          
function addBumps() {
    addRoad(10, 10, 10, 0,  5);
    addRoad(10, 10, 10, 0, -2);
    addRoad(10, 10, 10, 0, -5);
    addRoad(10, 10, 10, 0,  8);
    addRoad(10, 10, 10, 0,  5);
    addRoad(10, 10, 10, 0, -7);
    addRoad(10, 10, 10, 0,  5);
    addRoad(10, 10, 10, 0, -2);
}
          
function addDownhillToEnd(num) {
    num = num || 200;
    addRoad(num, num, num, -ROAD.CURVE.EASY, -Util.lastY()/segmentLength);
}

function resetRoad() {
    segments = [];
          
    addStraight(ROAD.LENGTH.SHORT);
    addSCurves();
    addLowRollingHills();
    addSCurves();
    addCurve(ROAD.LENGTH.MEDIUM, ROAD.CURVE.MEDIUM, ROAD.HILL.LOW);
	addBumps();
    addLowRollingHills();
    addCurve(ROAD.LENGTH.LONG*2, ROAD.CURVE.MEDIUM, ROAD.HILL.MEDIUM);
    addBumps();
    addCurve(ROAD.LENGTH.LONG*2, ROAD.CURVE.MEDIUM, ROAD.HILL.MEDIUM);
    addStraight();
    addHill(ROAD.LENGTH.MEDIUM, ROAD.HILL.HIGH);
    addSCurves();
    addCurve(ROAD.LENGTH.LONG, -ROAD.CURVE.MEDIUM, ROAD.HILL.NONE);
    addHill(ROAD.LENGTH.LONG, ROAD.HILL.HIGH);
    addCurve(ROAD.LENGTH.LONG, ROAD.CURVE.MEDIUM, -ROAD.HILL.LOW);
    addBumps();
    addHill(ROAD.LENGTH.LONG, -ROAD.HILL.MEDIUM);
    addStraight();
    addSCurves();
    addDownhillToEnd();
          
    resetSprites();
    resetCars();
          
    segments[Util.findSegment(playerZ).index + 2].color = COLORS.START;
    segments[Util.findSegment(playerZ).index + 3].color = COLORS.START;
    for(var n = 0 ; n < rumbleLength ; n++)
        segments[segments.length-1-n].color = COLORS.FINISH;
          
    trackLength = segments.length * segmentLength;
}
          
function resetSprites() {
    var n, i;
          
    addSprite(20,  SPRITES.BILLBOARD07, -1);
    addSprite(40,  SPRITES.BILLBOARD06, -1);
    addSprite(60,  SPRITES.BILLBOARD08, -1);
    addSprite(80,  SPRITES.BILLBOARD09, -1);
    addSprite(100, SPRITES.BILLBOARD01, -1);
    addSprite(120, SPRITES.BILLBOARD02, -1);
    addSprite(140, SPRITES.BILLBOARD03, -1);
    addSprite(160, SPRITES.BILLBOARD04, -1);
    addSprite(180, SPRITES.BILLBOARD05, -1);
          
    addSprite(240,                  SPRITES.BILLBOARD07, -1.2);
    addSprite(240,                  SPRITES.BILLBOARD06,  1.2);
    addSprite(segments.length - 25, SPRITES.BILLBOARD07, -1.2);
    addSprite(segments.length - 25, SPRITES.BILLBOARD06,  1.2);
          
    for(n = 10 ; n < 200 ; n += 4 + Math.floor(n/100)) {
        addSprite(n, SPRITES.PALM_TREE, 0.5 + Math.random()*0.5);
        addSprite(n, SPRITES.PALM_TREE,   1 + Math.random()*2);
    }
          
	for(n = 250 ; n < 1000 ; n += 5) {
        addSprite(n,     SPRITES.COLUMN, 1.1);
        addSprite(n + Util.randomInt(0,5), SPRITES.TREE1, -1 - (Math.random() * 2));
        addSprite(n + Util.randomInt(0,5), SPRITES.TREE2, -1 - (Math.random() * 2));
    }
          
    for(n = 200 ; n < segments.length ; n += 3) {
        addSprite(n, Util.randomChoice(SPRITES.PLANTS), Util.randomChoice([1,-1]) * (2 + Math.random() * 5));
    }
          
    var side, sprite, offset;
    for(n = 1000 ; n < (segments.length-50) ; n += 100) {
        side      = Util.randomChoice([1, -1]);
        addSprite(n + Util.randomInt(0, 50), Util.randomChoice(SPRITES.BILLBOARDS), -side);
        for(i = 0 ; i < 20 ; i++) {
            sprite = Util.randomChoice(SPRITES.PLANTS);
            offset = side * (1.5 + Math.random());
            addSprite(n + Util.randomInt(0, 50), sprite, offset);
        }
                    
    }
          
}
          
function resetCars() {
    cars = [];
    var n, car, segment, offset, z, sprite, speed;
    for (var n = 0 ; n < totalCars ; n++) {
        offset = Math.random() * Util.randomChoice([-0.8, 0.8]);
        z      = Math.floor(Math.random() * segments.length) * segmentLength;
        sprite = Util.randomChoice(SPRITES.CARS);
        speed  = maxSpeed/4 + Math.random() * maxSpeed/(sprite == SPRITES.SEMI ? 4 : 2);
        car = { offset: offset, z: z, sprite: sprite, speed: speed };
        segment = Util.findSegment(car.z);
        segment.cars.push(car);
        cars.push(car);
    }
}

