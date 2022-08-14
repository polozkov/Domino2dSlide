//my main game board
G.main_board = new G.F_BOARD(new G.F_XY(11, 11));

//new permutation of dominox (maybe MIXED, maybe randomly ROTATED, and may be in HASHTAG)
G.main_board.f_new_perm_28();

G.SEL = {
    f_no_selection: function () {
        //so, we calculate hints_ab, hints_xy and m_arrows
        return {
            sel_hints_ab: [], //hints (ellipses)
            sel_hints_xy: [], //hints (squares vith arrows for selected domino)
            sel_m_arrows: G.main_board.f_generate_moves_foreach(),

            last_cell_xy: null,
            mode: "MODE_MOVE_BEGIN",

            sel_dominos: G.main_board.f_generate_active_dominos_indexes(),
            sel_cells_winning_colorising: G.main_board.f_return_winning_or_empty_cells_arr()

        }
    },

    f_select_nxy: function (cell_nx_ny) {
        var sel = G.SEL.f_no_selection();
        var n28_domino = G.main_board.f_search_domino(cell_nx_ny);
        //You do not select any domino
        if (n28_domino == G.GAME.EMPTY_DOMINO) { return sel };

        //moves with n28_domino
        var arr_moves = G.main_board.f_generate_moves_for_n28(n28_domino);

        function f_hint_xy(i) { return arr_moves[i].f_get_hint_square_cell().f_get_arr_01(); };
        function f_hint_ab(i) { return arr_moves[i].ab_new; };

        //if clicked domino that has now moves, do nothing
        if (arr_moves.length > 0) {
            sel.sel_hints_xy = G.MATH.f_gen_array_by_function(arr_moves.length, f_hint_xy);
            sel.sel_hints_ab = G.MATH.f_gen_array_by_function(arr_moves.length, f_hint_ab);
            sel.sel_m_arrows = G.main_board.f_generate_moves_for_n28(n28_domino);
        };

        sel.mode = "MODE_MOVE_END";

        return sel;
    }
};

G.SEL.f_set_null = function () {G.SEL.OBJ = G.SEL.f_no_selection(); };
G.SEL.f_set_null();