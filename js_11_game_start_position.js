G.GAME = {
    //no domino selected
    EMPTY_DOMINO: -2,

    //cell without domino
    EMPTY_CELL: -1,

    //temporary unique constantc for deleting/putting process
    EMPTY_TEMP_0: -2, EMPTY_TEMP_1: -3,

    //board with no dominos, each cell has value EMPTY_CELL
    f_empty_board: function (obj_nxy) {
        return G.MATH.f_gen_array_by_function(obj_nxy.x * obj_nxy.y, function (i) { return G.GAME.EMPTY_CELL; });
    },

    //transfer frame to hashtag (it is the other start position) 
    f_start_position_hashtag_from_frame: function (changing_arr_ab) {
        var shift_URDL = [[0, 2], [-2, 0], [0, -2], [2, 0]];
        for (var iDIR = 0; iDIR <= 3; iDIR++) {
            var obj_dxy = G.F_XY.f_by_arr(shift_URDL[iDIR]);
            for (var i234 = 2; i234 <= 4; i234++) {
                changing_arr_ab[iDIR * 7 + i234] = changing_arr_ab[iDIR * 7 + i234].f_op_add(obj_dxy);
            }
        }
    },

    //easy_frame or "hashtag" standart debut position for solving 
    f_start_position_square_frame: function () {
        var arr_ab = [];
        //all 28  start dominos positions for the "frame" debut
        for (var j = 0; j < 7; j++) { arr_ab[j] = G.F_AB.f_by_m22([[2 + j, 0], [2 + j, 1]]); };
        for (var j = 0; j < 7; j++) { arr_ab[j + 7] = G.F_AB.f_by_m22([[10, 2 + j], [9, 2 + j]]); };
        for (var j = 0; j < 7; j++) { arr_ab[j + 14] = G.F_AB.f_by_m22([[2 + j, 10], [2 + j, 9]]); };
        for (var j = 0; j < 7; j++) { arr_ab[j + 21] = G.F_AB.f_by_m22([[0, 2 + j], [1, 2 + j]]); };

        //rotated all dominos randomly on 180 degrees
        if (V.is_random_rotations) {
            for (var i = 0; i < 28; i++) { if (Math.random() < 0.5) { arr_ab[i].f_swap_me() }; };
        }

        //shift 3*4 dominos to the center to make "hashtag" debut position
        if (V.is_hashtag_form) {
            G.GAME.f_start_position_hashtag_from_frame(arr_ab);
        }

        return arr_ab;
    }
};


