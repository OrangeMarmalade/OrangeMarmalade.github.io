﻿// global variables for game states and game display options
// includes asset location allocation and such as well

fps = 60;
step = 1/fps;
width = 1024;
height = 768;
centrifugal = 0.3;
offRoadDecel = 0.99;
skySpeed = 0.001;
hillSpeed = 0.002;
treeSpeed = 0.003;
skyOffset = 0;
hillOffset = 0;
treeOffset = 0;
segments = [];
cars = [];
canvas = Dom.get('canvas');
ctx = canvas.getContext('2d');
background = null;
sprites = null;
resolution = height/480;
roadWidth = 2000;
segmentLength = 200;
rumbleLength = 3;
trackLength = null;
lanes = 3;
fieldOfView = 100;
cameraHeight = 1000;
cameraDepth = 1 / Math.tan((fieldOfView/2) * Math.PI/180);
drawDistance = 300;
playerX = 0;
playerZ = (cameraHeight * cameraDepth);
fogDensity = 5;
position = 0;
speed = 0;
maxSpeed = segmentLength/step;
accel = maxSpeed/5;
braking = -maxSpeed;
decel = -maxSpeed/5;
offRoadDecel = -maxSpeed/2;
offRoadLimit = maxSpeed/4;
totalCars = 200;
keyLeft = false;
keyRight = false;
keyFaster = false;
keySlower = false;


KEY = {
  	LEFT:  37,
  	UP:    38,
  	RIGHT: 39,
  	DOWN:  40,
  	A:     65,
  	D:     68,
  	S:     83,
  	W:     87
};

COLORS = {
    SKY: '#72D7EE',
    TREE: '#005108',
    FOG: '#005108',
    LIGHT: { road: '#6B6B6B', grass: '#10AA10', rumble: '#555555', lane: '#CCCCCC'},
    DARK: { road: '#696969', grass: '#009A00', rumble: '#BBBBBB'},
    START: { road: 'white',   grass: 'white',   rumble: 'white'},
    FINISH: { road: 'black',   grass: 'black',   rumble: 'black'}
};

BACKGROUND = {
    HILLS: { x: 5, y: 5, w: 1280, h: 480 },
    SKY: { x: 5, y: 495, w: 1280, h: 480 },
    TREES: { x: 5, y: 985, w: 1280, h: 480 }
};

SPRITES = {
    BILLBOARD01:            { x:  625, y:  375, w:  300, h:  170 },
    BILLBOARD02:            { x:  245, y: 1262, w:  215, h:  220 },
    BILLBOARD03:            { x:    5, y: 1262, w:  230, h:  220 },
    BILLBOARD04:            { x: 1205, y:  310, w:  268, h:  170 },
    BILLBOARD05:            { x:    5, y:  897, w:  298, h:  190 },
    BILLBOARD06:            { x:  488, y:  555, w:  298, h:  190 },
    BILLBOARD07:            { x:  313, y:  897, w:  298, h:  190 },
    BILLBOARD08:            { x:  230, y:    5, w:  385, h:  265 },
    BILLBOARD09:            { x:  150, y:  555, w:  328, h:  282 },

    BOULDER1:               { x: 1205, y:  760, w:  168, h:  248 },
    BOULDER2:               { x:  621, y:  897, w:  298, h:  140 },
    BOULDER3:               { x:  230, y:  280, w:  320, h:  220 },

    BUSH1:                  { x:    5, y: 1097, w:  240, h:  155 },
    BUSH2:                  { x:  255, y: 1097, w:  232, h:  152 },

    CACTUS:                 { x:  929, y:  897, w:  235, h:  118 },

    CAR01:                  { x: 1205, y: 1018, w:   80, h:   56 },
    CAR02:                  { x: 1383, y:  825, w:   80, h:   59 },
    CAR03:                  { x: 1383, y:  760, w:   88, h:   55 },
    CAR04:                  { x: 1383, y:  894, w:   80, h:   57 },

    COLUMN:                 { x:  995, y:    5, w:  200, h:  315 },

    DEAD_TREE1:             { x:    5, y:  555, w:  135, h:  332 },
    DEAD_TREE2:             { x: 1205, y:  490, w:  150, h:  260 },

    TREE1:                  { x:  625, y:    5, w:  360, h:  360 },
    TREE2:                  { x: 1205, y:    5, w:  282, h:  295 },

    TRUCK:                  { x: 1365, y:  644, w:  100, h:   78 },
    STUMP:                  { x:  995, y:  330, w:  195, h:  140 },
    SEMI:                   { x: 1365, y:  490, w:  122, h:  144 },
    
    PALM_TREE: { x:    5, y:    5, w:  215, h:  540 },

    PLAYER_UPHILL_LEFT:     { x: 1383, y:  961, w:   80, h:   45 },
    PLAYER_UPHILL_STRAIGHT: { x: 1295, y: 1018, w:   80, h:   45 },
    PLAYER_UPHILL_RIGHT:    { x: 1385, y: 1018, w:   80, h:   45 },
    PLAYER_LEFT:            { x:  995, y:  480, w:   80, h:   41 },
    PLAYER_STRAIGHT:        { x: 1085, y:  480, w:   80, h:   41 },
    PLAYER_RIGHT:           { x:  995, y:  531, w:   80, h:   41 }
};

ROAD = {
  LENGTH: { NONE: 0, SHORT:  25, MEDIUM:   50, LONG:  100 },
  HILL:   { NONE: 0, LOW:    20, MEDIUM:   40, HIGH:   60 },
  CURVE:  { NONE: 0, EASY:    2, MEDIUM:    4, HARD:    6 }
};

SPRITES.SCALE = 0.3 * (1/SPRITES.PLAYER_STRAIGHT.w) 
SPRITES.BILLBOARDS = [SPRITES.BILLBOARD01, SPRITES.BILLBOARD02, SPRITES.BILLBOARD03, SPRITES.BILLBOARD04, SPRITES.BILLBOARD05, SPRITES.BILLBOARD06, SPRITES.BILLBOARD07, SPRITES.BILLBOARD08, SPRITES.BILLBOARD09];
SPRITES.PLANTS     = [SPRITES.TREE1, SPRITES.TREE2, SPRITES.DEAD_TREE1, SPRITES.DEAD_TREE2, SPRITES.PALM_TREE, SPRITES.BUSH1, SPRITES.BUSH2, SPRITES.CACTUS, SPRITES.STUMP, SPRITES.BOULDER1, SPRITES.BOULDER2, SPRITES.BOULDER3];
SPRITES.CARS       = [SPRITES.CAR01, SPRITES.CAR02, SPRITES.CAR03, SPRITES.CAR04, SPRITES.SEMI, SPRITES.TRUCK];

