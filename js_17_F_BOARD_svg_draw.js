//generate svg elements for 28 dominos and marked some of them
G.F_BOARD.prototype.f_svg_dominos_text = function () {
    var svg_28_dominos_result = '';

    for (var i = 0; i < 28; i++) {
        //semi_dominos square areas
        var ab0 = G.AB.f_rectangle_of_cell(this.dominos_ab[i].a);
        var ab1 = G.AB.f_rectangle_of_cell(this.dominos_ab[i].b);

        //array of 2 digits from [0,0] to [6,6]
        var both_n06 = G.DOMINO.ARR_SET_28[i];
        //add domino's svg text to the result
        var t = G.DOMINO.DRAW.f_domino_draw(both_n06, [ab0, ab1]);

        svg_28_dominos_result = svg_28_dominos_result + t;
    }

    return svg_28_dominos_result;
};

//generate ellipse_hints by 
G.F_BOARD.prototype.f_svg_ellipses_hints_by_arr_new_ab = function (arr_new_ab) {
    var svg_ellipses = '';

    for (var i = (arr_new_ab.length - 1); i >=0; i--) {
        //semi_dominos square areas
        var nab = arr_new_ab[i];
        var ab0 = G.AB.active_zone.f_cell_nxy(this.nxy, nab.a);
        var ab1 = G.AB.active_zone.f_cell_nxy(this.nxy, nab.b);
        var ab_rect = ab0.f_op_union(ab1);
        
        //generate arrow as symmetric polygon with 7 points (tip_point = coordinates_ab.b)
        var i_svg = G.GRID_OF_CELLS.f_svg_one_ellipse(ab_rect.f_get_center(), ab_rect.f_get_wh());

        svg_ellipses += i_svg;
    }

    return ('<g id=ID_HINT_ELLIPSES ">' + svg_ellipses + '</g>');
};

//generate arrows for all gotten legal moves
G.F_BOARD.prototype.f_svg_arrows_only_for_gotten_moves = function (arr_moves) {
    var svg_arrows = '';

    for (var i_move = 0; i_move < arr_moves.length; i_move++) {
        //pre-coordinates is coordinates regarding cell_0_0 with unit_1_1 equal to cell_w_h
        var pre_coordinates_ab = arr_moves[i_move].f_calculate_arrow_ab();
        //start and final poins define arrow
        var coordinates_ab = G.AB.TRANSFORM.f_ab(pre_coordinates_ab);
        //generate arrow as symmetric polygon with 7 points (tip_point = coordinates_ab.b)
        var i_svg = G.ARROW.f_generate_polygon_dots(coordinates_ab, V.ARROW.stretching_in_n_times);

        svg_arrows += i_svg;
    }

    return svg_arrows;
};

//draw SVG by information from board_object
G.F_BOARD.prototype.f_svg_draw = function (SEL) {
    //style depends of length of short domino's side and selected dominos and squares
    var CSS_style = V.f_gen_style(SEL);

    var svg_squares = G.GRID_OF_CELLS.f_draw_square_cells(G.AB.active_zone, this.nxy);
    var svg_hint_ellipses = this.f_svg_ellipses_hints_by_arr_new_ab(SEL.sel_hints_ab);
    var svg_dominos = this.f_svg_dominos_text(SEL.sel_dominos);
    var svg_hint_arrows = this.f_svg_arrows_only_for_gotten_moves(SEL.sel_m_arrows);
    var svg_buttons = G.ICONS.f_all_buttons();

    var SVG_total = svg_squares + svg_hint_ellipses + svg_dominos + svg_hint_arrows + svg_buttons;

    G.EL.SVG.innerHTML = CSS_style + SVG_total;
};