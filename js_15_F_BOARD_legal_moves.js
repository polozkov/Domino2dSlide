(function f_create_F_MOVE_with_prototype() {
    //constructor for replacing domino
    G.F_MOVE = function (gotten_n28, gotten_ab_old, gotten_ab_new) {
        this.n28 = gotten_n28;
        this.ab_old = gotten_ab_old.f_op_copy();
        this.ab_new = gotten_ab_new.f_op_copy();
    };

    //constructor by n_delta (domino shifting)
    G.F_MOVE.f_by_delta = function (n28, ab_old, n_delta) {
        var dxy = ab_old.f_get_wh().f_scale(n_delta);
        var ab_new = ab_old.f_op_add(dxy);

        return new G.F_MOVE(n28, ab_old, ab_new);
    };

    //order is (A,B; newA,newB)=false  or (B,A; newB,newA)=true
    G.F_MOVE.prototype.f_is_on_domino_direction = function () {
        var xy_delta = this.ab_new.a.f_sub(this.ab_old.a);
        var xy_domino = this.ab_old.f_get_wh();

        //multiply for checking co-directional
        var xy_mult = xy_delta.f_mult(xy_domino);

        return ((xy_mult.x < 0) || (xy_mult.y < 0));
    };

    //hint belong to the ab_new, choice "a" or "b" depends of move's co-directional
    G.F_MOVE.prototype.f_get_hint_square_cell = function () {
        var a_or_b = ((this.f_is_on_domino_direction()) ? 'a' : 'b');
        return this.ab_new[a_or_b];
    };

    //create move by calculating new_ab.b
    G.F_MOVE.f_by_new_cell = function (get_n28, get_ab_old, get_xy_new_cell) {
        var m = new G.F_MOVE(get_n28, get_ab_old, G.F_AB.f_by_two_equal(get_xy_new_cell));
        var wh = m.ab_old.f_get_wh();

        //example for delta=2:
        //order (A,B; newA,_newB_) is do nothing, just make newA shifted
        m.ab_new.a = m.ab_new.b.f_sub(wh);

        //order (B,A; newB,_newA_)=true
        if (m.f_is_on_domino_direction()) {
            m.ab_new = m.ab_new.f_op_add(wh);
        }
        return m;
    };

    //deep compare of 2 moves
    G.F_MOVE.prototype.f_compare = function (m) {
        return (this.n28 === m.n28) && (this.ab_new.f_op_equal(m.ab_new) && (this.ab_old.f_op_equal(m.ab_old)));
    };

    //return start and final ARROW POINTS in pre-coordinates for zero_cell
    G.F_MOVE.prototype.f_calculate_arrow_ab = function () {
        //add half to make square center
        var new_center_a = this.ab_new.a.f_add(G.F_XY.P_HALF);
        var new_center_b = this.ab_new.b.f_add(G.F_XY.P_HALF);
        var new_middle_where_start = new_center_a.f_add(new_center_b).f_scale(0.5);

        //arrow depends on co-directional move and a,b (check, that "a" is forward)
        var new_end = this.f_is_on_domino_direction() ? new_center_a : new_center_b;
        
        return new G.F_AB(new_middle_where_start, new_end);
    };
}());

//this obgect of board do gottem move m
G.F_BOARD.prototype.f_do_move = function (m) {
    this.f_domino_remove(m.ab_old);
    this.f_domino_put(m.ab_new, m.n28);
    this.dominos_ab[m.n28].f_replace_ab(m.ab_new);
};

//this obgect of board undo gottem move m
G.F_BOARD.prototype.f_undo_move = function (m) {
    this.f_domino_remove(m.ab_new);
    this.f_domino_put(m.ab_old, m.n28);
    this.dominos_ab[m.n28].f_replace_ab(m.ab_old);
};

//array of all legal moves by domino n28 (with contacts)
G.F_BOARD.prototype.f_generate_moves_for_n28 = function (n28) {
    //free shifting (array of non zero integer)
    var arr_delta = this.f_generate_delta_arr(n28);
    //start_domino
    var ab_from = this.dominos_ab[n28];
    var arr_moves = [];

    for (var i_move = 0; i_move < arr_delta.length; i_move++) {
        //checking move by number, equal to arr_delta[i_move]
        var i_obj_move = G.F_MOVE.f_by_delta(n28, ab_from, arr_delta[i_move]);

        this.f_do_move(i_obj_move);
        //if I have al least one legal slide, add checking move in the arr_move
        if (this.f_neigbours_amount_for_domino(n28) > 0) {
            arr_moves.push(i_obj_move);
        }
        this.f_undo_move(i_obj_move);
    }

    return arr_moves;
};

//array of all moves (for_each of 28 dominos)
G.F_BOARD.prototype.f_generate_moves_foreach = function () {
    var arr_foreach = [];
    for (var i28 = 0; i28 < 28; i28++) {
        var arr_i28 = this.f_generate_moves_for_n28(i28);
        for (var j = 0; j < arr_i28.length; j++) {
            arr_foreach.push(arr_i28[j]);
        }
    }
    return arr_foreach;
};

//domino's indexses, that can be moved
G.F_BOARD.prototype.f_generate_active_dominos_indexes = function () {
    var arr_indexes = [];
    for (var n28 = 0; n28 < 28; n28++) {
        if (this.f_generate_moves_for_n28(n28).length > 0) {
            arr_indexes.push(n28);
        }
    }
    return arr_indexes;
};


