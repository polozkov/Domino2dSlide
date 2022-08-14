V.CSS = {
    //rects for_each domino's ID, for example: "ID_00 rect, ID_13 rect ID_56 rect"
    f_selector_arr_n28_rects: function (arr_selected_n28) {
        var result_selection = ''; //css selector for gotten dominos
        for (var i = 0; i < arr_selected_n28.length; i++) {
            //from "ID_00" to "ID_66", but only needful (selected by arr_selected_n28)
            var i_id = G.MATH.f_id_by_n28(arr_selected_n28[i]);
            result_selection += ('#' + i_id) + ' rect, ';
        };
        return result_selection.slice(0, -2); //without ", " at the end 
    },

    f_fill_stroke_ratio: function (selector, fill_stroke_ratio, is_absolute) {
        if (selector == '') { return '' };

        //colors of pen and brush (for domino and circle dots)
        function f_fill_stroke(f, s) { return 'fill:' + f + '; stroke:' + s; }

        //line_width by real number that will by transfered in string without unUsing zeros
        function f_stroke_width(w) { return 'stroke-width:' + G.MATH.f_n_to_string(w) + ''; }

        //if line_width not absolute, scale it regarding G.AB.min_wh
        var scale_1_or_min_wh = ((is_absolute) ? 1: G.AB.min_wh);
        //'stroke-width: REAL_NUMBER'
        var w = f_stroke_width(scale_1_or_min_wh * fill_stroke_ratio.ratio);
        var fill_stroke = f_fill_stroke(fill_stroke_ratio.fill, fill_stroke_ratio.stroke);

        return ('\n' + selector + '{' + fill_stroke + ';' + w + '}' + '\n');
    },

    f_style_of_selected_squares: function (arr_selected_square_cells) {
        
        //selected dominos defined by arr_of_arr_01; result's example: "ID_0_0, ID_1_10, ID_10_3"
        function f_return_CSS_selector_to_select_square_cells(arr_of_arr_01) {
            var result_selection = ''; //css selector for celected cells
            for (var i = 0; i < arr_of_arr_01.length; i++) {
                var arr_01 = arr_of_arr_01[i];
                //"ID_00_00" .. "ID_10_10"
                var i_id = G.MATH.f_id_of_cell_by_arr_nx_ny(arr_01);
                result_selection += ('#ID_GRID_OF_CELLS #' + i_id) + ', ';
            };
            return result_selection.slice(0, -2); //without ", " at the end
        };

        var total_f_s_r = V.CSS.f_fill_stroke_ratio('#ID_GRID_OF_CELLS rect', V.SELECTED.SQUARES, false);
        var total_hidden = '#ID_GRID_OF_CELLS rect  {visibility: hidden}\n';

        //all selected
        var arr_id = f_return_CSS_selector_to_select_square_cells(arr_selected_square_cells);
        var arr_id_hidden = arr_id + ' {visibility: visible}\n';

        return (total_f_s_r + total_hidden + arr_id_hidden);
    }
};

//CSS styles for domino
V.f_gen_style = function (SEL) {

    //all circles (domino's dots)
    var circle_el = V.CSS.f_fill_stroke_ratio('g circle', V.DOMINO.CIRCLE_DOTS, false);
    //all rectangles (dominos)
    var rect_class = V.CSS.f_fill_stroke_ratio('rect', V.DOMINO.ROUND_RECTS, false);
    //all arrows (hints)
    var arrow_class = V.CSS.f_fill_stroke_ratio('polygon', V.ARROW, false);
    //ellipse hints for legal moves .ab_new (new domino position)
    var ellipses_hint = V.CSS.f_fill_stroke_ratio('ellipse', V.ELLIPSE_HINTS, false);
    //all polygons (arrows) must have round linejoin
    var arrow_linejoin = '\n' + 'polygon{stroke-linejoin: round}' + '\n';
    var CSS_FOR_UNSELECTED = circle_el + rect_class + arrow_class + ellipses_hint + arrow_linejoin;

    //all ID's of selected dominos, for example: "ID_00 rect, ID_13 rect ID_56 rect"
    var dominos_selected = V.CSS.f_selector_arr_n28_rects(SEL.sel_dominos);
    //style, where selector is for example, "ID_00 rect, ID_13 rect ID_56 rect"
    var dominos_css = V.CSS.f_fill_stroke_ratio(dominos_selected, V.SELECTED.RECTS, false);
    //select (mark by color) cells, when you win
    var cells_for_marking = SEL.sel_cells_winning_colorising;
    //show only marked squares
    var selected_and_unselected_grid = V.CSS.f_style_of_selected_squares(cells_for_marking);
    //style for makred dominos and cells
    var SELECTED_AND_GRID = dominos_css + selected_and_unselected_grid;

    //button's F5 and other (MOVE_BACK, GAME_RENEW)
    var buttons_F5_BACK = V.CSS.f_fill_stroke_ratio('path', V.BUTTONS, true);
    var all_styles = CSS_FOR_UNSELECTED + SELECTED_AND_GRID + buttons_F5_BACK;

    return '<style type="text/css">' + all_styles + '</style>';
};