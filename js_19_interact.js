//array of all moves, that you make
G.main_moves = [];

//interact with user: events, moves, buttons
G.INTERACT = {
    //undo moves, detect move, begin and end move by mouse clicking
    MOVE: {
        //undo only last or all moves
        UNDO: {
            //undo last move (if array of main_moves not empty)
            f_last: function () {
                if (G.main_moves.length == 0) { return; }
                G.main_board.f_undo_move(G.main_moves[G.main_moves.length - 1]);
                G.main_moves.pop();
            },

            //undo all moves to restart current game
            f_all: function () {
                while (G.main_moves.length > 0) { G.INTERACT.MOVE.UNDO.f_last(); }
            },
        },

        //detect one move from_xy to_xy or null, if there is no moves
        f_detect: function (from_xy, to_xy) {
            if ((from_xy == null) || (to_xy == null)) { return null; };

            //no dominos from
            var from_n28 = G.main_board.f_search_domino(from_xy);
            if (from_xy == G.GAME.EMPTY_DOMINO) { return null; };

            //all moves from start domino
            var moves_from = G.main_board.f_generate_moves_for_n28(from_n28);
            if (moves_from.length == 0) { return null; };

            //you can find not more then 2 moves
            var one_or_two_moves = [];

            for (var i = 0; i < moves_from.length; i++) {
                //new domino's position has cell to_xy inside
                if (moves_from[i].ab_new.f_has_cell_inside(to_xy)) {
                    one_or_two_moves.push(moves_from[i]);
                }
            };

            if (one_or_two_moves.length == 0) { return null; };
            if (one_or_two_moves.length == 1) { return one_or_two_moves[0]; };

            //so length = 2, two moves are on the one cell, detect nearest move
            var d0 = one_or_two_moves[0].ab_new.a.f_sub(from_xy);
            var d1 = one_or_two_moves[1].ab_new.a.f_sub(from_xy);

            //we need only nearest move
            var d0_is_less = (Math.abs(d0.x + d0.y) < Math.abs(d1.x + d1.y));
            return one_or_two_moves[d0_is_less ? 0 : 1];
        },

        //begin new move by clicking on cell_nx_ny
        f_begin: function (cell_nx_ny) {
            //check, if it is a domino
            var n28 = G.main_board.f_search_domino(cell_nx_ny);
            if (n28 == G.GAME.EMPTY_DOMINO) { return; }

            //check, that domino has moves
            var len = G.main_board.f_generate_moves_for_n28(n28);
            if (len == 0) { return; }

            //only for cells with movable domino renew G.SEL.OBJ
            G.SEL.OBJ = G.SEL.f_select_nxy(cell_nx_ny);
        },

        //finish move by clicking on cell_nx_ny
        f_end: function (cell_nx_ny) {
            //detect move to the pressed cell_nx_ny (if mo move detects, it will be null)
            var m = G.INTERACT.MOVE.f_detect(G.SEL.OBJ.last_cell_xy, cell_nx_ny);

            if (m != null) {
                G.main_board.f_do_move(m);
                G.main_moves.push(new G.F_MOVE(m.n28, m.ab_old, m.ab_new));
                G.SEL.f_set_null();
                return;
            }

            //move m is equal to null, so calculate n28_domino and proceed function f_end
            var n28_domino = G.main_board.f_search_domino(cell_nx_ny);
            var is_not_domino = (G.main_board.f_search_domino(cell_nx_ny) == G.GAME.EMPTY_DOMINO);

            //if we have no moves after clickint on cell_nx_ny, renew G.SEL.OBJ by G.SEL.f_set_null();
            if (is_not_domino || (G.main_board.f_generate_moves_for_n28(n28_domino).length == 0)) {
                G.SEL.f_set_null();
            } else {
                //try to select other move from cell_nx_ny
                G.INTERACT.MOVE.f_begin(cell_nx_ny);
            }
        }
    },

    BUTTON: {
        //stars current puzzle from the beginning
        f_press_REPLAY_GAME: function () {
            G.INTERACT.MOVE.UNDO.f_all();
            G.SEL.f_set_null();
            G.main_board.f_svg_draw(G.SEL.OBJ);
        },

        //start new game (with new position)
        f_press_F5: function () {
            //clear array with moves
            G.main_moves = [];
            
            //new permutation of dominos (maybe MIXED, maybe randomly ROTATED, and may be in HASHTAG)
            G.main_board.f_new_perm_28();
            G.SEL.f_set_null();
            G.main_board.f_svg_draw(G.SEL.OBJ);
        },

        //undo one move
        f_press_MOVE_BACK: function () {
            G.INTERACT.MOVE.UNDO.f_last();
            G.SEL.f_set_null();
            G.main_board.f_svg_draw(G.SEL.OBJ);
        },

        f_press_INFO: function () {
            var scroll_to_text_xy = G.EL.f_corner_coordinates(G.EL.DIV_RULE_TEXT);
            scroll_to_text_xy.y -= (G.AB.cell_wh.y * 2);
            window.scrollTo(scroll_to_text_xy.x, scroll_to_text_xy.y);
        }
    },

    //interactive events (with mouse and resizing)
    EVENT: {
        //click_on_cell on the game_board
        f_click_on_cell: function (cell_nxy) {
            if (G.SEL.OBJ.mode == "MODE_MOVE_BEGIN") {
                G.INTERACT.MOVE.f_begin(cell_nxy);
            } else {
                G.INTERACT.MOVE.f_end(cell_nxy);
            };

            //after f_begin() or f_end() always renew last_cell_xy
            G.SEL.OBJ.last_cell_xy = new G.F_XY(cell_nxy.x, cell_nxy.y);
            //after f_begin() or f_end() always redraw SVG
            G.main_board.f_svg_draw(G.SEL.OBJ);
        },

        //clicking on point is clicking on one cell
        f_click_on_point: function (clicked_event) {
            //if has no pageX, pageY, fix (for outdated browsers)
            G.EL.f_fix_page_xy(clicked_event);

            //special actions for buttons
            var arr_test_buttons = ["REPLAY_GAME", "F5", "MOVE_BACK", "INFO"];

            for (var i = 0; i < arr_test_buttons.length; i++) {
                var clicked_pixel_xy = G.EL.f_get_clicked_xy_on_SVG(clicked_event);

                if (G.ICONS.f_is_pixel_on_button(clicked_pixel_xy, arr_test_buttons[i])) {
                    G.INTERACT.BUTTON["f_press_" + arr_test_buttons[i]]();
                    return;
                }
            };

            for (var nxy = new G.F_XY(0, 0); nxy.x < G.main_board.nxy.x; nxy.x++) {
                for (nxy.y = 0; nxy.y < G.main_board.nxy.y; nxy.y++) {
                    //the cell_nx_ny is found, click it and exit;
                    if (G.AB.f_is_pxy_on_cell(clicked_event, nxy)) {
                        G.INTERACT.EVENT.f_click_on_cell(nxy);
                        return;
                    }
                }
            }
        },

        //resize window
        f_resize: function () {
            G.EL.f_set_element_sizes();
            G.AB.f_calculate_active_zone();
            G.main_board.f_svg_draw(G.SEL.OBJ);
        }

    }
};

G.EL.SVG.addEventListener("mousedown", G.INTERACT.EVENT.f_click_on_point);
G.main_board.f_svg_draw(G.SEL.OBJ);

G.INTERACT.EVENT.f_resize();
window.onresize = G.INTERACT.EVENT.f_resize;
