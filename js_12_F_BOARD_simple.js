//constructor: .nxy (sizes), .board(array [nxy.x * nxy.y] of cells) and .dominos_ab
G.F_BOARD = function (obj_xy) {
    //board_sizes
    this.nxy = new G.F_XY(obj_xy.x, obj_xy.y);

    //matrix of 0..6 of EMPTY_CELL
    this.board = G.GAME.f_empty_board(this.nxy);

    //28 domino positions (coordinates of neighboring semi_squares: ax,ay; bx,by)
    this.dominos_ab = G.MATH.f_gen_array_by_function(
        //firstly domino's positions are undefined
        28, function (i) { return G.F_AB.f_by_m22([[0, 0], [0, 1]]); }
    );
};

(function f_set_prototype_for_F_BOARD_easy() {
    //is (x,y) on board? or outside the border? (by Object_xy)
    G.F_BOARD.prototype.f_is_inside = function (obj_xy) {
        return ((0 <= obj_xy.x) && (obj_xy.x < this.nxy.x) && (0 <= obj_xy.y) && (obj_xy.y < this.nxy.y));
    };

    //is both: ab.a and ab.b inside board
    G.F_BOARD.prototype.f_is_ab_inside = function (ab) {
        return (this.f_is_inside(ab.a) && this.f_is_inside(ab.b));
    };

    //NO_INSIDDE_TESTING return object cell (x,y) xy must be on board by 2 integer numbers
    G.F_BOARD.prototype.f_get_nx_ny = function (nx, ny) { return this.board[nx + ny * this.nxy.x]; };
    //WITH_TESTING_IS_INSIDE return object cell (x,y) or empty_cell by Object_xy
    G.F_BOARD.prototype.f_get_xy = function (xy) {
        return ((this.f_is_inside(xy)) ? this.f_get_nx_ny(xy.x, xy.y) : G.GAME.EMPTY_CELL);
    };

    //return owner (domino's number from 0 to 27) or G.GAME.EMPTY_DOMINO
    G.F_BOARD.prototype.f_get_domino_index = function (cell_xy) {
        for (var i28 = 0; i28 < 28; i28++) {
            if (this.dominos_ab[i28].f_has_cell_inside(cell_xy)) {
                return i28;
            }
        }
        return G.GAME.EMPTY_DOMINO;
    };

    //check, ab.a and ab.b are on the same domino 
    G.F_BOARD.prototype.f_is_it_domino_area = function (ab) {
        var na = this.f_get_domino_index(ab.a);
        var nb = this.f_get_domino_index(ab.b); 
        return ((na == nb) && (na != G.GAME.EMPTY_DOMINO));
    };

    //NO_INSIDDE_TEST_ING is this cell empty by Object_xy
    G.F_BOARD.prototype.f_occupied_untested = function (xy) {
        return (this.f_get_nx_ny(xy.x, xy.y) == G.GAME.EMPTY_CELL) ? 0 : 1;
    };
    //WITH_INSIDDE_TEST_ING is this cell empty by Object_xy
    G.F_BOARD.prototype.f_occupied_tested = function (xy) {
        return this.f_is_inside(xy) ? this.f_occupied_untested(xy) : 0;
    };

    //rewrite object cell (x, y) by new value of gotten obj_cell
    G.F_BOARD.prototype.f_set_xy = function (xy, value_cell) {
        this.board[xy.x + xy.y * this.nxy.x] = value_cell;
    };

    //put domino with index n28 on the cells: new_ab.a and new_ab.b
    G.F_BOARD.prototype.f_domino_put = function (new_ab, n28) {
        this.f_set_xy(new_ab.a, G.DOMINO.ARR_SET_28[n28][0]);
        this.f_set_xy(new_ab.b, G.DOMINO.ARR_SET_28[n28][1]);
    };

    //make board empty from domino
    G.F_BOARD.prototype.f_domino_remove = function (new_ab) {
        this.f_set_xy(new_ab.a, G.GAME.EMPTY_CELL);
        this.f_set_xy(new_ab.b, G.GAME.EMPTY_CELL);
    };
}());