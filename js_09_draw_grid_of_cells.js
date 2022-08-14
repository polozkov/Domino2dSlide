//draw gameBoard's cells and ellipe hints
G.GRID_OF_CELLS = {
    //ellipse hint by center_xy and sizes_wh
    f_svg_one_ellipse: function (center, wh) {
        var cx = 'cx' + '="' + G.MATH.f_n_to_string(center.x) + '" ';
        var cy = 'cy' + '="' + G.MATH.f_n_to_string(center.y) + '" ';

        var rx = 'rx' + '="' + G.MATH.f_n_to_string(Math.abs(wh.x) / 2) + '" ';
        var ry = 'ry' + '="' + G.MATH.f_n_to_string(Math.abs(wh.y) / 2) + '"';

        return '<ellipse ' + cx + cy + rx + ry + '/>';
    },

    //cquare cell has coordinates nx_ny on board
    f_square_nxy: function (nx_ny, xy_corner, wh) {
        var id_of_square = G.MATH.f_id_of_cell_by_arr_nx_ny([nx_ny.x, nx_ny.y]);

        var x = 'x' + '="' + G.MATH.f_n_to_string(xy_corner.x) + '" ';
        var y = 'y' + '="' + G.MATH.f_n_to_string(xy_corner.y) + '" ';

        var w = 'width' + '="' + G.MATH.f_n_to_string(wh.x) + '" ';
        var h = 'height' + '="' + G.MATH.f_n_to_string(wh.y) + '" ';

        return '<rect id="' + id_of_square + '" ' + x + y + w + h + '/>';
    },

    //create all active cells, cells are grouped in ID_GRID_OF_CELLS
    f_draw_square_cells: function (active_zone, nxy) {
        var svg_cells = '';
        var wh = active_zone.f_get_wh().f_div(nxy);

        for (var ixy = new G.F_XY(0, 0); ixy.x < nxy.x; ixy.x++) {
            for (ixy.y = 0; ixy.y < nxy.y; ixy.y++) {
                var xy_corner = active_zone.f_cell_nxy(nxy, ixy).a;
                svg_cells += G.GRID_OF_CELLS.f_square_nxy(ixy, xy_corner, wh);
            }
        };

        return '\n<g id="ID_GRID_OF_CELLS" >' + svg_cells  + '</g>';
    }
};