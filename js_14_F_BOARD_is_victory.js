//result will be from 1 to 28: result is amount of dominos,
//...that belong to the union with zero-zero domino 
G.F_BOARD.prototype.f_union_n_members = function () {
    //how many dominos are tested (including zero-zero domino)
    var n_tested = 1;
    var dominos = this.dominos_ab;
    var arr_with_27_zeros = G.MATH.f_gen_array_by_function(28, function (n) { return (n == 0); });

    (function f_recursive_connect(union_28_bits, testing_list) {
        var new_testing_list = [];
        for (var i_test = 0; i_test < testing_list.length; i_test++) {
            for (var i_28 = 0; i_28 < 28; i_28++) {
                //check, that testing domino is not in union
                if (!(union_28_bits[i_28])) {
                    //dominos i_28 and i_test are neighbours (contact by common border)
                    if (dominos[i_28].f_contact_ab(dominos[testing_list[i_test]])) {
                        //add in my union
                        union_28_bits[i_28] = true;
                        //tests for the next recursive step
                        new_testing_list.push(i_28);
                        //increase size of the union
                        n_tested++;
                    }
                }
            }
        }
        //no new test: we tested all union
        if (new_testing_list.length == 0) { return; }

        //with changed union and totally new_tests (wave spread)
        f_recursive_connect(union_28_bits, new_testing_list.slice());

        //self-calling function with [start true and next 27 false] and wave as one ZERO-ZERO domino
    }(arr_with_27_zeros, [0]));

    return n_tested;
}

//after testing union, check that no diagonals of 2 by 2 sub squares
G.F_BOARD.prototype.f_is_victory = function () {
    var n_sub_squares = 0;
    var n_borders = 0;

    //test each subsquare, so start from cell 1,1
    for (var ix = 1; ix < this.nxy.x; ix++) {
        for (var iy = 1; iy < this.nxy.y; iy++) {
            //false - empty, true - occupied
            var b_00 = (this.f_get_nx_ny(ix - 1, iy - 1) !== G.GAME.EMPTY_CELL);
            var b_01 = (this.f_get_nx_ny(ix - 1, iy) !== G.GAME.EMPTY_CELL);
            var b_10 = (this.f_get_nx_ny(ix, iy - 1) !== G.GAME.EMPTY_CELL);
            var b_11 = (this.f_get_nx_ny(ix, iy) !== G.GAME.EMPTY_CELL);
            
            //there are two diagonals:
            if ((b_00 == b_11) && (b_01 == b_10)) {
                //diagonals are unequal, like on chess board, no victory
                if (b_00 != b_01) {return false; }
                //calculate if all 4 cells are OCCUPIED
                n_sub_squares += ((b_00 && b_01) ? 1 : 0);
            }
        }
    }

    //calculate amount of borders for_each cells (contact will be calculated twice)
    for (ixy = new G.F_XY(0, 0); ixy.x < this.nxy.x; ixy.x++) {
        for (ixy.y = 0; ixy.y < this.nxy.y; ixy.y++) {
            //only occupied cells can have contact
            if (this.f_occupied_untested(ixy)) {
                //check all 4 directions URDL: Up, Right, Down, Left
                n_borders += this.f_occupied_tested(G.F_XY.P_U.f_add(ixy));
                n_borders += this.f_occupied_tested(G.F_XY.P_R.f_add(ixy));
                n_borders += this.f_occupied_tested(G.F_XY.P_D.f_add(ixy));
                n_borders += this.f_occupied_tested(G.F_XY.P_L.f_add(ixy));
            }
        }
    }

    //for union zone without hole BORDERS-CELLS-SubSQUARES equal to -1
    var n_zones = (n_borders / 2) - n_sub_squares - 28 * 2;

    //if (this.f_union_n_members() == 28) {console.log('borders, sub22, zones', n_borders, n_sub_squares, n_zones)}
    return ((n_zones == (-1)) && (this.f_union_n_members() == 28));
};

//arrray of showing (colorizing) cells for winning, for example [[0,0, [0,1], ...[nx-1,ny-1]]]
G.F_BOARD.prototype.f_return_winning_or_empty_cells_arr = function () {
    var arr_marked = [];

    //try to select for highlighting cell (ix, iy)
    function f_try_push(ix, iy, is_game_over) {
        if (is_game_over) {arr_marked.push([ix, iy]);}
    }

    for (var ix = 0; ix < this.nxy.x; ix++) {
        for (var iy = 0; iy < this.nxy.y; iy++) { 
            f_try_push(ix, iy, this.f_is_victory());
        }
    }

    return arr_marked;
};
