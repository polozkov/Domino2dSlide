//sizing and active board zone
G.AB = {
    f_calculate_active_zone: function () {
        //sizes of SVG
        var total_wh = G.F_XY.f_by_arr([G.EL.SVG.clientWidth, G.EL.SVG.clientHeight]);
        //cut 4 sides to inscribe line
        var border_cut = total_wh.f_scale(V.ratio_linewidth_to_gameboard_area);

        //cutten but not maximized area
        var ab_cutten = new G.F_AB(border_cut, total_wh.f_sub(border_cut));
        //maximized, centralized and cutten aree for game board
        var ab_final = ab_cutten;

        G.AB.board_nxy = G.F_XY.f_by_arr(V.board_sizes_01);

        //cell sizes (all cells has same sizes = wh / nxy)
        var wh_cell_final  = ab_final.f_get_wh().f_div(G.AB.board_nxy);
        var short_side = wh_cell_final.f_get_min();
        
        G.AB.active_zone = ab_final;
        G.AB.cell_wh = wh_cell_final;
        G.AB.min_wh = short_side;
    }
};

G.AB.f_calculate_active_zone();


G.AB.TRANSFORM = {
    //calculate point xy by gotten pre-coordinates
    f_xy: function (xy_in_grid_coordinates) {
        return xy_in_grid_coordinates.f_mult(G.AB.cell_wh).f_add(G.AB.active_zone.a);
    },

    //calculate area ab by gotten pre-coordinates
    f_ab: function (ab) {
        return new G.F_AB(G.AB.TRANSFORM.f_xy(ab.a), G.AB.TRANSFORM.f_xy(ab.b));
    },

    //area of cell on the game board
    f_ab_from_cell: function (nxy) {
        return G.AB.TRANSFORM.f_ab(new G.F_AB(nxy, nxy.f_add(G.F_XY.P11)));
    }
};

//Is clicking point (from GOTTEN_EVENT) inside borders of gotten_cell_nx_ny?
G.AB.f_is_pxy_on_cell = function (gotten_event, gotten_cell_nx_ny) {
    //rectangele area of gotten_cell_nx_ny
    var borders = G.AB.TRANSFORM.f_ab_from_cell(gotten_cell_nx_ny);
    //coordinates from the SVG corners
    var ex_ey = G.EL.f_get_clicked_xy_on_SVG(gotten_event);

    //check MINx < ex < MAXx, MINy < ey < MAXy
    return borders.f_has_pixel_inside(ex_ey);
};

//cell of the game board
G.AB.f_rectangle_of_cell = function (cell_xy) {
    return G.AB.active_zone.f_cell_nxy(G.AB.board_nxy, cell_xy);
};