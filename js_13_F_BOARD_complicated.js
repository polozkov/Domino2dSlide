(function f_set_prototype_for_F_BOARD_complicated() {
    //clear board add all dominos
    G.F_BOARD.prototype.f_renew_domino = function (new_dominos_ab) {
        this.board = G.GAME.f_empty_board(this.nxy);
        for (var i = 0; i < 28; i++) {this.f_domino_put(this.dominos_ab[i], i); };
    };

    //add dominos in the start position (permutation, hashtag_or_frame, randomly_rotates_or_not)
    G.F_BOARD.prototype.f_new_perm_28 = function () {
        //random or ordered permutation of numbers 0..27
        var perm = V.is_random_perm ? G.MATH.f_random_perm(28) : G.MATH.f_order_perm(28);
        //standart domino's start positions
        var new_dominos_ab = G.GAME.f_start_position_square_frame();
        
        for (var i = 0; i < 28; i++) {
            //deep replacing of domino's coordinates (by random or ordered perm)
            this.dominos_ab[i].f_replace_ab(new_dominos_ab[perm[i]]);
        };

        this.f_renew_domino(this.dominos_ab);
    };

    //on how many cells can be domino n28 shifted? (all options in output array, for example [-2,-1,1,2,3])
    G.F_BOARD.prototype.f_generate_delta_arr = function (n28) {
        var ab28 = this.dominos_ab[n28]; //current domino area
        var arr_delta_result = [];       //legal shifting moves
    
        var dxy = ab28.f_get_wh(); //domino's orientation, "b" is forward
        var xy_next = ab28.b.f_add(dxy); //next square 'b'
        
        for (var i = 1; this.f_is_inside(xy_next) && !(this.f_occupied_untested(xy_next)); i++) {
            arr_delta_result.push(i);     //add positive integer in my shift array
            xy_next = xy_next.f_add(dxy); //move forward
        };

        dxy = ab28.f_get_wh().f_scale(-1);        //reverse direction
        xy_next = ab28.a.f_add(dxy);  //"a" is forward
        for (var i = -1; this.f_is_inside(xy_next) && !(this.f_occupied_untested(xy_next)); i--) {
            arr_delta_result.push(i);     //add negative number in my track
            xy_next = xy_next.f_add(dxy); //move back (because dxy is reversed)
        };
    
        return arr_delta_result;
    }
    
    //how many neigbours of gotten cell_xy has testing_value
    G.F_BOARD.prototype.f_neigbours_amount_for_cell = function (cell_xy, testing_value) {
        var U_01 = (this.f_get_xy(cell_xy.f_add(G.F_XY.P_U)) === testing_value) ? 1 : 0;
        var R_01 = (this.f_get_xy(cell_xy.f_add(G.F_XY.P_R)) === testing_value) ? 1 : 0;
        var D_01 = (this.f_get_xy(cell_xy.f_add(G.F_XY.P_D)) === testing_value) ? 1 : 0;
        var L_01 = (this.f_get_xy(cell_xy.f_add(G.F_XY.P_L)) === testing_value) ? 1 : 0;
        return U_01 + R_01 + D_01 + L_01;
    };
    
    //how many "contacts" (equal neighbours) has domino number n28: not counting self-contacting
    G.F_BOARD.prototype.f_neigbours_amount_for_domino = function (n28) {
        var na = this.f_neigbours_amount_for_cell(this.dominos_ab[n28].a, G.DOMINO.ARR_SET_28[n28][0]);
        var nb = this.f_neigbours_amount_for_cell(this.dominos_ab[n28].b, G.DOMINO.ARR_SET_28[n28][1]);
        //doubled domino touch itself twice (because domino has 2 equal squares)
        return na + nb - (G.DOMINO.ARR_IS_DOUBLE[n28] * 2);
    };

    //detect, which domino has pressed_cell_nx_ny
    G.F_BOARD.prototype.f_search_domino = function (pressed_cell_nx_ny) {
        for (var i28 = 0; i28 < 28; i28++) {
            if (this.dominos_ab[i28].f_has_cell_inside(pressed_cell_nx_ny)) {
                return i28;
            }
        };
        return G.GAME.EMPTY_DOMINO;
    }
}());