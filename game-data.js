const WORLD = [{"worldRow":0,"worldCol":0,"pieces":[{"typ":"token","row":8,"col":15},{"typ":"token","row":15,"col":8},{"typ":"trap","row":0,"col":0},{"typ":"trap","row":0,"col":15},{"typ":"trap","row":1,"col":0},{"typ":"trap","row":1,"col":15},{"typ":"trap","row":2,"col":0},{"typ":"trap","row":2,"col":15},{"typ":"trap","row":3,"col":0},{"typ":"trap","row":3,"col":15},{"typ":"trap","row":4,"col":0},{"typ":"trap","row":4,"col":15},{"typ":"trap","row":5,"col":0},{"typ":"trap","row":5,"col":15},{"typ":"trap","row":6,"col":0},{"typ":"trap","row":6,"col":15},{"typ":"trap","row":7,"col":0},{"typ":"trap","row":7,"col":15},{"typ":"trap","row":8,"col":0},{"typ":"trap","row":9,"col":0},{"typ":"trap","row":9,"col":15},{"typ":"trap","row":10,"col":0},{"typ":"trap","row":10,"col":15},{"typ":"trap","row":11,"col":0},{"typ":"trap","row":11,"col":15},{"typ":"trap","row":12,"col":0},{"typ":"trap","row":12,"col":15},{"typ":"trap","row":13,"col":0},{"typ":"trap","row":13,"col":15},{"typ":"trap","row":14,"col":0},{"typ":"trap","row":14,"col":15},{"typ":"trap","row":15,"col":0},{"typ":"trap","row":15,"col":15},{"typ":"trap","row":0,"col":1},{"typ":"trap","row":15,"col":1},{"typ":"trap","row":0,"col":2},{"typ":"trap","row":15,"col":2},{"typ":"trap","row":0,"col":3},{"typ":"trap","row":15,"col":3},{"typ":"trap","row":0,"col":4},{"typ":"trap","row":15,"col":4},{"typ":"trap","row":0,"col":5},{"typ":"trap","row":15,"col":5},{"typ":"trap","row":0,"col":6},{"typ":"trap","row":15,"col":6},{"typ":"trap","row":0,"col":7},{"typ":"trap","row":15,"col":7},{"typ":"trap","row":0,"col":8},{"typ":"trap","row":0,"col":9},{"typ":"trap","row":15,"col":9},{"typ":"trap","row":0,"col":10},{"typ":"trap","row":15,"col":10},{"typ":"trap","row":0,"col":11},{"typ":"trap","row":15,"col":11},{"typ":"trap","row":0,"col":12},{"typ":"trap","row":15,"col":12},{"typ":"trap","row":0,"col":13},{"typ":"trap","row":15,"col":13},{"typ":"trap","row":0,"col":14},{"typ":"trap","row":15,"col":14},{"typ":"spawn","row":8,"col":8}]},{"worldRow":0,"worldCol":1,"pieces":[{"typ":"token","row":8,"col":0},{"typ":"token","row":10,"col":15},{"typ":"token","row":15,"col":9},{"typ":"trap","row":0,"col":0},{"typ":"trap","row":0,"col":15},{"typ":"trap","row":1,"col":0},{"typ":"trap","row":1,"col":15},{"typ":"trap","row":2,"col":0},{"typ":"trap","row":2,"col":15},{"typ":"trap","row":3,"col":0},{"typ":"trap","row":3,"col":15},{"typ":"trap","row":4,"col":0},{"typ":"trap","row":4,"col":15},{"typ":"trap","row":5,"col":0},{"typ":"trap","row":5,"col":15},{"typ":"trap","row":6,"col":0},{"typ":"trap","row":6,"col":15},{"typ":"trap","row":7,"col":0},{"typ":"trap","row":7,"col":15},{"typ":"trap","row":8,"col":15},{"typ":"trap","row":9,"col":0},{"typ":"trap","row":9,"col":15},{"typ":"trap","row":10,"col":0},{"typ":"trap","row":11,"col":0},{"typ":"trap","row":11,"col":15},{"typ":"trap","row":12,"col":0},{"typ":"trap","row":12,"col":15},{"typ":"trap","row":13,"col":0},{"typ":"trap","row":13,"col":15},{"typ":"trap","row":14,"col":0},{"typ":"trap","row":14,"col":15},{"typ":"trap","row":15,"col":0},{"typ":"trap","row":15,"col":15},{"typ":"trap","row":0,"col":1},{"typ":"trap","row":15,"col":1},{"typ":"trap","row":0,"col":2},{"typ":"trap","row":15,"col":2},{"typ":"trap","row":0,"col":3},{"typ":"trap","row":15,"col":3},{"typ":"trap","row":0,"col":4},{"typ":"trap","row":15,"col":4},{"typ":"trap","row":0,"col":5},{"typ":"trap","row":15,"col":5},{"typ":"trap","row":0,"col":6},{"typ":"trap","row":15,"col":6},{"typ":"trap","row":0,"col":7},{"typ":"trap","row":15,"col":7},{"typ":"trap","row":0,"col":8},{"typ":"trap","row":15,"col":8},{"typ":"trap","row":0,"col":9},{"typ":"trap","row":0,"col":10},{"typ":"trap","row":15,"col":10},{"typ":"trap","row":0,"col":11},{"typ":"trap","row":15,"col":11},{"typ":"trap","row":0,"col":12},{"typ":"trap","row":15,"col":12},{"typ":"trap","row":0,"col":13},{"typ":"trap","row":15,"col":13},{"typ":"trap","row":0,"col":14},{"typ":"trap","row":15,"col":14},{"typ":"spawn","row":8,"col":8}]}];
//const WORLD = [{"worldRow":0,"worldCol":0,"pieces":[{"typ":"token","row":8,"col":15},{"typ":"token","row":15,"col":8},{"typ":"trap","row":0,"col":0},{"typ":"trap","row":0,"col":15},{"typ":"trap","row":1,"col":0},{"typ":"trap","row":1,"col":15},{"typ":"trap","row":2,"col":0},{"typ":"trap","row":2,"col":15},{"typ":"trap","row":3,"col":0},{"typ":"trap","row":3,"col":15},{"typ":"trap","row":4,"col":0},{"typ":"trap","row":4,"col":15},{"typ":"trap","row":5,"col":0},{"typ":"trap","row":5,"col":15},{"typ":"trap","row":6,"col":0},{"typ":"trap","row":6,"col":15},{"typ":"trap","row":7,"col":0},{"typ":"trap","row":7,"col":15},{"typ":"trap","row":8,"col":0},{"typ":"trap","row":9,"col":0},{"typ":"trap","row":9,"col":15},{"typ":"trap","row":10,"col":0},{"typ":"trap","row":10,"col":15},{"typ":"trap","row":11,"col":0},{"typ":"trap","row":11,"col":15},{"typ":"trap","row":12,"col":0},{"typ":"trap","row":12,"col":15},{"typ":"trap","row":13,"col":0},{"typ":"trap","row":13,"col":15},{"typ":"trap","row":14,"col":0},{"typ":"trap","row":14,"col":15},{"typ":"trap","row":15,"col":0},{"typ":"trap","row":15,"col":15},{"typ":"trap","row":0,"col":1},{"typ":"trap","row":15,"col":1},{"typ":"trap","row":0,"col":2},{"typ":"trap","row":15,"col":2},{"typ":"trap","row":0,"col":3},{"typ":"trap","row":15,"col":3},{"typ":"trap","row":0,"col":4},{"typ":"trap","row":15,"col":4},{"typ":"trap","row":0,"col":5},{"typ":"trap","row":15,"col":5},{"typ":"trap","row":0,"col":6},{"typ":"trap","row":15,"col":6},{"typ":"trap","row":0,"col":7},{"typ":"trap","row":15,"col":7},{"typ":"trap","row":0,"col":8},{"typ":"trap","row":0,"col":9},{"typ":"trap","row":15,"col":9},{"typ":"trap","row":0,"col":10},{"typ":"trap","row":15,"col":10},{"typ":"trap","row":0,"col":11},{"typ":"trap","row":15,"col":11},{"typ":"trap","row":0,"col":12},{"typ":"trap","row":15,"col":12},{"typ":"trap","row":0,"col":13},{"typ":"trap","row":15,"col":13},{"typ":"trap","row":0,"col":14},{"typ":"trap","row":15,"col":14},{"typ":"spawn","row":2,"col":3}]},{"worldRow":0,"worldCol":1,"pieces":[{"typ":"token","row":8,"col":0},{"typ":"token","row":10,"col":15},{"typ":"token","row":15,"col":9},{"typ":"trap","row":0,"col":0},{"typ":"trap","row":0,"col":15},{"typ":"trap","row":1,"col":0},{"typ":"trap","row":1,"col":15},{"typ":"trap","row":2,"col":0},{"typ":"trap","row":2,"col":15},{"typ":"trap","row":3,"col":0},{"typ":"trap","row":3,"col":15},{"typ":"trap","row":4,"col":0},{"typ":"trap","row":4,"col":15},{"typ":"trap","row":5,"col":0},{"typ":"trap","row":5,"col":15},{"typ":"trap","row":6,"col":0},{"typ":"trap","row":6,"col":15},{"typ":"trap","row":7,"col":0},{"typ":"trap","row":7,"col":15},{"typ":"trap","row":8,"col":15},{"typ":"trap","row":9,"col":0},{"typ":"trap","row":9,"col":15},{"typ":"trap","row":10,"col":0},{"typ":"trap","row":11,"col":0},{"typ":"trap","row":11,"col":15},{"typ":"trap","row":12,"col":0},{"typ":"trap","row":12,"col":15},{"typ":"trap","row":13,"col":0},{"typ":"trap","row":13,"col":15},{"typ":"trap","row":14,"col":0},{"typ":"trap","row":14,"col":15},{"typ":"trap","row":15,"col":0},{"typ":"trap","row":15,"col":15},{"typ":"trap","row":0,"col":1},{"typ":"trap","row":15,"col":1},{"typ":"trap","row":0,"col":2},{"typ":"trap","row":15,"col":2},{"typ":"trap","row":0,"col":3},{"typ":"trap","row":15,"col":3},{"typ":"trap","row":0,"col":4},{"typ":"trap","row":15,"col":4},{"typ":"trap","row":0,"col":5},{"typ":"trap","row":15,"col":5},{"typ":"trap","row":0,"col":6},{"typ":"trap","row":15,"col":6},{"typ":"trap","row":0,"col":7},{"typ":"trap","row":15,"col":7},{"typ":"trap","row":0,"col":8},{"typ":"trap","row":15,"col":8},{"typ":"trap","row":0,"col":9},{"typ":"trap","row":0,"col":10},{"typ":"trap","row":15,"col":10},{"typ":"trap","row":0,"col":11},{"typ":"trap","row":15,"col":11},{"typ":"trap","row":0,"col":12},{"typ":"trap","row":15,"col":12},{"typ":"trap","row":0,"col":13},{"typ":"trap","row":15,"col":13},{"typ":"trap","row":0,"col":14},{"typ":"trap","row":15,"col":14},{"typ":"spawn","row":8,"col":8}]}];